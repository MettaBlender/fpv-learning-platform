"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"

// Define optionsConfig outside the component to make it truly constant
const OPTIONS_CONFIG = [
  {
    frame: [
      ["grösse", "", 1],
      ["marke", "", 2],
    ],
  },
  {
    motors: [
      ["grösse", "", 1],
      ["marke", "", 2],
      ["anzahl", "0", 3],
      ["props", "", 4],
      ["serials", "", 5],
      ["kv", "", 6],
    ],
  },
  {
    esc: [
      ["grösse", "", 1],
      ["marke", "", 2],
    ],
  },
  {
    fc: [
      ["grösse", "", 1],
      ["marke", "", 2],
    ],
  },
  {
    props: [
      ["grösse", "", 1],
      ["marke", "", 2],
    ],
  },
  {
    battery: [
      ["c-rate", "", 1],
      ["marke", "", 2],
    ],
  },
  { camera: [["marke", "", 1]] },
]

interface OptionItem {
  key: string
  value: string
  id: number
}

interface ComponentFormProps {
  componentProps?: {
    id?: number
    component?: string
    name?: string
    description?: string
    price?: string | number
    shop?: string
    link?: string
    imageurl?: string
    imageUrl?: string // For backward compatibility with original code
    options?: { [key: string]: { value: string; id: number } } | Array<{ [key: string]: string }> | OptionItem[] // Updated type for incoming options
    type?: string // Added type based on usage in original code
  }
  update?: boolean
}

// Helper for deep comparison (simple JSON.stringify for now)
const deepCompare = (a: any, b: any) => {
  return JSON.stringify(a) === JSON.stringify(b)
}

