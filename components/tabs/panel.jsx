import React, {useState, useEffect} from 'react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { ExternalLink, ChevronsUpDown, Info, Eye} from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from 'next/image'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner"

const Panel = () => {

  const [selectedComponents, setSelectedComponents] = useState({})
  const [activeComponent, setActiveComponent] = useState("frame")
  const [expandedDescriptions, setExpandedDescriptions] = useState({})
  const [droneComponents, setDroneComponents] = useState({})
  const [selectedDetailComponent, setSelectedDetailComponent] = useState(null)
  const [isOpen, setIsOpen] = useState({
    frame: true,
    motors: true,
    esc: true,
    fc: true,
    props: true,
    battery: true,
    camera: true,
  })

  const componentGroup = ["frame", "motors", "esc", "fc", "props", "battery", "camera"]

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch('/api');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Assuming data contains the drone components
        console.log('Drone components fetched:', data.data[0].components[0]);

        setDroneComponents(data.data[0].components[0]); // Adjust based on your API response structure
        // You can set the initial state here if needed
      } catch (error) {
        console.error('Error fetching drone components:', error);
      }
    }

    getData();

  }, [])

  const handleComponentSelect = (componentType, component) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [componentType]: component,
    }))
    switch (componentType) {
      case "frame":
        setActiveComponent("fc")
        break
      case "motors":
        setActiveComponent("props")
        break
      case "esc":
        setActiveComponent("motors")
        break
      case "fc":
        setActiveComponent("esc")
        break
      case "props":
        setActiveComponent("battery")
        break
      case "battery":
        setActiveComponent("camera")
        break
      case "camera":
        setActiveComponent(null)
      default:
        setActiveComponent(null)
    }
  }

  const handleComponentRemove = (componentType) => {
    setSelectedComponents((prev) => {
      const newComponents = { ...prev }
      delete newComponents[componentType]
      return newComponents
    })
    if (componentType === "frame") {
      setActiveComponent("frame")
    } else if (componentType === "motors") {
      setActiveComponent("motors")
    } else if (componentType === "esc") {
      setActiveComponent("esc")
    } else if (componentType === "fc") {
      setActiveComponent("fc")
    } else if (componentType === "props") {
      setActiveComponent("props")
    } else if (componentType === "battery") {
      setActiveComponent("battery")
    } else if (componentType === "camera") {
      setActiveComponent("camera")
    }
  }

  const getTotalPrice = () => {
    return Object.values(selectedComponents).reduce((total, component) => total + (component?.price || 0), 0)
  }

  const openShop = (e, shop) => {
    e.stopPropagation()
    window.open(shop, "_blank", "noopener,noreferrer")
  }

  const [filters, setFilters] = useState({ size: '', marke: '' });

  const toggleDescription = (index) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Einzigartige Optionen für die Dropdowns extrahieren
  const getUniqueOptions = (key) => {
    const options = droneComponents[activeComponent]
      ?.flatMap((component) => component.options || [])
      .filter((option) => option[key])
      .map((option) => option[key]);
    return [...new Set(options)]; // Entfernt Duplikate
  };

  const sizes = getUniqueOptions('size');
  const marken = getUniqueOptions('marke');

  // Gefilterte Komponenten basierend auf den ausgewählten Filtern
  const filteredComponents = droneComponents[activeComponent]?.filter((component) => {
    const hasOptions = component.options;
    if (!hasOptions) return true; // Zeige Komponenten ohne Optionen (z. B. Motoren)
    const matchesSize = filters.size
      ? component.options.some((opt) => opt.size === filters.size)
      : true;
    const matchesMarke = filters.marke
      ? component.options.some((opt) => opt.marke === filters.marke)
      : true;
    return matchesSize && matchesMarke;
  });

  const getOptionKeysAndValues = () => {
    const allOptions = droneComponents[activeComponent]
      ?.flatMap((component) => component.options || []);
    const keys = [...new Set(allOptions?.map((option) => Object.keys(option)[0]) || [])];
    const optionsByKey = {};

    keys.forEach((key) => {
      optionsByKey[key] = [
        ...new Set(allOptions.filter((option) => option[key]).map((option) => option[key])),
      ].sort((a, b) => {
        // Numerische Sortierung, wenn beide Werte Zahlen sind
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        // Alphabetische Sortierung für Strings
        return a.localeCompare(b);
      });
    });

    return { keys, optionsByKey };
  };

  const { keys, optionsByKey } = getOptionKeysAndValues();

  const showComponentDetails = (component) => {
    setSelectedDetailComponent(component)
  }

  return (
    <div className='w-full'>
      <Tabs>
        <TabsList>
          <TabsTrigger value='components'>Alle Komponenten</TabsTrigger>
        </TabsList>
        <TabsContent value='components'>
          <div className="flex justify-between items-center mb-4 px-4">
            <h3 className="text-lg font-semibold">Drohnen Komponenten</h3>
          </div>

          <Dialog open={!!selectedDetailComponent} onOpenChange={() => setSelectedDetailComponent(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedDetailComponent?.name}</DialogTitle>
                <DialogDescription>
                  Detaillierte Informationen zu dieser Komponente
                </DialogDescription>
              </DialogHeader>
              {selectedDetailComponent && (
                <div className="space-y-4">
                  {selectedDetailComponent.imageurl && (
                    <div className="flex justify-center">
                      <Image
                        src={selectedDetailComponent.imageurl}
                        alt={selectedDetailComponent.name}
                        width={200}
                        height={200}
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
                      <p className="text-2xl font-bold text-green-600">{selectedDetailComponent.price} €</p>
                    </div>

                    {selectedDetailComponent.options && selectedDetailComponent.options.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-lg">Verfügbare Optionen</h4>
                        <div className="space-y-2">
                          {selectedDetailComponent.options.map((option, i) => (
                            <div key={i} className="bg-gray-50 p-3 rounded-lg">
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
                          // Hier würden Sie die Komponente auswählen
                          // handleComponentSelect wird in der Karte aufgerufen
                          setSelectedDetailComponent(null)
                        }}
                      >
                        Schließen
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {componentGroup.map((componentType, index) => (
          <Collapsible
            open={isOpen.componentType}
            onOpenChange={setIsOpen.componentType}
            className="flex w-full flex-col gap-2"
            key={index}
          >
            <div className="flex items-center justify-between gap-4 px-4">
              <h4 className="text-sm font-semibold">
                {componentType.charAt(0).toUpperCase() + componentType.slice(1)}
              </h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <ChevronsUpDown />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="flex flex-col gap-2 w-full">
              <div className="space-y-3">
                {droneComponents[componentType]?.some((component) => component.options) && (
                  <div className="flex space-x-4 mb-4 flex-wrap">
                    {keys.map((key) => (
                      <div key={key} className="mb-2">
                        <label
                          htmlFor={`${key}-filter`}
                          className="text-sm font-medium mr-2 capitalize"
                        >
                          {key}:
                        </label>
                        <select
                          id={`${key}-filter`}
                          className="p-2 border rounded-md"
                          value={filters[key] || ''}
                          onChange={(e) =>
                            setFilters({ ...filters, [key]: e.target.value || '' })
                          }
                        >
                          <option value="">Alle</option>
                          {optionsByKey[key]?.map((value, i) => (
                            <option key={i} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
                <div className="overflow-y-auto space-y-2 flex flex-wrap justify-around">
                  {/* Komponentenliste */}
                  {droneComponents[componentType]
                  ?.filter((component) => {
                    const hasOptions = component.options;
                    if (!hasOptions) return true; // Zeige Komponenten ohne Optionen (z.B. Motoren)
                    return keys.every((key) => {
                      const filterValue = filters[key];
                      return filterValue
                        ? component.options.some((opt) => opt[key] === filterValue)
                        : true;
                    });
                  })
                  .map((component, index) => (
                    <Card className="w-[23dvw] h-[23dvw] flex flex-col">
                      <CardHeader className="h-[9dvw] flex-shrink-0 mb-6">
                        <CardTitle className="flex items-center justify-between h-[5dvw] m-0">
                          {component.name}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => openShop(e, component.shop)}
                          >
                            <ExternalLink className="size-4" />
                          </Button>
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {component.description && (
                            <div className="mt-2 h-[6dvw] overflow-auto">
                              <p
                                className={`text-sm text-gray-600 transition-all duration-200 ${
                                  expandedDescriptions[index] ? 'line-clamp-none' : 'line-clamp-2'
                                }`}
                              >
                                {component.description}
                              </p>
                              {component.description.length > 100 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleDescription(index);
                                  }}
                                  className="text-xs text-blue-500 hover:underline mt-1"
                                >
                                  {expandedDescriptions[index] ? 'Weniger anzeigen' : 'Mehr anzeigen'}
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
                              src={component.imageurl}
                              alt={component.name}
                              width={80}
                              height={80}
                              className="rounded-md object-cover"
                            />
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              Preis: {component.price} €
                            </span>
                            {component.options && (
                              <div className="mt-2 space-y-1 max-h-[6dvw] overflow-auto">
                                {component.options.map((option, i) => (
                                  <div key={i} className="text-xs text-muted-foreground">
                                    {Object.entries(option).map(([key, value]) => (
                                      <span key={key}>
                                        {key}: {value}{' '}
                                      </span>
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
                            onClick={() => showComponentDetails(component)}
                          >
                            <Info className="size-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toast("Komponent bearbeiten")}
                          >
                            Bearbeiten
                          </Button>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => toast("Komponente entfernen")}
                        >
                          Entfernen
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Panel
