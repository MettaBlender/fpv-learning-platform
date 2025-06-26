import { NextResponse } from "next/server"
import axios from "axios"
import * as cheerio from "cheerio"
import { update_component_price } from "@/lib/db"

// Define configurations for different websites
// IMPORTANT: You need to inspect the website's HTML to find the correct CSS selectors.
// This is a crucial step and will vary for every website.
const websiteConfigs = {
  "fpvracing.ch": {
    priceSelector: ".product-price", // Primary selector for the price
    currencyCode: "CHF", // Currency code to look for if selectors fail
    useHeadless: true, // This site seems to work without a headless browser
  },
  "fpvframe.ch": {
    // Common WooCommerce price selectors. You might need to adjust based on actual HTML.
    priceSelector: ".woocommerce-Price-amount bdi", // More specific than just 'bdi'
    fallbackPriceSelectors: ["p.price .amount", "ins .amount", ".price .amount"], // Added fallback selectors
    currencyCode: "CHF",
    useHeadless: false, // Set to true, as this site might require a headless browser due to previous 404 or dynamic content
  },
  "dronefactory.ch": {
    priceSelector: "bdi", // Check if this is specific enough, or if a parent class is needed
    fallbackPriceSelectors: [".woocommerce-Price-currencySymbol", "span.amount"], // Added fallback selectors
    currencyCode: "CHF",
    useHeadless: false,
  },
  "skystars-rc.com": {
    priceSelector: "bdi", // Check specificity
    fallbackPriceSelectors: [".woocommerce-Price-currencySymbol", "span.amount"], // Added fallback selectors
    currencyCode: "$",
    useHeadless: true, // Often international sites use more dynamic loading
  },
  "fpv24.com": {
    currencyCode: "€",
    priceSelector: ".product--price", // Example for FPV24, verify with inspection
    fallbackPriceSelectors: [".price--default"], // Added fallback selectors
    useHeadless: false,
  },
  "quadmula.com": {
    priceSelector: ".sale-price", // Changed to class selector
    currencyCode: "$",
    fallbackPriceSelectors: [".price-item--regular"], // Common for Shopify themes
    useHeadless: true, // Shopify sites often use client-side rendering
  },
  // Add more configurations for other websites here
  // 'example-dynamic-site.com': {
  //   priceSelector: '#dynamic-price',
  //   currencyCode: 'USD',
  //   useHeadless: true, // Mark as needing headless
  // },
}

// Helper function to try scraping with multiple selectors
function tryScraping($, selectors) {
  for (const selector of selectors) {
    const element = $(selector)
    if (element.length > 0) {
      // If it's a meta tag, get the 'content' attribute
      if (element.is("meta") && element.attr("content")) {
        return element.attr("content")?.trim() || null
      }
      // Otherwise, get the text content
      return element.first().text().trim()
    }
  }
  return null
}

// Helper function to find price by currency pattern
function findPriceByCurrencyPattern($, currencyCode) {
  if (!currencyCode) return null

  // Regex to find numbers that look like prices, optionally followed or preceded by the currency code.
  // Handles common decimal/thousand separators (.,' )
  // Example: 123.45 CHF, CHF 123.45, 1'234.50 CHF, 1.234,50 €
  const priceRegex = new RegExp(
    `(\\d{1,3}(?:[.,'\\s]\\d{3})*(?:[.,]\\d{1,2})?)\\s*${currencyCode}|${currencyCode}\\s*(\\d{1,3}(?:[.,'\\s]\\d{3})*(?:[.,]\\d{1,2})?)`,
    "i", // Case-insensitive for currency code
  )

  // Search in common price-holding elements first, then in the entire body
  const potentialPriceElements = $("span, div, b, strong, p, h1, h2, h3, body")

  let foundPrice = null
  potentialPriceElements.each((i, el) => {
    const text = $(el).text()
    const match = text.match(priceRegex)
    if (match) {
      // The price could be in group 1 (before currency) or group 2 (after currency)
      foundPrice = (match[1] || match[2]).trim()
      return false // Stop iteration once a price is found
    }
  })

  return foundPrice
}

/**
 * Extracts a clean numerical price from a price string.
 * Handles various formats like "CHF 123.45", "1'234.50", "€123,45".
 * @param {string} priceString The raw price string.
 * @returns {number | null} The numerical price or null if parsing fails.
 */
