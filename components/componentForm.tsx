"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react" // Import useRef
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

interface ComponentFormProps {
  componentProps?: {
    component?: string
    name?: string
    description?: string
    price?: string | number
    shop?: string
    link?: string
    imageurl?: string
    imageUrl?: string // For backward compatibility with original code
    options?: { [key: string]: { value: string; id: number } }
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

    if (!initialState.options || Object.keys(initialState.options).length === 0) {
      const selectedOptions = OPTIONS_CONFIG.find((opt) => opt[currentType])
      if (selectedOptions) {
        const optionsWithIds: { [key: string]: { value: string; id: number } } = {}
        selectedOptions[currentType].forEach(([key, value, id]) => {
          optionsWithIds[key] = { value, id }
        })
        initialState.options = optionsWithIds
      }
    }

    // Store initial props in ref
    lastProcessedProps.current = { props: componentProps, update: update }

    return {
      component: initialState.component,
      name: initialState.name || "",
      description: initialState.description || "",
      price: initialState.price || "",
      shop: initialState.shop || "",
      link: initialState.link || "",
      imageurl: initialState.imageurl || initialState.imageUrl || "",
      options: initialState.options || {},
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

    if (!newStateCandidate.options || Object.keys(newStateCandidate.options).length === 0) {
      const selectedOptions = OPTIONS_CONFIG.find((opt) => opt[currentType])
      if (selectedOptions) {
        const optionsWithIds: { [key: string]: { value: string; id: number } } = {}
        selectedOptions[currentType].forEach(([key, value, id]) => {
          optionsWithIds[key] = { value, id }
        })
        newStateCandidate.options = optionsWithIds
      }
    }

    const finalNewState = {
      component: newStateCandidate.component,
      name: newStateCandidate.name || "",
      description: newStateCandidate.description || "",
      price: newStateCandidate.price || "",
      shop: newStateCandidate.shop || "",
      link: newStateCandidate.link || "",
      imageurl: newStateCandidate.imageurl || newStateCandidate.imageUrl || "",
      options: newStateCandidate.options || {},
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
    // Only save to session storage if component data is not empty
    if (
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
  }, [component])

  const mapOptionsToArray = (optionsObj: { [key: string]: { value: string; id: number } }) => {
    return Object.entries(optionsObj).map(([key, { value }]) => ({ [key]: value }))
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

    if (component.options) {
      shipComponent = { ...component, options: mapOptionsToArray(component.options) }
    }

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
    } catch (error) {
      console.error("Fehler:", error)
      toast.error(`Fehler beim ${update ? "Aktualisieren" : "Hinzufügen"} der Komponente`)
    }
  }

  const handleComponentTypeChange = (value: string) => {
    setComponent((prev) => ({ ...prev, component: value, type: value }))
    const selectedOptions = OPTIONS_CONFIG.find((opt) => opt[value])
    const optionsWithIds: { [key: string]: { value: string; id: number } } = {}
    if (selectedOptions) {
      selectedOptions[value].forEach(([key, val, id]) => {
        optionsWithIds[key] = { value: val, id }
      })
    }
    setComponent((prev) => ({
      ...prev,
      options: optionsWithIds,
    }))
  }

  const handleAddOption = () => {
    const existingIds = Object.values(component.options || {}).map((opt) => opt.id)
    const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1

    const updatedOptions = {
      ...component.options,
      [""]: { value: "", id: newId },
    }
    setComponent((prev) => ({
      ...prev,
      options: updatedOptions,
    }))
  }

  const handleRemoveOption = (key: string) => {
    const updatedOptions = { ...component.options }
    delete updatedOptions[key]
    setComponent((prev) => ({
      ...prev,
      options: updatedOptions,
    }))
  }

  const handleUpdateOption = (key: string, newValue: string) => {
    const updatedOptions = {
      ...component.options,
      [key]: { ...component.options[key], value: newValue },
    }
    setComponent((prev) => ({
      ...prev,
      options: updatedOptions,
    }))
  }

  const handleUpdateKey = (oldKey: string, newKey: string) => {
    if (newKey.trim() === "") {
      toast.error("Der neue Schlüssel darf nicht leer sein.")
      return
    }
    if (component.options[newKey] && newKey !== oldKey) {
      toast.error("Dieser Schlüssel existiert bereits.")
      return
    }

    const updatedOptions = { ...component.options }
    const optionData = updatedOptions[oldKey]
    delete updatedOptions[oldKey]
    updatedOptions[newKey] = optionData

    setComponent((prev) => ({
      ...prev,
      options: updatedOptions,
    }))
  }

  return (
    <div className={`w-full ${!update ? "px-[30%]" : ""} pt-1`}>
      <form className="w-full" onSubmit={handleSubmit}>
        <h1 className="text-4xl font-bold text-white">Komponent {!update ? "Hinzufügen" : "Bearbeiten"}</h1>
        <div>
          <Label className="text-white">
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
          <Label className="text-white">
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
          <Label className="text-white">
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
          <Label className="text-white">
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
          <Label className="text-white">
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
          <Label className="text-white">
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
          <Label className="text-white">
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
          <Label className="text-white">Optionen: </Label>
          {component.component && (
            <div className="flex gap-2 my-2">
              <Button type="button" onClick={handleAddOption}>
                Option Hinzufügen
              </Button>
            </div>
          )}
          {component.options && Object.keys(component.options).length > 0 ? (
            <div className="flex flex-col">
              {Object.entries(component.options)
                .sort(([, a], [, b]) => a.id - b.id)
                .map(([key, optionData]) => (
                  <div key={optionData.id}>
                    <div className="my-2 relative flex items-center gap-2">
                      <Input
                        type="text"
                        value={key || ""}
                        onChange={(e) => handleUpdateKey(key, e.target.value)}
                        className="p-2 bg-gray-800 text-white border-gray-600 rounded-md"
                      />
                      <Input
                        type="text"
                        value={optionData.value || ""}
                        onChange={(e) => handleUpdateOption(key, e.target.value)}
                        className="p-2 bg-gray-800 text-white border-gray-600 rounded-md"
                      />
                      <Button variant="destructive" onClick={() => handleRemoveOption(key)}>
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
