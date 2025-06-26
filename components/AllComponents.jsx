"use client"

import { useState, useEffect } from "react"
import { ExternalLink, ChevronsUpDown, Info, X, Check } from "lucide-react" // Added Check icon
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// Removed Select, SelectContent, SelectItem, SelectTrigger, SelectValue
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover" // Added Popover components
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command" // Added Command components
import { Checkbox } from "@/components/ui/checkbox" // Added Checkbox
import { Badge } from "@/components/ui/badge" // Added Badge (assuming it's available)
import { cn } from "@/lib/utils" // Added cn utility for conditional classes
import { CommandList } from "@/components/ui/command"
import ComponentFrom from "@/components/componentForm"

const AllComponent = () => {
  const [selectedComponents, setSelectedComponents] = useState({})
  const [activeComponent, setActiveComponent] = useState("frame")
  const [expandedDescriptions, setExpandedDescriptions] = useState({})
  const [droneComponents, setDroneComponents] = useState({})
  const [selectedDetailComponent, setSelectedDetailComponent] = useState(null)
  const [selectedComponentType, setSelectedComponentType] = useState(null)
  const [isOpen, setIsOpen] = useState({
    frame: true,
    motors: true,
    esc: true,
    fc: true,
    props: true,
    battery: true,
    camera: true,
  })
  const [dialogeTab, setDialogTab] = useState("details")
  const [deleteName, setDeleteName] = useState("")
  const [theme, setTheme] = useState(false)
  const [filters, setFilters] = useState({}) // Globaler Filter-Zustand, speichert Arrays von Werten

  const componentGroup = ["frame", "motors", "esc", "fc", "props", "battery", "camera"]

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch("/api")
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const data = await response.json()
        console.log("Drone components fetched:", data.data[0].components[0])

        setDroneComponents(data.data[0].components[0])
      } catch (error) {
        console.error("Error fetching drone components:", error)
      }
    }

    getData()
  }, [])

  useEffect(() => {
    setTheme(localStorage.getItem("theme") === "dark")
  }, [localStorage.getItem("theme")])

  const openShop = (e, shop) => {
    e.stopPropagation()
    window.open(shop, "_blank", "noopener,noreferrer")
  }

  const toggleDescription = (index) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const getOptionKeysAndValues = () => {
    const allIndividualOptions = componentGroup.flatMap(
      (type) => droneComponents[type]?.flatMap((component) => component.options || []) || [],
    )

    const keys = [...new Set(allIndividualOptions.flatMap((option) => Object.keys(option)))]
    const optionsByKey = {}

    keys.forEach((key) => {
      optionsByKey[key] = [
        ...new Set(allIndividualOptions.filter((option) => option.hasOwnProperty(key)).map((option) => option[key])),
      ].sort((a, b) => {
        const numA = Number.parseFloat(a)
        const numB = Number.parseFloat(b)
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB
        }
        return String(a).localeCompare(String(b))
      })
    })

    return { keys, optionsByKey }
  }

  const { keys, optionsByKey } = getOptionKeysAndValues()

  const showComponentDetails = (component, mode, type) => {
    setSelectedComponentType(type)
    setSelectedDetailComponent(component)
    setDialogTab(mode || "details")
  }

  const [imageErrors, setImageErrors] = useState({})

  const handleImageError = (imageUrl) => {
    setImageErrors((prev) => ({ ...prev, [imageUrl]: true }))
  }

  const handleImageLoad = (imageUrl) => {
    setImageErrors((prev) => ({ ...prev, [imageUrl]: false }))
  }

  const handleDeleteComponent = async () => {
    try {
      const response = await fetch("/api", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: selectedDetailComponent.id, type: selectedComponentType }),
      })
      if (response.ok) {
        setSelectedDetailComponent(null)
        toast.success("Komponente erfolgreich gelöscht!")
        window.location.reload()
      } else {
        throw new Error("Fehler beim Löschen der Komponente")
      }
    } catch (error) {
      console.error("Fehler beim Löschen der Komponente:", error)
      toast.error("Fehler beim Löschen der Komponente")
    }
  }

  const closeDialog = () => {
    setSelectedDetailComponent(null)
    setDeleteName("")
  }

  const removeFilterTag = (key, valueToRemove) => {
    setFilters((prev) => {
      const currentValues = prev[key] || []
      const newValues = currentValues.filter((val) => val !== valueToRemove)

      if (newValues.length === 0) {
        const { [key]: _, ...rest } = prev // Entferne den Schlüssel, wenn das Array leer ist
        return rest
      }
      return { ...prev, [key]: newValues }
    })
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4 px-4">
        <h3 className="text-lg font-semibold">Drohnen Komponenten</h3>
      </div>

      <Dialog open={!!selectedDetailComponent} onOpenChange={closeDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <Tabs className="relative" value={dialogeTab} onValueChange={setDialogTab}>
            <div className="sticky w-[calc(100% + 3rem)] m-[-1.5rem] top-[-1.5rem] pt-6 pb-3 backdrop-blur-lg z-20">
              <TabsList className="w-[95%] mx-auto grid grid-cols-3 gap-2 mb-4 sticky top-0">
                <TabsTrigger value="details" className="flex items-center gap-2">
                  Details
                </TabsTrigger>
                <TabsTrigger value="edit" className="flex items-center gap-2">
                  Bearbeiten
                </TabsTrigger>
                <TabsTrigger value="delete" className="flex items-center gap-2">
                  Löschen
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="details" className="pt-5">
              <DialogHeader>
                <DialogTitle>{selectedDetailComponent?.name}</DialogTitle>
                <DialogDescription>Detaillierte Informationen zu dieser Komponente</DialogDescription>
              </DialogHeader>
              {selectedDetailComponent && (
                <div className="space-y-4">
                  {selectedDetailComponent.imageurl && (
                    <div className="flex justify-center">
                      <Image
                        src={
                          imageErrors[selectedDetailComponent.imageurl]
                            ? "/img_not_found_dark.png"
                            : selectedDetailComponent.imageurl
                        }
                        alt={selectedDetailComponent.name}
                        width={80}
                        height={80}
                        onError={() => handleImageError(selectedDetailComponent.imageurl)}
                        onLoadingComplete={() => handleImageLoad(selectedDetailComponent.imageurl)}
                        className="rounded-md object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-lg">Beschreibung</h4>
                      <p className="text-gray-600">{selectedDetailComponent.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-lg">Preis</h4>
                      <p className="text-2xl font-bold text-green-600">{selectedDetailComponent.price} CHF</p>
                    </div>

                    {selectedDetailComponent.options && selectedDetailComponent.options.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-lg">Verfügbare Optionen</h4>
                        <div className="space-y-2">
                          {selectedDetailComponent.options.map((option, i) => (
                            <div key={i} className="bg-background p-3 rounded-lg">
                              {Object.entries(option).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="font-medium capitalize">{key}:</span>
                                  <span>{value}</span>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={(e) => openShop(e, selectedDetailComponent.shop)}
                        className="gap-2"
                      >
                        <ExternalLink className="size-4" />
                        Shop besuchen
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedDetailComponent(null)
                        }}
                      >
                        Schließen
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="edit" className="pt-5">
              {selectedDetailComponent && (
                <div className="z-0">
                  <ComponentFrom componentProps={selectedDetailComponent} update={true} />
                </div>
              )}
            </TabsContent>
            <TabsContent value="delete" className="pt-5">
              <DialogHeader>
                <DialogTitle>Komponente entfernen</DialogTitle>
                <DialogDescription>Sind Sie sicher, dass Sie diese Komponente entfernen möchten?</DialogDescription>
              </DialogHeader>
              {selectedDetailComponent && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <p className="text-sm">
                      Sie entfernen die Komponente <strong>{selectedDetailComponent.name}</strong>.
                    </p>
                    <p className="text-sm text-red-600">Diese Aktion kann nicht rückgängig gemacht werden.</p>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex flex-col gap-2">
                        <p className="text-sm text-foreground flex">
                          Geben sie "<p className="select-none">{selectedDetailComponent.name}</p>" ein, um
                          fortzufahren.
                        </p>
                        <Input
                          value={deleteName}
                          onChange={(e) => {
                            setDeleteName(e.target.value)
                          }}
                        />
                      </div>
                      <Button
                        variant="destructive"
                        disabled={deleteName !== selectedDetailComponent.name}
                        onClick={handleDeleteComponent}
                      >
                        Entfernen
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Globaler Filterbereich */}
      <div className="px-4 mb-4">
        <div className="flex space-x-4 mb-4 flex-wrap">
          {keys.map((key) => (
            <div key={key} className="mb-2">
              <label htmlFor={`${key}-filter`} className="text-sm font-medium mr-2 capitalize">
                {key}:
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-[200px] justify-between">
                    {filters[key] && filters[key].length > 0
                      ? filters[key].join(", ")
                      : `Alle ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder={`Suche ${key}...`} />
                    <CommandList>
                      <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
                      <CommandGroup>
                        {optionsByKey[key]?.map((optionValue) => (
                          <CommandItem
                            key={optionValue}
                            onSelect={() => {
                              setFilters((prev) => {
                                const currentValues = prev[key] || []
                                const newValues = currentValues.includes(optionValue)
                                  ? currentValues.filter((val) => val !== optionValue)
                                  : [...currentValues, optionValue]

                                if (newValues.length === 0) {
                                  const { [key]: _, ...rest } = prev // Entferne den Schlüssel, wenn das Array leer ist
                                  return rest
                                }
                                return { ...prev, [key]: newValues }
                              })
                            }}
                          >
                            <Checkbox
                              checked={filters[key]?.includes(optionValue)}
                              onCheckedChange={() => {
                                // onSelect handles the state change, this is for visual feedback
                              }}
                              className="mr-2"
                            />
                            {optionValue}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                filters[key]?.includes(optionValue) ? "opacity-100" : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(filters).map(([key, values]) =>
            values.map((value) => (
              <Badge key={`${key}-${value}`} variant="secondary" className="flex items-center gap-1">
                <span className="capitalize">{key}:</span>
                <span>{value}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => removeFilterTag(key, value)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Filter entfernen</span>
                </Button>
              </Badge>
            )),
          )}
        </div>
      </div>

      {componentGroup.map((componentType, index) => (
        <Collapsible
          open={isOpen[componentType]} // Korrigierter Zugriff auf den Zustand
          onOpenChange={(openState) => setIsOpen((prev) => ({ ...prev, [componentType]: openState }))} // Korrigierte Update-Funktion
          className="flex w-full flex-col gap-2 relative"
          key={index}
        >
          <CollapsibleTrigger asChild>
            <button className="flex items-center justify-between gap-4 px-4 mb-1 sticky top-4 bg-background hover:bg-accent rounded-md ring-1 ring-black">
              <h4 className="text-sm font-semibold">
                {componentType.charAt(0).toUpperCase() + componentType.slice(1)}
              </h4>
              <div className="size-8  hover:text-accent-foreground flex items-center justify-center">
                <ChevronsUpDown />
                <span className="sr-only">Toggle</span>
              </div>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col gap-2 w-full px-4">
            <div className="space-y-3">
              <div className="overflow-y-auto space-y-2 flex flex-wrap justify-around">
                {/* Komponentenliste */}
                {droneComponents[componentType]
                  ?.filter((component) => {
                    // Wenn keine Filter aktiv sind, alle Komponenten anzeigen
                    if (Object.keys(filters).length === 0) {
                      return true
                    }

                    // Überprüfen, ob die Komponente ALLE aktiven Filter besteht
                    return Object.entries(filters).every(([filterKey, filterValues]) => {
                      if (filterValues.length === 0) {
                        return true // No values selected for this filter, so it doesn't filter anything
                      }

                      // If the component has no options, it should pass this filter (as it can't be filtered by options)
                      if (!component.options || component.options.length === 0) {
                        return true
                      }

                      // Check if any of the component's options match the filter criteria
                      const hasMatchingOption = component.options.some((option) => {
                        return option.hasOwnProperty(filterKey) && filterValues.includes(option[filterKey])
                      })

                      // Check if none of the component's options have this filterKey
                      const hasNoFilterKeyInOptions = component.options.every((option) => {
                        return !option.hasOwnProperty(filterKey)
                      })

                      // The component passes this specific filterKey if:
                      // 1. It has a matching option (meaning it has the key and the value matches)
                      // OR
                      // 2. It has no options that contain this filterKey at all (meaning it's not relevant to this filter)
                      return hasMatchingOption || hasNoFilterKeyInOptions
                    })
                  })
                  .map((component, index) => (
                    <Card className="w-full md:w-[23dvw] h-auto aspect-square md:aspect-auto md:h-[23dvw] flex flex-col" key={index}>
                      <CardHeader className="h-[9dvw] flex-shrink-0 mb-6">
                        <CardTitle className="flex items-center justify-between h-[5dvw] m-0">
                          {component.name}
                          <Button variant="ghost" size="icon" onClick={(e) => openShop(e, component.link)}>
                            <ExternalLink className="size-4" />
                          </Button>
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {component.description && (
                            <div className="mt-2 h-[6dvw] overflow-auto">
                              <p
                                className={`text-sm text-gray-600 transition-all duration-200 ${
                                  expandedDescriptions[index] ? "line-clamp-none" : "line-clamp-2"
                                }`}
                              >
                                {component.description}
                              </p>
                              {component.description.length > 100 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleDescription(index)
                                  }}
                                  className="text-xs text-blue-500 hover:underline mt-1"
                                >
                                  {expandedDescriptions[index] ? "Weniger anzeigen" : "Mehr anzeigen"}
                                </button>
                              )}
                            </div>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="h-[12dvw] flex-grow m-0 overflow-hidden">
                        <div className="flex items-center gap-4">
                          {component.imageurl && (
                            <Image
                              src={
                                imageErrors[component.imageurl]
                                  ? theme
                                    ? "/img_not_found.png"
                                    : "/img_not_found_dark.png"
                                  : component.imageurl
                              }
                              alt={component.name}
                              width={80}
                              height={80}
                              onError={() => handleImageError(component.imageurl)}
                              onLoadingComplete={() => handleImageLoad(component.imageurl)}
                              className="rounded-md object-cover"
                            />
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">Preis: {component.price} CHF</span>
                            {component.options && (
                              <div className="mt-2 space-y-1 max-h-[6dvw] overflow-auto">
                                {component.options.map((option, i) => (
                                  <div key={i}>
                                    {Object.entries(option).map(([key, value]) => (
                                      <div key={key} className="text-xs text-muted-foreground">
                                        <span>
                                          {key}: {value}{" "}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="h-[3dvw] flex-shrink-0 flex justify-between items-center m-0">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => showComponentDetails(component, "details", componentType)}
                          >
                            <Info className="size-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => showComponentDetails(component, "edit", componentType)}
                          >
                            Bearbeiten
                          </Button>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => showComponentDetails(component, "delete", componentType)}
                        >
                          Entfernen
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </>
  )
}

export default AllComponent
