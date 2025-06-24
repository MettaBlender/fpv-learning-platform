import React, {useState, useEffect} from 'react'
import { Button } from './ui/button'

const Scrapper = () => {

  const [status, setStatus] = useState('')
  const [componentsOld, setComponentsOld] = useState([])
  const [links, setLinks] = useState([])
  const [anzLinks, setAnzLinks] = useState(0)
  const [anzScrappedLinks, setAnzScrappedLinks] = useState(0)
  const [actuelLink, setActualLink] = useState('')
  const [lastScrappedValue, setLastScrappedValue] = useState(0.0)
  const [success, setSuccess] = useState(0)
  const [error, setError] = useState(0)

  const componentGroup = ["frame", "motors", "esc", "fc", "props", "battery", "camera"]

  useEffect(() => {
    const load = async () => {
      await getServerStatus()
      const data = await getData()
      setComponentsOld(data);
    }

    load()
  }, [])

  const getData = async () => {
    const response = await fetch('/api')
    if (response.ok) {
      const data = await response.json()
      console.log(data.data[0].components[0])
      return data.data[0].components[0]
    }
  }

  const getLinksfromCompnents = () => {
    if (componentsOld.length === 0) {
      console.log('No components found')
      return
    }

    let links = []


    componentGroup.map(group => {
      const link = componentsOld[group].map(component => component.link)
      links = [...links, ...link]
    })
    // console.log('Links from components:', links)
    return links
  }

  const scrapp = async () => {
  const links = getLinksfromCompnents() // Diese Funktion bleibt client-seitig
  if (!links || links.length === 0) {
    console.log('No links found to scrape')
    return
  }

  setAnzLinks(links.length)
  setAnzScrappedLinks(0) // Diese States werden jetzt vom Batch-Ergebnis aktualisiert
  setActualLink('Starting batch scrape...') // Angepasste Meldung

  try {
    const response = await fetch('/api/scrapper', { // POST-Anfrage an Ihre Route
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ links: links }), // Links im Body senden
      signal: AbortSignal.timeout(1200000), // Längeres Timeout für Batch (z.B. 2 Minuten)
    })

    if (response.ok) {
      const batchResult = await response.json()
      console.log('Batch scraping results:', batchResult)

      // Aktualisieren Sie Ihre States basierend auf dem Batch-Ergebnis
      setAnzScrappedLinks(batchResult.totalLinks)
      setSuccess(batchResult.successCount)
      setError(batchResult.errorCount + batchResult.notFoundCount) // Fehler + nicht gefunden
      setLastScrappedValue('Batch finished.') // Oder eine andere Abschlussmeldung

      // Wenn Sie die einzelnen Werte anzeigen möchten, können Sie batchResult.results durchgehen
      // Beispiel:
      // batchResult.results.forEach(item => {
      //   if (item.status === 'success') {
      //     console.log(`Scraped ${item.url}: ${item.numericalValue}`);
      //   } else {
      //     console.error(`Failed ${item.url}: ${item.message}`);
      //   }
      // });

      return batchResult
    } else {
      const errorData = await response.json()
      console.error('Failed to start batch scrape:', errorData)
      setError(links.length) // Alle als Fehler zählen, wenn der Batch nicht gestartet werden konnte
      return null
    }
  } catch (error) {
    console.error('Error during batch scrape request:', error)
    setError(links.length)
    return null
  }
}


  const getServerStatus = async () => {
    const response = await fetch('https://fpv-scrapper.onrender.com')
    if (response.ok) {
      setStatus(`Server is running`)
    } else {
      setStatus('Server is down or unreachable')
    }
  }

  return (
    <div className='w-full flex flex-col items-center justify-center p-4'>
      <h1 className='text-4xl font-bold'>Scrapper</h1>
      <Button onClick={getServerStatus}>Get Server Status</Button>
      <p>{status}</p>
      <Button onClick={scrapp}>Scrapp Components price</Button>
      <p>{anzScrappedLinks} / {anzLinks} Links</p>
      <p>Actual Link: {actuelLink}</p>
      <p>Scrapped Price: {lastScrappedValue} CHF</p>
      <p className='text-green-500'>Succes: {success}</p>
      <p className='text-red-500'>Error: {error}</p>
    </div>
  )
}

export default Scrapper