function extractPriceNumber(priceString) {
  if (!priceString) return null

  // Remove any non-numeric characters except for digits, comma, dot, and apostrophe
  let cleanedString = priceString.replace(/[^0-9.,']/g, "").trim()

  // Determine decimal and thousand separators
  // If both comma and dot exist, assume dot is thousand separator and comma is decimal (e.g., 1.234,50)
  // Otherwise, if only comma exists, assume it's decimal (e.g., 123,45)
  // If only dot exists, assume it's decimal (e.g., 123.45)
  if (cleanedString.includes(",") && cleanedString.includes(".")) {
    // European format: 1.234,50 -> remove dots, replace comma with dot
    cleanedString = cleanedString.replace(/\./g, "").replace(/,/g, ".")
  } else if (cleanedString.includes(",")) {
    // German/French format: 123,45 -> replace comma with dot
    cleanedString = cleanedString.replace(/,/g, ".")
  } else if (cleanedString.includes("'")) {
    // Swiss format: 1'234.50 -> remove apostrophe
    cleanedString = cleanedString.replace(/'/g, "")
  }

  // Remove any remaining thousand separators (e.g., spaces)
  cleanedString = cleanedString.replace(/\s/g, "")

  const price = Number.parseFloat(cleanedString)

  return isNaN(price) ? null : price
}

// This is the core scraping logic for a single URL
async function scrapeSingleUrl(productUrl, config) {
  let htmlContent = null
  let fetchMethodUsed = "none"
  const requestHeaders = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  }

  // Use external scraping service if config.useHeadless is true
  if (config.useHeadless) {
    const CUSTOM_SCRAPING_SERVICE_URL = process.env.CUSTOM_SCRAPING_SERVICE_URL || "http://localhost:3002/scrape-html" // "https://fpv-scrapper.onrender.com/scrape-html"

    if (!CUSTOM_SCRAPING_SERVICE_URL) {
      return {
        url: productUrl,
        status: "error",
        message: "Custom scraping service URL not configured.",
      }
    }

    try {
      console.log(`[Batch Scraper] Attempting to fetch ${productUrl} via custom headless service...`)
      const serviceCallUrl = `${CUSTOM_SCRAPING_SERVICE_URL}?url=${encodeURIComponent(productUrl)}`

      const serviceResponse = await fetch(serviceCallUrl, {
        method: "GET",
        // Timeout für headless-Service-Aufruf beibehalten, um Hängenbleiben zu vermeiden
        signal: AbortSignal.timeout(600000), // 10 Minuten Timeout
      })

      if (!serviceResponse.ok) {
        const errorDetails = await serviceResponse.text()
        throw new Error(`Service error! Status: ${serviceResponse.status}, Details: ${errorDetails}`)
      }

      htmlContent = await serviceResponse.text()
      fetchMethodUsed = "custom_headless_service"
    } catch (serviceError) {
      console.error(`[Batch Scraper] Custom headless service failed for ${productUrl}:`, serviceError.message)
      return {
        url: productUrl,
        status: "error",
        message: `Failed to fetch via custom headless service: ${serviceError.message}`,
      }
    }
  } else {
    // Fallback for non-headless sites (axios/fetch)
    try {
      console.log(`[Batch Scraper] Attempting to fetch ${productUrl} with axios...`)
      const axiosResponse = await axios.get(productUrl, {
        headers: requestHeaders,
        timeout: 100000,
      })
      htmlContent = axiosResponse.data
      fetchMethodUsed = "axios"
    } catch (axiosError) {
      console.warn(`[Batch Scraper] Axios failed for ${productUrl}: ${axiosError.message}. Trying fetch...`)
      try {
        const fetchResponse = await fetch(productUrl, {
          headers: requestHeaders,
          signal: AbortSignal.timeout(100000),
        })

        if (!fetchResponse.ok) {
          throw new Error(`HTTP error! status: ${fetchResponse.status}`)
        }
        htmlContent = await fetchResponse.text()
        fetchMethodUsed = "fetch"
      } catch (fetchError) {
        console.error(`[Batch Scraper] Fetch also failed for ${productUrl}: ${fetchError.message}`)
        return {
          url: productUrl,
          status: "error",
          message: `Failed to fetch URL with both axios and fetch: ${fetchError.message}`,
        }
      }
    }
  }

  if (!htmlContent) {
    return { url: productUrl, status: "error", message: "Could not retrieve HTML content." }
  }

  console.log(`[Batch Scraper] Successfully fetched HTML for ${productUrl} using ${fetchMethodUsed}.`)

  const $ = cheerio.load(htmlContent)
  let result = null
  let rawPriceText = null

  // 1. Attempt to find price using primary selector
  if (config.priceSelector) {
    rawPriceText = tryScraping($, [config.priceSelector])
    if (rawPriceText) {
      result = { type: "price_selector", value: rawPriceText }
    }
  }

  // 2. If no price found, attempt with fallback price selectors
  if (!result && config.fallbackPriceSelectors && config.fallbackPriceSelectors.length > 0) {
    rawPriceText = tryScraping($, config.fallbackPriceSelectors)
    if (rawPriceText) {
      result = { type: "price_fallback_selector", value: rawPriceText }
    }
  }

  // 3. If still no price found, attempt to find price by currency pattern
  if (!result && config.currencyCode) {
    rawPriceText = findPriceByCurrencyPattern($, config.currencyCode)
    if (rawPriceText) {
      result = { type: "price_currency_pattern", value: rawPriceText }
    }
  }

  // 4. If still no price found, and elementSelector is defined, attempt to get general element content
  if (!result && config.elementSelector) {
    const elementContent = tryScraping($, [config.elementSelector])
    if (elementContent) {
      result = { type: "element_content", value: elementContent }
    }
  }

  if (result) {
    let numericalPrice = null
    if (result.type.startsWith("price_")) {
      numericalPrice = extractPriceNumber(result.value)
    }

    return {
      url: productUrl,
      status: "success",
      type: result.type,
      rawValue: result.value,
      numericalValue: numericalPrice,
    }
  } else {
    return {
      url: productUrl,
      status: "not_found",
      message: "No price or specified element content found using configured methods.",
      pageSnippet: htmlContent.substring(0, 500) + "...",
    }
  }
}

// Main Route Handler for batch scraping
export async function POST(request) {
  const CUSTOM_SCRAPING_SERVICE_URL = process.env.CUSTOM_SCRAPING_SERVICE_URL || "http://localhost:3001" // Ihr Render-Dienst

  if (!CUSTOM_SCRAPING_SERVICE_URL) {
    return NextResponse.json({ error: "Custom scraping service URL not configured." }, { status: 500 })
  }

  let links = []
  try {
    const body = await request.json()
    links = body.links
    if (!Array.isArray(links) || links.length === 0) {
      return NextResponse.json({ error: "Request body must contain a non-empty 'links' array." }, { status: 400 })
    }
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body or missing 'links' array." }, { status: 400 })
  }

  try {
    console.log(
      `[Next.js Route] Forwarding batch scrape request to Render service: ${CUSTOM_SCRAPING_SERVICE_URL}/start-batch-scrape`,
    )
    const serviceResponse = await fetch(`${CUSTOM_SCRAPING_SERVICE_URL}/start-batch-scrape`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ links: links }),
      // Timeout für die Anfrage an den Render-Dienst, falls dieser nicht antwortet
      signal: AbortSignal.timeout(60000), // 60 Sekunden Timeout
    })

    const responseData = await serviceResponse.json()

    if (!serviceResponse.ok) {
      console.error("[Next.js Route] Error from Render service:", responseData)
      return NextResponse.json(
        { error: responseData.error || "Failed to start scraping job on Render service." },
        { status: serviceResponse.status },
      )
    }

    // Der Render-Dienst gibt hier nur eine Bestätigung zurück, dass der Job gestartet wurde.
    // Die eigentlichen Ergebnisse müssen über den Status-Endpunkt abgefragt werden.
    return NextResponse.json(
      { message: "Scraping job initiated on Render service.", status: responseData.status },
      { status: 202 },
    )
  } catch (error) {
    console.error("[Next.js Route] Error communicating with Render service:", error)
    return NextResponse.json(
      { error: `Failed to communicate with scraping service: ${error.message}` },
      { status: 500 },
    )
  }
}