const ComponentForm: React.FC<ComponentFormProps> = ({ componentProps = {}, update = false }) => {
  const componentGroup = ["frame", "motors", "esc", "fc", "props", "battery", "camera"]
  const shops = ["Fpvracing", "FPVFrame", "Dronefactory", "FPV24", "Quadmula"]

  // Ref to store the last processed componentProps and update status
  const lastProcessedProps = useRef<{ props: ComponentFormProps["componentProps"]; update: boolean } | null>(null)

  const [component, setComponent] = useState(() => {
    // Initial state calculation runs only once on the first render
    const sessionComponent = sessionStorage.getItem("component")
      ? JSON.parse(sessionStorage.getItem("component"))
      : null

    let initialState = { ...componentProps }

    if (sessionComponent && !update) {
      initialState = sessionComponent
    }

    const currentType = initialState.type || initialState.component || "frame"
    initialState.type = currentType
    initialState.component = currentType

    const processedOptions: OptionItem[] = []
    let idCounter = 1 // Start ID counter for new options

    // Handle incoming options: convert various formats to internal OptionItem[] format
    if (Array.isArray(initialState.options)) {
      // Case: options is Array<{ [key: string]: string }> or OptionItem[]
      initialState.options.forEach((option: any) => {
        if (option.key && option.value && option.id) {
          // Already in OptionItem format
          processedOptions.push(option)
        } else if (typeof option === "object" && Object.keys(option).length === 1) {
          // Format: { "key": "value" }
          const key = Object.keys(option)[0]
          const value = option[key]
          processedOptions.push({ key, value, id: idCounter++ })
        }
      })
    } else if (typeof initialState.options === "object" && initialState.options !== null) {
      // Case: options is { [key: string]: { value: string; id: number } } (old internal format)
      Object.entries(initialState.options).forEach(([key, optionData]) => {
        processedOptions.push({ key, value: optionData.value, id: optionData.id || idCounter++ })
      })
    }

    // If no options were provided or processed, initialize from OPTIONS_CONFIG
    if (processedOptions.length === 0) {
      const selectedOptions = OPTIONS_CONFIG.find((opt) => opt[currentType])
      if (selectedOptions) {
        selectedOptions[currentType].forEach(([key, value, id]) => {
          processedOptions.push({ key, value, id })
        })
      }
    }

    // Store initial props in ref
    lastProcessedProps.current = { props: componentProps, update: update }

    return {
      id: initialState.id || null,
      component: initialState.component,
      name: initialState.name || "",
      description: initialState.description || "",
      price: initialState.price || "",
      shop: initialState.shop || "",
      link: initialState.link || "",
      imageurl: initialState.imageurl || initialState.imageUrl || "",
      options: processedOptions, // Use the processed options
      type: initialState.type,
    }
  })

  const [hasError, setHasError] = useState(false)

  // Effect to handle updates from componentProps if they change after initial render
  useEffect(() => {
    // Check if componentProps or update have meaningfully changed since last processing
    if (
      lastProcessedProps.current &&
      deepCompare(componentProps, lastProcessedProps.current.props) &&
      update === lastProcessedProps.current.update
    ) {
      return // No meaningful change, skip update
    }

    // If props have changed, calculate new state
    const sessionComponent = sessionStorage.getItem("component")
      ? JSON.parse(sessionStorage.getItem("component"))
      : null

    let newStateCandidate = { ...componentProps }

    if (sessionComponent && !update) {
      newStateCandidate = sessionComponent
    }

    const currentType = newStateCandidate.type || newStateCandidate.component || "frame"
    newStateCandidate.type = currentType
    newStateCandidate.component = currentType

    const processedOptions: OptionItem[] = []
    let idCounter = 1 // Start ID counter for new options

    // Handle incoming options: convert various formats to internal OptionItem[] format
    if (Array.isArray(newStateCandidate.options)) {
      newStateCandidate.options.forEach((option: any) => {
        if (option.key && option.value && option.id) {
          processedOptions.push(option)
        } else if (typeof option === "object" && Object.keys(option).length === 1) {
          const key = Object.keys(option)[0]
          const value = option[key]
          processedOptions.push({ key, value, id: idCounter++ })
        }
      })
    } else if (typeof newStateCandidate.options === "object" && newStateCandidate.options !== null) {
      Object.entries(newStateCandidate.options).forEach(([key, optionData]) => {
        processedOptions.push({ key, value: optionData.value, id: optionData.id || idCounter++ })
      })
    }

    // If no options were provided or processed, initialize from OPTIONS_CONFIG
    if (processedOptions.length === 0) {
      const selectedOptions = OPTIONS_CONFIG.find((opt) => opt[currentType])
      if (selectedOptions) {
        selectedOptions[currentType].forEach(([key, value, id]) => {
          processedOptions.push({ key, value, id })
        })
      }
    }

    const finalNewState = {
      id: newStateCandidate.id || null,
      component: newStateCandidate.component,
      name: newStateCandidate.name || "",
      description: newStateCandidate.description || "",
      price: newStateCandidate.price || "",
      shop: newStateCandidate.shop || "",
      link: newStateCandidate.link || "",
      imageurl: newStateCandidate.imageurl || newStateCandidate.imageUrl || "",
      options: processedOptions, // Use the processed options
      type: newStateCandidate.type,
    }

    // Update state only if it's truly different from the current state
    setComponent((prevComponent) => {
      if (deepCompare(finalNewState, prevComponent)) {
        return prevComponent // No change, return previous state
      }
      return finalNewState // State has changed, update
    })

    // Update ref for next comparison
    lastProcessedProps.current = { props: componentProps, update: update }
  }, [componentProps, update]) // Dependencies: componentProps, update

  useEffect(() => {
    // Only save to session storage if component data is not empty AND not in update mode
    if (
      !update && // <-- Added this condition
      !(
        component.name === "" &&
        component.description === "" &&
        component.price === "" &&
        component.shop === "" &&
        component.link === "" &&
        component.imageurl === ""
      )
    ) {
      sessionStorage.setItem("component", JSON.stringify(component))
    }
  }, [component, update]) // Added 'update' to dependencies

  // Converts internal OptionItem[] to API-expected Array<{ [key: string]: string }>
  const mapOptionsToApiFormat = (optionsArray: OptionItem[]) => {
    return optionsArray.map((option) => ({ [option.key]: option.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      (component.name || "").trim() === "" ||
      (component.description || "").trim() === "" ||
      component.price === "" ||
      Number.parseFloat(component.price as string) <= 0 ||
      (component.shop || "").trim() === "" ||
      (component.link || "").trim() === "" ||
      (component.imageurl || "").trim() === ""
    ) {
      toast.error("Bitte füllen Sie alle Felder korrekt aus.")
      return
    }

    let shipComponent = { ...component }

    if (component.options && component.options.length > 0) {
      shipComponent = {
        ...component,
        options: mapOptionsToApiFormat(component.options),
      }
    } else {
      // Ensure options is an empty array if there are none
      shipComponent = { ...component, options: [] }
    }
    console.log("Komponente zum Senden:", shipComponent)

    try {
      const method = update ? "PUT" : "POST" // Assuming PUT for update, POST for add
      const response = await fetch("/api", {
        // You might need a different API endpoint for updates
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shipComponent),
      })

      if (!response.ok) {
        toast.error(`Fehler beim ${update ? "Aktualisieren" : "Hinzufügen"} der Komponente`)
        return
      }

      const data = await response.json()
      console.log(`Komponente erfolgreich ${update ? "aktualisiert" : "hinzugefügt"}:`, data)
      toast.success(`Komponente erfolgreich ${update ? "aktualisiert" : "hinzugefügt"}`)
      sessionStorage.removeItem("component")
    } catch (error) {
      console.error("Fehler:", error)
      toast.error(`Fehler beim ${update ? "Aktualisieren" : "Hinzufügen"} der Komponente`)
    }
  }

  const handleComponentTypeChange = (value: string) => {
    setComponent((prev) => {
      const selectedOptionsConfig = OPTIONS_CONFIG.find((opt) => opt[value])
      const newOptions: OptionItem[] = []
      if (selectedOptionsConfig) {
        selectedOptionsConfig[value].forEach(([key, val, id]) => {
          newOptions.push({ key, value: val, id })
        })
      }
      return {
        ...prev,
        component: value,
        type: value,
        options: newOptions, // Reset options based on new component type
      }
    })
  }

  const handleAddOption = () => {
    setComponent((prev) => {
      const existingIds = prev.options.map((opt) => opt.id)
      const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1
      const newOption: OptionItem = { key: "", value: "", id: newId }
      return {
        ...prev,
        options: [...prev.options, newOption],
      }
    })
  }

  const handleRemoveOption = (idToRemove: number) => {
    setComponent((prev) => ({
      ...prev,
      options: prev.options.filter((option) => option.id !== idToRemove),
    }))
  }

  const handleUpdateOption = (idToUpdate: number, newValue: string) => {
    setComponent((prev) => ({
      ...prev,
      options: prev.options.map((option) => (option.id === idToUpdate ? { ...option, value: newValue } : option)),
    }))
  }

  const handleUpdateKey = (idToUpdate: number, newKey: string) => {
    if (newKey.trim() === "") {
      toast.error("Der neue Schlüssel darf nicht leer sein.")
      return
    }
    // No check for duplicate keys needed as per requirement
    setComponent((prev) => ({
      ...prev,
      options: prev.options.map((option) => (option.id === idToUpdate ? { ...option, key: newKey } : option)),
    }))
  }

  return (
    <div className={`w-full ${!update ? "px-[30%]" : ""} pt-1`}>
      <form className="w-full" onSubmit={handleSubmit}>
        <h1 className={`text-4xl font-bold ${update ? "text-foreground" : "text-white"}`}>
          Komponent {!update ? "Hinzufügen" : "Bearbeiten"}
        </h1>
        <div>
          <Label className={`${update ? "text-foreground" : "text-white"}`}>
            Wählen Sie eine Komponente aus:{" "}
            <span className={`${component.component === "" ? "text-[#d9534f]" : "text-[#8ccd82]"}`}>*</span>
          </Label>
          <Select key={component.component} onValueChange={handleComponentTypeChange} value={component.component || ""}>
            <SelectTrigger className="w-full p-2 border rounded-md mt-2">
              <SelectValue placeholder="-- Bitte wählen --" />
            </SelectTrigger>
            <SelectContent>
              {componentGroup.map((componentType, index) => (
                <SelectItem key={index} value={componentType}>
                  {componentType.charAt(0).toUpperCase() + componentType.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="my-2">
          <Label className={`${update ? "text-foreground" : "text-white"}`}>
            Titel: <span className={`${(component.name || "") === "" ? "text-[#d9534f]" : "text-[#8ccd82]"}`}>*</span>
          </Label>
          <Input
            placeholder="Komponent Titel"
            onChange={(e) => setComponent((prev) => ({ ...prev, name: e.target.value }))}
            value={component.name || ""}
          />
          {(component.name || "").trimEnd() === "" && <p className="text-[#d9534f]">Bitte geben sie einen Titel ein</p>}
        </div>
        <div className="my-2 relative">
          <Label className={`${update ? "text-foreground" : "text-white"}`}>
            Beschreibung:{" "}
            <span className={`${(component.description || "") === "" ? "text-[#d9534f]" : "text-[#8ccd82]"}`}>*</span>
          </Label>
          <Textarea
            placeholder="Komponente Beschreibung"
            onChange={(e) => setComponent((prev) => ({ ...prev, description: e.target.value }))}
            value={component.description || ""}
          />
          {(component.description || "").trimEnd() === "" && (
            <p className="text-[#d9534f]">Bitte geben sie eine Beschreibung ein</p>
          )}
        </div>
        <div className="my-2 relative">
          <Label className={`${update ? "text-foreground" : "text-white"}`}>
            Preis:{" "}
            <span
              className={`${component.price === "" || Number.parseFloat(component.price as string) <= 0 ? "text-[#d9534f]" : "text-[#8ccd82]"}`}
            >
              *
            </span>
          </Label>
          <Input
            type="number"
            min="0"
            step="0.05"
            onChange={(e) => setComponent((prev) => ({ ...prev, price: e.target.value }))}
            value={component.price || ""}
          />
          {(component.price === "" || Number.parseFloat(component.price as string) === 0) && (
            <p className="text-[#d9534f]">Bitte geben sie einen Preis ein</p>
          )}
          {Number.parseFloat(component.price as string) < 0 && (
            <p className="text-[#d9534f]">Preis muss grösser als 0 sein</p>
          )}
        </div>
        <div className="my-2 relative">
          <Label className={`${update ? "text-foreground" : "text-white"}`}>
            Shop: <span className={`${(component.shop || "") === "" ? "text-[#d9534f]" : "text-[#8ccd82]"}`}>*</span>
          </Label>
          <Select
            key={component.shop}
            onValueChange={(value) => {
              setComponent((prev) => ({ ...prev, shop: value }))
            }}
            value={component.shop || ""}
          >
            <SelectTrigger className="w-full p-2 border rounded-md mt-2">
              <SelectValue placeholder="-- Bitte wählen --" />
            </SelectTrigger>
            <SelectContent>
              {shops.map((shop) => (
                <SelectItem key={shop} value={shop}>
                  {shop}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(component.shop || "").trimEnd() === "" && <p className="text-[#d9534f]">Bitte geben sie einen Shop ein</p>}
        </div>
        <div className="my-2 relative">
          <Label className={`${update ? "text-foreground" : "text-white"}`}>
            Link zum Produkt:{" "}
            <span className={`${(component.link || "") === "" ? "text-[#d9534f]" : "text-[#8ccd82]"}`}>*</span>
          </Label>
          <Input
            type="text"
            value={component.link || ""}
            onChange={(e) => setComponent((prev) => ({ ...prev, link: e.target.value }))}
          />
          {(component.link || "").trimEnd() === "" && (
            <p className="text-[#d9534f]">Bitte geben sie einen Link zum Produkt ein</p>
          )}
        </div>
        <div className="my-2 relative">
          <Label className={`${update ? "text-foreground" : "text-white"}`}>
            Bild url:{" "}
            <span className={`${(component.imageurl || "") === "" ? "text-[#d9534f]" : "text-[#8ccd82]"}`}>*</span>
          </Label>
          <Input
            type="text"
            onChange={(e) => setComponent((prev) => ({ ...prev, imageurl: e.target.value }))}
            value={component.imageurl || ""}
          />
          {(component.imageurl || "").trimEnd() === "" && (
            <p className="text-[#d9534f]">Bitte geben sie ein Bild url ein ein</p>
          )}
          {(component.imageurl || "").trimEnd() !== "" && (
            <Image
              src={hasError ? "/img_not_found.png" : component.imageurl}
              alt="Bild vorschau"
              width={1000}
              height={1000}
              className="w-[50%] mx-auto h-fit mt-4 rounded-md"
              onError={() => setHasError(true)}
              onLoadingComplete={() => setHasError(false)}
            />
          )}
        </div>
        <div className="my-2 relative">
          <Label className={`${update ? "text-foreground" : "text-white"}`}>Optionen: </Label>
          {component.component && (
            <div className="flex gap-2 my-2">
              <Button type="button" onClick={handleAddOption}>
                Option Hinzufügen
              </Button>
            </div>
          )}
          {component.options && component.options.length > 0 ? (
            <div className="flex flex-col">
              {component.options
                .sort((a, b) => a.id - b.id) // Sort by ID for consistent order
                .map((optionData) => (
                  <div key={optionData.id}>
                    <div className="my-2 relative flex items-center gap-2">
                      <Input
                        type="text"
                        value={optionData.key || ""}
                        onChange={(e) => handleUpdateKey(optionData.id, e.target.value)}
                        className="p-2 bg-background text-forground border-foreground rounded-md"
                      />
                      <Input
                        type="text"
                        value={optionData.value || ""}
                        onChange={(e) => handleUpdateOption(optionData.id, e.target.value)}
                        className="p-2 bg-background text-forground border-foreground rounded-md"
                      />
                      <Button variant="destructive" onClick={() => handleRemoveOption(optionData.id)}>
                        <Trash2 />
                      </Button>
                    </div>
                    {(optionData.value || "").trimEnd() === "" && (
                      <p className="text-[#d9534f] ml-25">Bitte geben Sie einen Wert ein</p>
                    )}
                  </div>
                ))}
            </div>
          ) : component.type ? (
            <p className="text-gray-400">Keine Optionen hinzugefügt</p>
          ) : null}
        </div>
        <Button
          className="w-full mt-4"
          type="submit"
          disabled={
            (component.component || "") === "" ||
            (component.name || "").trim() === "" ||
            (component.description || "").trim() === "" ||
            component.price === "" ||
            Number.parseFloat(component.price as string) <= 0 ||
            (component.shop || "").trim() === "" ||
            (component.link || "").trim() === "" ||
            (component.imageurl || "").trim() === ""
          }
        >
          Kompnent {update ? "aktualisieren" : "hinzufügen"}
        </Button>
      </form>
    </div>
  )
}

export default ComponentForm
