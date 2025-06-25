"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button" // Stellen Sie sicher, dass der Pfad korrekt ist

const Scrapper = () => {
  const [status, setStatus] = useState("")
  const [componentsOld, setComponentsOld] = useState([])
  const [anzLinks, setAnzLinks] = useState(0)
  const [anzScrappedLinks, setAnzScrappedLinks] = useState(0)
  const [actuelLink, setActualLink] = useState("")
  const [lastScrapedValue, setLastScrapedValue] = useState(0.0)
  const [success, setSuccess] = useState(0)
  const [error, setError] = useState(0)
  const [isScrapingRunning, setIsScrapingRunning] = useState(false)

  const componentGroup = ["frame", "motors", "esc", "fc", "props", "battery", "camera"]
  const statusIntervalRef = useRef(null) // Ref für den Interval-Timer

  useEffect(() => {
    const loadInitialData = async () => {
      await getServerStatus() // Prüft den Render-Dienst
      const data = await getData() // Holt die Links aus Ihrer Next.js API
      if (data) {
        setComponentsOld(data)
      }
    }

    loadInitialData()

    // Cleanup-Funktion für den Interval-Timer
    return () => {
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current)
      }
    }
  }, [])

  const getData = async () => {
    // Diese API-Route muss die Komponenten-Links liefern
    const response = await fetch("/api")
    if (response.ok) {
      const data = await response.json()
      console.log("Fetched components data:", data)
      // Annahme: Ihre /api gibt ein Objekt mit einem 'data'-Array zurück,
      // und die Komponenten sind in data[0].components[0]
      return data.data && data.data.length > 0 ? data.data[0].components[0] : []
    } else {
      console.error("Failed to fetch components data:", response.status, await response.text())
      return []
    }
  }

  const getLinksfromComponents = () => {
    if (!componentsOld || componentsOld.length === 0) {
      console.log("No components found to extract links from.")
      return []
    }

    let links = []
    componentGroup.forEach((group) => {
      if (componentsOld[group] && Array.isArray(componentsOld[group])) {
        const groupLinks = componentsOld[group].map((component) => component.link).filter(Boolean) // Filtert leere Links
        links = [...links, ...groupLinks]
      }
    })
    console.log("Extracted links from components:", links)
    return links
  }

  const startScrapingJob = async () => {
    const linksToScrape = getLinksfromComponents()
    if (!linksToScrape || linksToScrape.length === 0) {
      console.log("No links found to start scraping job.")
      return
    }

    setAnzLinks(linksToScrape.length)
    setAnzScrappedLinks(0)
    setActualLink("Starting batch scrape on server...")
    setSuccess(0)
    setError(0)
    setLastScrapedValue(0.0)
    setIsScrapingRunning(true)

    try {
      // Sende die Links an Ihre Next.js API Route, die sie an den Render-Dienst weiterleitet
      const response = await fetch("/api/price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ links: linksToScrape }),
        signal: AbortSignal.timeout(60000), // Timeout für die Startanfrage
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Scraping job initiation response:", data)
        setStatus("Scraping job initiated on Render service.")
        // Starte das Polling für den Status
        if (statusIntervalRef.current) {
          clearInterval(statusIntervalRef.current)
        }
        statusIntervalRef.current = setInterval(fetchScrapingStatus, 5000) // Alle 5 Sekunden abfragen
      } else {
        const errorData = await response.json()
        console.error("Failed to initiate scraping job:", errorData)
        setStatus(`Failed to initiate scraping job: ${errorData.error || "Unknown error"}`)
        setIsScrapingRunning(false)
      }
    } catch (err) {
      console.error("Error during scraping job initiation:", err)
      setStatus(`Error initiating scraping job: ${err.message}`)
      setIsScrapingRunning(false)
    }
  }

  const fetchScrapingStatus = async () => {
    try {
      // Frage den Status direkt von Ihrer Next.js API Route ab
      const response = await fetch("/api/price", {
        method: "GET",
        signal: AbortSignal.timeout(10000), // Kurzes Timeout für Statusabfrage
      })

      if (response.ok) {
        const statusData = await response.json()
        console.log("Scraping status:", statusData)
        setAnzLinks(statusData.totalLinks)
        setAnzScrappedLinks(statusData.processedLinks)
        setSuccess(statusData.successCount)
        setError(statusData.errorCount + statusData.notFoundCount)
        setActualLink(statusData.currentLink || "N/A")
        setLastScrapedValue(statusData.lastScrapedValue || 0.0)
        setIsScrapingRunning(statusData.isRunning)

        if (!statusData.isRunning && statusIntervalRef.current) {
          clearInterval(statusIntervalRef.current) // Stoppe das Polling, wenn der Job beendet ist
          setStatus("Scraping job finished.")
          console.log("Scraping job finished. Final results:", statusData.results)
        }
      } else {
        const errorData = await response.json()
        console.error("Failed to fetch scraping status:", errorData)
        setStatus(`Failed to fetch status: ${errorData.error || "Unknown error"}`)
        setIsScrapingRunning(false)
        if (statusIntervalRef.current) {
          clearInterval(statusIntervalRef.current)
        }
      }
    } catch (err) {
      console.error("Error fetching scraping status:", err)
      setStatus(`Error fetching status: ${err.message}`)
      setIsScrapingRunning(false)
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current)
      }
    }
  }

  const getServerStatus = async () => {
    // Prüft den Health-Check-Endpunkt des Render-Dienstes direkt
    const CUSTOM_SCRAPING_SERVICE_URL = process.env.NEXT_PUBLIC_CUSTOM_SCRAPING_SERVICE_URL || "http://localhost:3001"
    try {
      const response = await fetch(CUSTOM_SCRAPING_SERVICE_URL)
      if (response.ok) {
        setStatus(`Scraping Server is running`)
      } else {
        setStatus(`Scraping Server is down or unreachable (Status: ${response.status})`)
      }
    } catch (err) {
      setStatus(`Scraping Server is down or unreachable: ${err.message}`)
    }
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold">Scrapper</h1>
      <Button onClick={getServerStatus} className="mb-2">
        Get Server Status
      </Button>
      <p className="mb-4">{status}</p>
      <Button onClick={startScrapingJob} disabled={isScrapingRunning} className="mb-4">
        {isScrapingRunning ? "Scraping läuft..." : "Preise scrappen starten"}
      </Button>
      <p>
        Verarbeitete Links: {anzScrappedLinks} / {anzLinks}
      </p>
      <p>Aktueller Link: {actuelLink}</p>
      <p>Letzter gescrappter Wert: {lastScrapedValue ? `${lastScrapedValue} CHF` : "N/A"}</p>
      <p className="text-green-500">Erfolge: {success}</p>
      <p className="text-red-500">Fehler: {error}</p>
    </div>
  )
}

export default Scrapper