// Optional: Ein GET-Endpunkt, um den Status vom Render-Dienst abzufragen
export async function GET(request) {
  const CUSTOM_SCRAPING_SERVICE_URL = process.env.CUSTOM_SCRAPING_SERVICE_URL || "http://localhost:3001"

  if (!CUSTOM_SCRAPING_SERVICE_URL) {
    return NextResponse.json({ error: "Custom scraping service URL not configured." }, { status: 500 })
  }

  try {
    const serviceResponse = await fetch(`${CUSTOM_SCRAPING_SERVICE_URL}/scrape-status`, {
      method: "GET",
      signal: AbortSignal.timeout(10000), // Kurzes Timeout für Statusabfrage
    })

    if (!serviceResponse.ok) {
      const errorDetails = await serviceResponse.text()
      throw new Error(`Service error! Status: ${serviceResponse.status}, Details: ${errorDetails}`)
    }

    const statusData = await serviceResponse.json()
    return NextResponse.json(statusData, { status: 200 })
  } catch (error) {
    console.error("[Next.js Route] Error fetching status from Render service:", error)
    return NextResponse.json(
      { error: `Failed to fetch status from scraping service: ${error.message}` },
      { status: 500 },
    )
  }
}


export async function PUT(request) {
    const data = await request.json();
    if (!data || !data.component || !data.price || !data.link || !data.id) {
        console.log("Fehlende erforderliche Felder", data);
        return NextResponse.json({error: "Fehlende erforderliche Felder"}, { status: 400 })
    }

    const response = await update_component_price(data);

    console.log("Received data:", response);

    if (!response) {
        return NextResponse.json({data: data}, { status: 400 })
    }

    return NextResponse.json({data: response}, { status: 200 })
}