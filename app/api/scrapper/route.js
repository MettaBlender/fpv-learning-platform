import { NextResponse } from "next/server"
import axios from "axios"
import * as cheerio from "cheerio"

// Define configurations for different websites
// IMPORTANT: You need to inspect the website's HTML to find the correct CSS selectors.
// This is a crucial step and will vary for every website.
const websiteConfigs = {
  "fpvracing.ch": {
    priceSelector: ".product-price", // Primary selector for the price
    currencyCode: "CHF", // Currency code to look for if selectors fail
    useHeadless: true, // Reverted to false, as fpvracing.ch usually works without headless
  },
  "fpvframe.ch": {
    // Common WooCommerce price selectors. You might need to adjust based on actual HTML.
    priceSelector: ".woocommerce-Price-amount bdi", // More specific than just 'bdi'
    fallbackPriceSelectors: ["p.price .amount", "ins .amount", ".price .amount"],
    currencyCode: "CHF",
    useHeadless: false, // Set to true, as this site might require headless for dynamic content
  },
  "dronefactory.ch": {
    priceSelector: "bdi", // Check if this is specific enough, or if a parent class is needed
    fallbackPriceSelectors: [".woocommerce-Price-currencySymbol", "span.amount"],
    currencyCode: "CHF",
    useHeadless: false,
  },
  "skystars-rc.com": {
    priceSelector: "bdi", // Check specificity
    fallbackPriceSelectors: [".woocommerce-Price-currencySymbol", "span.amount"],
    currencyCode: "$",
    useHeadless: false, // Often international sites use more dynamic loading
  },
  "fpv24.com": {
    currencyCode: "€",
    priceSelector: ".product--price", // Example for FPV24, verify with inspection
    fallbackPriceSelectors: [".price--default"],
    useHeadless: false,
  },
  "quadmula.com": {
    priceSelector: ".sale-price", // Changed to class selector
    currencyCode: "$",
    fallbackPriceSelectors: [".price-item--regular"], // Common for Shopify themes
    useHeadless: false, // Shopify sites often use client-side rendering
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

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const productUrl = searchParams.get("link")

  if (!productUrl) {
    return NextResponse.json({ error: "Missing product URL (use 'link' parameter)" }, { status: 400 })
  }

  let urlObj
  try {
    urlObj = new URL(productUrl)
  } catch (e) {
    return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
  }

  const hostname = urlObj.hostname.replace(/^www\./, "")
  const config = websiteConfigs[hostname]

  if (!config) {
    return NextResponse.json({ error: `No scraping configuration found for ${hostname}` }, { status: 404 })
  }

  let htmlContent = null
  let fetchMethodUsed = "none"
  const requestHeaders = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  }

  // --- NEW LOGIC: Use external scraping service if config.useHeadless is true ---
  if (config.useHeadless) {
    const BROWSERLESS_API_URL = process.env.BROWSERLESS_API_URL || "https://production-sfo.browserless.io/content" // Default Browserless content endpoint
    const BROWSERLESS_API_KEY = process.env.BROWSERLESS_API_KEY // Your API key

    if (!BROWSERLESS_API_KEY) {
      return NextResponse.json(
        {
          error: "Browserless API Key not configured. Set BROWSERLESS_API_KEY environment variable.",
        },
        { status: 500 },
      )
    }

    try {
      console.log(`Attempting to fetch ${productUrl} using Browserless.io headless service...`)
      const headers = {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
      }

      const serviceResponse = await fetch(`${BROWSERLESS_API_URL}?token=${BROWSERLESS_API_KEY}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          url: productUrl,
          // Optional Browserless.io parameters:
          // waitFor: 5000, // Wait for 5 seconds after page load
          // waitForSelector: config.priceSelector || 'body', // Wait for a specific element to appear
          // blockAds: true,
          // stealth: true,
        }),
        timeout: 30000, // Longer timeout for headless browser operations
      })

      if (!serviceResponse.ok) {
        const errorText = await serviceResponse.text()
        throw new Error(`Browserless API error! Status: ${serviceResponse.status}, Response: ${errorText}`)
      }

      htmlContent = await serviceResponse.text() // Correctly get text content
      fetchMethodUsed = "browserless_headless"
    } catch (serviceError) {
      console.error(`Browserless.io headless service failed for ${productUrl}:`, serviceError.message)
      return NextResponse.json(
        { error: `Failed to fetch URL with Browserless.io: ${serviceError.message}` },
        { status: 500 },
      )
    }
  } else {
    // --- EXISTING LOGIC: Use axios/fetch fallback for non-headless sites ---
    try {
      console.log(`Attempting to fetch ${productUrl} with axios...`)
      const axiosResponse = await axios.get(productUrl, {
        headers: requestHeaders,
        timeout: 10000,
      })
      htmlContent = axiosResponse.data
      fetchMethodUsed = "axios"
    } catch (axiosError) {
      console.warn(`Axios failed for ${productUrl}: ${axiosError.message}. Trying fetch...`)
      try {
        const fetchResponse = await fetch(productUrl, {
          headers: requestHeaders,
          signal: AbortSignal.timeout(10000), // 10 seconds timeout for fetch
        })

        if (!fetchResponse.ok) {
          throw new Error(`HTTP error! status: ${fetchResponse.status}`)
        }
        htmlContent = await fetchResponse.text()
        fetchMethodUsed = "fetch"
      } catch (fetchError) {
        console.error(`Fetch also failed for ${productUrl}: ${fetchError.message}`)
        return NextResponse.json(
          { error: `Failed to fetch URL with both axios and fetch: ${fetchError.message}` },
          { status: 500 },
        )
      }
    }
  }

  if (!htmlContent) {
    return NextResponse.json({ error: "Could not retrieve HTML content from the URL." }, { status: 500 })
  }

  console.log(`Successfully fetched ${productUrl} using ${fetchMethodUsed}. Scraping with config:`, config)

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
    // Attempt to extract numerical price if a price-related type was found
    let numericalPrice = null
    if (result.type.startsWith("price_")) {
      numericalPrice = extractPriceNumber(result.value)
    }

    return NextResponse.json({
      url: productUrl,
      type: result.type,
      rawValue: result.value, // The raw text found
      numericalValue: numericalPrice, // The cleaned numerical price
    })
  } else {
    return NextResponse.json(
      {
        error: "No price or specified element content found using configured methods.",
        pageSnippet: htmlContent.substring(0, 500) + "...", // Return snippet of page for debugging
      },
      { status: 404 },
    )
  }
}
