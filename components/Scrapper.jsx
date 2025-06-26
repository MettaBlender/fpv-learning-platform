"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button" // Stellen Sie sicher, dass der Pfad korrekt ist
import { toast } from "sonner"

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
  const [serverStatus, setServerStatus] = useState(false)
  const [newComponent, setNewComponent] = useState({})

  const componentGroup = ["frame", "motors", "esc", "fc", "props", "battery", "camera"]
  const statusIntervalRef = useRef(null) // Ref für den Interval-Timer

  // Environment variable for the scraping service URL
  const CUSTOM_SCRAPING_SERVICE_URL = process.env.NEXT_PUBLIC_CUSTOM_SCRAPING_SERVICE_URL || "http://localhost:3001" //"https://fpv-scrapper.onrender.com"


  useEffect(() => {
    const getServerStatus = async () => {
      try {
        const response = await fetch(CUSTOM_SCRAPING_SERVICE_URL)
        if (response.ok) {
          setServerStatus(true)
        } else {
          setServerStatus(false)
        }
      } catch (err) {
        setServerStatus(false)
      }
    }

    const Interval = setInterval(() => {
      getServerStatus()}, 10000)

    return () => {
      clearInterval(Interval)
    }
  }, [])


  // Funktion zum Abfragen des aktuellen Scraping-Status vom Server
  const fetchScrapingStatus = async () => {
    try {
      const response = await fetch(`${CUSTOM_SCRAPING_SERVICE_URL}/scrape-status`, {
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
        setNewComponent(statusData.componentsData)

        console.log("old Comoponents:", componentsOld, "new Components:", statusData.componentsData)

        // Interval-Timer basierend auf dem Server-Status verwalten
        if (statusData.isRunning) {
          // Starte den Interval nur, wenn er noch nicht läuft
          if (!statusIntervalRef.current) {
            statusIntervalRef.current = setInterval(fetchScrapingStatus, 15000) // Alle 15 Sekunden abfragen
            console.log("Started polling for scraping status.")
          }
        } else {
          // Stoppe den Interval, wenn der Job beendet ist
          if (statusIntervalRef.current) {
            clearInterval(statusIntervalRef.current)
            statusIntervalRef.current = null // Ref zurücksetzen
            setStatus("Scraping job finished.")
            console.log("Scraping job finished. Final results:", statusData.results)
          }
        }
      } else {
        const errorData = await response.json()
        console.error("Failed to fetch scraping status:", errorData)
        setStatus(`Failed to fetch status: ${errorData.error || "Unknown error"}`)
        setIsScrapingRunning(false)
        // Stoppe den Interval auch bei Fehlern
        if (statusIntervalRef.current) {
          clearInterval(statusIntervalRef.current)
          statusIntervalRef.current = null
        }
      }
    } catch (err) {
      console.error("Error fetching scraping status:", err)
      setStatus(`Error fetching status: ${err.message}`)
      setIsScrapingRunning(false)
      // Stoppe den Interval auch bei Netzwerkfehlern
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current)
        statusIntervalRef.current = null
      }
    }
  }

  useEffect(() => {
    const loadInitialDataAndStatus = async () => {
      await getServerStatus() // Prüft den Render-Dienst-Status
      const data = await getData() // Holt die Links aus Ihrer Next.js API
      if (data) {
        setComponentsOld(data)
      }
      // Sofort den aktuellen Scraping-Status vom Server abfragen
      // Dies wird auch den Polling-Interval starten, falls ein Job läuft
      await fetchScrapingStatus()
    }

    loadInitialDataAndStatus()

    // Cleanup-Funktion für den Interval-Timer beim Unmounten der Komponente
    return () => {
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current)
        statusIntervalRef.current = null
      }
    }
  }, []) // Leeres Dependency-Array bedeutet, dass dies nur einmal beim Mounten ausgeführt wird

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
      // Sende die Links direkt an den Render-Dienst
      const response = await fetch(`${CUSTOM_SCRAPING_SERVICE_URL}/start-batch-scrape`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ components: componentsOld }),
        signal: AbortSignal.timeout(60000), // Timeout für die Startanfrage
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Scraping job initiation response:", data)
        setStatus("Scraping job initiated on Render service.")
        // Sofort den Status abfragen, um UI zu aktualisieren und Polling zu starten
        await fetchScrapingStatus()
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

  const getServerStatus = async () => {
    // Prüft den Health-Check-Endpunkt des Render-Dienstes direkt
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

  const handleUpdatePrice = async (type, link, price, id) => {
    try {
      const method = "PUT" // Assuming PUT for update, POST for add
      const response = await fetch("/api/price", {
        // You might need a different API endpoint for updates
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({component: type, link, price, id }),
      })

      if (!response.ok) {
        toast.error(`Fehler beim Aktualisieren des Komponenten preises`)
        return
      }

      const data = await response.json()
      toast.success(`Preis erfolgreich aktualisiert`)
      window.location.reload() // Reload the page to see the updated data
    } catch (error) {
      console.error("Fehler:", error)
      toast.error(`Fehler beim Aktualisieren des Preises`)
    }
  }

  return (
    <div className="w-full flex flex-col items-center justify-center p-4 relative">
      <h1 className="text-4xl font-bold text-center mb-2">Scrapper</h1>
      <p className={`absolute top-[-1rem] right-1 flex items-center ${serverStatus ? 'text-green-500' : 'text-red-500'}`}><span className="text-6xl pt-0.5 mr-1">•</span> {serverStatus ? 'Server läuft' : 'Server Gestoppt'}</p>
      <div className="grid grid-cols-3 gap-4 mb-4 w-full">
        <div className="h-[90dvh] col-span-2">
          <p className="mb-4">{status}</p>
          <Button onClick={startScrapingJob} disabled={isScrapingRunning} className="mb-4">
            {isScrapingRunning ? "Scraping läuft..." : "Preise scrappen starten"}
          </Button>
          <div className="flex flex-col gap-2">
            {componentGroup.map((group) => (
              componentsOld[group]
              ?.filter((component) => {
                // Sicherstellen, dass component gültige Daten hat
                if (!component.link || component.price === undefined) {
                  console.log(`Überspringe ${group}: Ungültige Daten für component`);
                  return false;
                }

                // Sicherstellen, dass newComponent[group] existiert und ein Array ist
                if (!newComponent[group] || !Array.isArray(newComponent[group])) {
                  console.log(`Überspringe ${group}: newComponent[group] ist kein Array oder existiert nicht`);
                  return false;
                }

                // Finde das entsprechende Component in newComponent[group] mit dem gleichen Link
                const matchingNewComponent = newComponent[group].find(newComp =>
                  newComp.link === component.link
                );

                // Prüfe ob ein matching Component gefunden wurde und der Preis unterschiedlich ist
                if (matchingNewComponent && matchingNewComponent.price !== undefined) {
                  return matchingNewComponent.price !== component.price;
                }

                return false; // Kein matching Component gefunden oder ungültige Daten
              })
              .map((component, index) => {
                // Finde das entsprechende neue Component mit dem gleichen Link
                const matchingNewComponent = newComponent[group]?.find(newComp =>
                  newComp.link === component.link
                );

                return (
                  <div className="grid grid-cols-2 gap-4" key={index}>
                    {/* Alte Daten */}
                    <div className="w-full p-2 bg-red-500 rounded-md">
                      <h3 className="text-lg font-semibold mb-1 text-white">ALT</h3>
                      <h2 className="text-xl font-semibold mb-2">{component.name}</h2>
                      <p>Preis: {component.price} CHF</p>
                      <p>Shop: {component.shop}</p>
                      <p>Link: <a href={component.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{component.link}</a></p>
                      {component.imageurl && <img src={component.imageurl} alt={component.name} className="w-32 h-32 object-cover mt-2" />}
                    </div>

                    {/* Neue Daten */}
                    <div className="w-full p-2 bg-green-500 rounded-md">
                      <h3 className="text-lg font-semibold mb-1 text-white">NEU</h3>
                      <h2 className="text-xl font-semibold mb-2">{matchingNewComponent?.name || component.name}</h2>
                      <p>Preis: {matchingNewComponent?.price || 'N/A'} CHF</p>
                      <p>Shop: {matchingNewComponent?.shop || component.shop}</p>
                      <p>Link: <a href={matchingNewComponent?.link || component.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{matchingNewComponent?.link || component.link}</a></p>
                      {matchingNewComponent?.imageurl && <img src={matchingNewComponent.imageurl} alt={matchingNewComponent.name} className="w-32 h-32 object-cover mt-2" />}
                      <Button onClick={() => handleUpdatePrice(group, matchingNewComponent?.link, matchingNewComponent?.price, matchingNewComponent?.id)}>Preis Aktualisieren</Button>
                    </div>
                  </div>
                );
              })
            ))}
          </div>
        </div>
        <div className="bg-background h-[90dvh] col-span-1 p-1 px-2 rounded-md">
          <p>
            Verarbeitete Links: {anzScrappedLinks} / {anzLinks}
          </p>
          <p>Aktueller Link: {actuelLink}</p>
          <p>Letzter gescrappter Wert: {lastScrapedValue ? `${lastScrapedValue} CHF` : "N/A"}</p>
          <p className="text-green-500">Erfolge: {success}</p>
          <p className="text-red-500">Fehler: {error}</p>
        </div>
      </div>
    </div>
  )
}

export default Scrapper
