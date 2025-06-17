import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Play, FileText, ShoppingCart, Zap, X, Camera, Cpu, AppWindow } from "lucide-react"
import Image from "next/image"

const Builder = () => {

  const [selectedComponents, setSelectedComponents] = useState({})
  const [activeComponent, setActiveComponent] = useState("frame")
  const [expandedDescriptions, setExpandedDescriptions] = useState({})

  const [droneComponents, setDroneComponents] = useState({})

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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            FPV Drohnen Builder
          </CardTitle>
          <CardDescription>Klicke auf die Komponenten um deine Drohne zu konfigurieren</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* 2D Drohnen-Ansicht */}
            <div className="space-y-4">
              <h3 className="font-semibold text-center lg:text-left">Drohnen-Konfiguration</h3>
              <div className="relative bg-transparent rounded-lg p-4 lg:p-8 min-h-[300px] lg:min-h-[400px] flex items-center justify-center">
                {/* Tooltip that appears on hover */}
                <div
                id="component-tooltip"
                className="absolute bg-gray-300 text-foreground px-2 py-1 rounded text-xs pointer-events-none opacity-0 transition-opacity z-10"
                style={{ top: '10px', left: '50%', transform: 'translateX(-50%)' }}
                >
                Component name
                </div>

                <svg
                width="100%"
                height="100%"
                viewBox="0 0 300 300"
                className="border-none rounded w-full h-full min-h-[300px] max-h-[500px]"
                preserveAspectRatio="xMidYMid meet"
                onMouseOut={() => {
                  const tooltip = document.getElementById('component-tooltip');
                  if (tooltip) tooltip.style.opacity = '0';
                }}
                >
                {/* Frame mit Armen */}
                <rect
                  x="130"
                  y="130"
                  width="40"
                  height="40"
                  fill={selectedComponents.frame ? "#8ccd82" : activeComponent === "frame" ? "#4d87bf" : "#aebbc4"}
                  className="cursor-pointer hover:stroke-[#82a8cd] transition-colors frame-element"
                  onClick={() => setActiveComponent("frame")}
                  onMouseOver={() => {
                  const elements = document.getElementsByClassName('frame-element');
                  Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]', 'stroke-[#82a8cd]'));
                  const tooltip = document.getElementById('component-tooltip');
                  if (tooltip) {
                    tooltip.textContent = 'Frame';
                    tooltip.style.opacity = '1';
                  }
                  }}
                  onMouseOut={() => {
                  const elements = document.getElementsByClassName('frame-element');
                  Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]', 'stroke-[#82a8cd]'));
                  }}
                />

                {/* Arme vom Frame zu den Motoren */}
                <line
                  x1="150"
                  y1="150"
                  x2="80"
                  y2="80"
                  stroke={selectedComponents.frame ? "#8ccd82" : activeComponent === "frame" ? "#4d87bf" : "#aebbc4"}
                  strokeWidth="4"
                  className="cursor-pointer hover:stroke-[#82a8cd] transition-colors frame-element"
                  onClick={() => setActiveComponent("frame")}
                  onMouseOver={() => {
                  const elements = document.getElementsByClassName('frame-element');
                  Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]', 'stroke-[#82a8cd]'));
                  const tooltip = document.getElementById('component-tooltip');
                  if (tooltip) {
                    tooltip.textContent = 'Frame';
                    tooltip.style.opacity = '1';
                  }
                  }}
                  onMouseOut={() => {
                  const elements = document.getElementsByClassName('frame-element');
                  Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]', 'stroke-[#82a8cd]'));
                  }}
                />
                <line
                  x1="150"
                  y1="150"
                  x2="220"
                  y2="80"
                  stroke={selectedComponents.frame ? "#8ccd82" : activeComponent === "frame" ? "#4d87bf" : "#aebbc4"}
                  strokeWidth="4"
                  className="cursor-pointer hover:stroke-[#82a8cd] transition-colors frame-element"
                  onClick={() => setActiveComponent("frame")}
                  onMouseOver={() => {
                  const elements = document.getElementsByClassName('frame-element');
                  Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]', 'stroke-[#82a8cd]'));
                  const tooltip = document.getElementById('component-tooltip');
                  if (tooltip) {
                    tooltip.textContent = 'Frame';
                    tooltip.style.opacity = '1';
                  }
                  }}
                  onMouseOut={() => {
                  const elements = document.getElementsByClassName('frame-element');
                  Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]', 'stroke-[#82a8cd]'));
                  }}
                />
                <line
                  x1="150"
                  y1="150"
                  x2="80"
                  y2="220"
                  stroke={selectedComponents.frame ? "#8ccd82" : activeComponent === "frame" ? "#4d87bf" : "#aebbc4"}
                  strokeWidth="4"
                  className="cursor-pointer hover:stroke-[#82a8cd] transition-colors frame-element"
                  onClick={() => setActiveComponent("frame")}
                  onMouseOver={() => {
                  const elements = document.getElementsByClassName('frame-element');
                  Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]', 'stroke-[#82a8cd]'));
                  const tooltip = document.getElementById('component-tooltip');
                  if (tooltip) {
                    tooltip.textContent = 'Frame';
                    tooltip.style.opacity = '1';
                  }
                  }}
                  onMouseOut={() => {
                  const elements = document.getElementsByClassName('frame-element');
                  Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]', 'stroke-[#82a8cd]'));
                  }}
                />
                <line
                  x1="150"
                  y1="150"
                  x2="220"
                  y2="220"
                  stroke={selectedComponents.frame ? "#8ccd82" : activeComponent === "frame" ? "#4d87bf" : "#aebbc4"}
                  strokeWidth="4"
                  className="cursor-pointer hover:stroke-[#82a8cd] transition-colors frame-element"
                  onClick={() => setActiveComponent("frame")}
                  onMouseOver={() => {
                  const elements = document.getElementsByClassName('frame-element');
                  Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]', 'stroke-[#82a8cd]'));
                  const tooltip = document.getElementById('component-tooltip');
                  if (tooltip) {
                    tooltip.textContent = 'Frame';
                    tooltip.style.opacity = '1';
                  }
                  }}
                  onMouseOut={() => {
                  const elements = document.getElementsByClassName('frame-element');
                  Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]', 'stroke-[#82a8cd]'));
                  }}
                />

                {/* Motoren */}
                <circle
                  cx="80"
                  cy="80"
                  r="15"
                  fill={selectedComponents.motors ? "#8ccd82" : activeComponent === "motors" ? "#4d87bf" : "#aebbc4"}
                  className="cursor-pointer hover:fill-[#82a8cd] transition-colors motors-element"
                  onClick={() => setActiveComponent("motors")}
                  onMouseOver={() => {
                  const elements = document.getElementsByClassName('motors-element');
                  Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                  const tooltip = document.getElementById('component-tooltip');
                  if (tooltip) {
                    tooltip.textContent = 'Motoren';
                    tooltip.style.opacity = '1';
                  }
                  }}
                  onMouseOut={() => {
                  const elements = document.getElementsByClassName('motors-element');
                  Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                  }}
                />
                <circle
                  cx="220"
                  cy="80"
                  r="15"
                  fill={selectedComponents.motors ? "#8ccd82" : activeComponent === "motors" ? "#4d87bf" : "#aebbc4"}
                  className="cursor-pointer hover:fill-[#82a8cd] transition-colors motors-element"
                  onClick={() => setActiveComponent("motors")}
                  onMouseOver={() => {
                  const elements = document.getElementsByClassName('motors-element');
                  Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                  const tooltip = document.getElementById('component-tooltip');
                  if (tooltip) {
                    tooltip.textContent = 'Motoren';
                    tooltip.style.opacity = '1';
                  }
                  }}
                  onMouseOut={() => {
                  const elements = document.getElementsByClassName('motors-element');
                  Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                  }}
                />
                <circle
                  cx="80"
                  cy="220"
                  r="15"
                  fill={selectedComponents.motors ? "#8ccd82" : activeComponent === "motors" ? "#4d87bf" : "#aebbc4"}
                  className="cursor-pointer hover:fill-[#82a8cd] transition-colors motors-element"
                  onClick={() => setActiveComponent("motors")}
                  onMouseOver={() => {
                  const elements = document.getElementsByClassName('motors-element');
                  Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                  const tooltip = document.getElementById('component-tooltip');
                  if (tooltip) {
                    tooltip.textContent = 'Motoren';
                    tooltip.style.opacity = '1';
                  }
                  }}
                  onMouseOut={() => {
                  const elements = document.getElementsByClassName('motors-element');
                  Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                  }}
                />
                <circle
                  cx="220"
                  cy="220"
                  r="15"
                  fill={selectedComponents.motors ? "#8ccd82" : activeComponent === "motors" ? "#4d87bf" : "#aebbc4"}
                  className="cursor-pointer hover:fill-[#82a8cd] transition-colors motors-element"
                  onClick={() => setActiveComponent("motors")}
                  onMouseOver={() => {
                  const elements = document.getElementsByClassName('motors-element');
                  Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                  const tooltip = document.getElementById('component-tooltip');
                  if (tooltip) {
                    tooltip.textContent = 'Motoren';
                    tooltip.style.opacity = '1';
                  }
                  }}
                  onMouseOut={() => {
                  const elements = document.getElementsByClassName('motors-element');
                  Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                  }}
                />

                {/* ESC */}
                <rect
                  x="140"
                  y="140"
                  width="20"
                  height="20"
                  fill={selectedComponents.esc ? "#8ccd82" : activeComponent === "esc" ? "#4d87bf" : "#aebbc4"}
                  className="cursor-pointer hover:fill-[#82a8cd] transition-colors esc-element"
                  onClick={() => setActiveComponent("esc")}
                  onMouseOver={() => {
                  const elements = document.getElementsByClassName('esc-element');
                  Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                  const tooltip = document.getElementById('component-tooltip');
                  if (tooltip) {
                    tooltip.textContent = 'ESC';
                    tooltip.style.opacity = '1';
                  }
                  }}
                  onMouseOut={() => {
                  const elements = document.getElementsByClassName('esc-element');
                  Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                  }}
                />

                {/* Flight Controller */}
                <rect
                  x="145"
                  y="145"
                  width="10"
                  height="10"
                  fill={selectedComponents.fc ? "#8ccd82": activeComponent === "fc" ? "#4d87bf" : "#aebbc4"}
                  className="cursor-pointer hover:fill-[#82a8cd] transition-colors fc-element"
                  onClick={() => setActiveComponent("fc")}
                  onMouseOver={() => {
                  const elements = document.getElementsByClassName('fc-element');
                  Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                  const tooltip = document.getElementById('component-tooltip');
                  if (tooltip) {
                    tooltip.textContent = 'Flight Controller';
                    tooltip.style.opacity = '1';
                  }
                  }}
                  onMouseOut={() => {
                  const elements = document.getElementsByClassName('fc-element');
                  Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                  }}
                />

                {/* Propeller */}
                <g transform="translate(80, 80) rotate(-5)">
                  {/* Propeller-Blatt 1 */}
                  <path
                    d="M0 0 Q 35 -15 55 -35 Q 60 -40 55 -45 Q 30 -25 0 0 Z"
                    fill={selectedComponents.props ? "#8ccd82" : activeComponent === "props" ? "#4d87bf" : "#aebbc4"}
                    className="cursor-pointer transition-colors props-element"
                    onClick={() => setActiveComponent("props")}
                    onMouseOver={() => {
                      const elements = document.getElementsByClassName('props-element');
                      Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                      const tooltip = document.getElementById('component-tooltip');
                      if (tooltip) {
                        tooltip.textContent = 'Propeller';
                        tooltip.style.opacity = '1';
                      }
                    }}
                    onMouseOut={() => {
                      const elements = document.getElementsByClassName('props-element');
                      Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                    }}
                  />
                  {/* Propeller-Blatt 2 (180° gedreht) */}
                  <path
                    d="M0 0 Q 35 -15 55 -35 Q 60 -40 55 -45 Q 30 -25 0 0 Z"
                    transform="rotate(180)"
                    fill={selectedComponents.props ? "#8ccd82" : activeComponent === "props" ? "#4d87bf" : "#aebbc4"}
                    className="cursor-pointer transition-colors props-element"
                    onClick={() => setActiveComponent("props")}
                    onMouseOver={() => {
                      const elements = document.getElementsByClassName('props-element');
                      Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                      const tooltip = document.getElementById('component-tooltip');
                      if (tooltip) {
                        tooltip.textContent = 'Propeller';
                        tooltip.style.opacity = '1';
                      }
                    }}
                    onMouseOut={() => {
                      const elements = document.getElementsByClassName('props-element');
                      Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                    }}
                  />
                  {/* Motorhalterung (kleiner Kreis) */}
                  <circle
                    cx="0"
                    cy="0"
                    r="4"
                    fill={selectedComponents.props ? "#8ccd82" : activeComponent === "props" ? "#4d87bf" : "#aebbc4"}
                    className="props-element"
                  />
                </g>
                <g transform="translate(220, 80) rotate(85)">
                  {/* Propeller-Blatt 1 */}
                  <path
                    d="M0 0 Q 35 -15 55 -35 Q 60 -40 55 -45 Q 30 -25 0 0 Z"
                    fill={selectedComponents.props ? "#8ccd82" : activeComponent === "props" ? "#4d87bf" : "#aebbc4"}
                    className="cursor-pointer transition-colors props-element"
                    onClick={() => setActiveComponent("props")}
                    onMouseOver={() => {
                      const elements = document.getElementsByClassName('props-element');
                      Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                      const tooltip = document.getElementById('component-tooltip');
                      if (tooltip) {
                        tooltip.textContent = 'Propeller';
                        tooltip.style.opacity = '1';
                      }
                    }}
                    onMouseOut={() => {
                      const elements = document.getElementsByClassName('props-element');
                      Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                    }}
                  />
                  {/* Propeller-Blatt 2 (180° gedreht) */}
                  <path
                    d="M0 0 Q 35 -15 55 -35 Q 60 -40 55 -45 Q 30 -25 0 0 Z"
                    transform="rotate(180)"
                    fill={selectedComponents.props ? "#8ccd82" : activeComponent === "props" ? "#4d87bf" : "#aebbc4"}
                    className="cursor-pointer transition-colors props-element"
                    onClick={() => setActiveComponent("props")}
                    onMouseOver={() => {
                      const elements = document.getElementsByClassName('props-element');
                      Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                      const tooltip = document.getElementById('component-tooltip');
                      if (tooltip) {
                        tooltip.textContent = 'Propeller';
                        tooltip.style.opacity = '1';
                      }
                    }}
                    onMouseOut={() => {
                      const elements = document.getElementsByClassName('props-element');
                      Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                    }}
                  />
                  {/* Motorhalterung (kleiner Kreis) */}
                  <circle
                    cx="0"
                    cy="0"
                    r="4"
                    fill={selectedComponents.props ? "#8ccd82" : activeComponent === "props" ? "#4d87bf" : "#aebbc4"}
                    className="props-element"
                  />
                </g>
                <g transform="translate(80, 220) rotate(-95)">
                  {/* Propeller-Blatt 1 */}
                  <path
                    d="M0 0 Q 35 -15 55 -35 Q 60 -40 55 -45 Q 30 -25 0 0 Z"
                    fill={selectedComponents.props ? "#8ccd82" : activeComponent === "props" ? "#4d87bf" : "#aebbc4"}
                    className="cursor-pointer transition-colors props-element"
                    onClick={() => setActiveComponent("props")}
                    onMouseOver={() => {
                      const elements = document.getElementsByClassName('props-element');
                      Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                      const tooltip = document.getElementById('component-tooltip');
                      if (tooltip) {
                        tooltip.textContent = 'Propeller';
                        tooltip.style.opacity = '1';
                      }
                    }}
                    onMouseOut={() => {
                      const elements = document.getElementsByClassName('props-element');
                      Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                    }}
                  />
                  {/* Propeller-Blatt 2 (180° gedreht) */}
                  <path
                    d="M0 0 Q 35 -15 55 -35 Q 60 -40 55 -45 Q 30 -25 0 0 Z"
                    transform="rotate(180)"
                    fill={selectedComponents.props ? "#8ccd82" : activeComponent === "props" ? "#4d87bf" : "#aebbc4"}
                    className="cursor-pointer transition-colors props-element"
                    onClick={() => setActiveComponent("props")}
                    onMouseOver={() => {
                      const elements = document.getElementsByClassName('props-element');
                      Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                      const tooltip = document.getElementById('component-tooltip');
                      if (tooltip) {
                        tooltip.textContent = 'Propeller';
                        tooltip.style.opacity = '1';
                      }
                    }}
                    onMouseOut={() => {
                      const elements = document.getElementsByClassName('props-element');
                      Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                    }}
                  />
                  {/* Motorhalterung (kleiner Kreis) */}
                  <circle
                    cx="0"
                    cy="0"
                    r="4"
                    fill={selectedComponents.props ? "#8ccd82" : activeComponent === "props" ? "#4d87bf" : "#aebbc4"}
                    className="props-element"
                  />
                </g>
                <g transform="translate(220, 220) rotate(-5)">
                  {/* Propeller-Blatt 1 */}
                  <path
                    d="M0 0 Q 35 -15 55 -35 Q 60 -40 55 -45 Q 30 -25 0 0 Z"
                    fill={selectedComponents.props ? "#8ccd82" : activeComponent === "props" ? "#4d87bf" : "#aebbc4"}
                    className="cursor-pointer transition-colors props-element"
                    onClick={() => setActiveComponent("props")}
                    onMouseOver={() => {
                      const elements = document.getElementsByClassName('props-element');
                      Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                      const tooltip = document.getElementById('component-tooltip');
                      if (tooltip) {
                        tooltip.textContent = 'Propeller';
                        tooltip.style.opacity = '1';
                      }
                    }}
                    onMouseOut={() => {
                      const elements = document.getElementsByClassName('props-element');
                      Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                    }}
                  />
                  {/* Propeller-Blatt 2 (180° gedreht) */}
                  <path
                    d="M0 0 Q 35 -15 55 -35 Q 60 -40 55 -45 Q 30 -25 0 0 Z"
                    transform="rotate(180)"
                    fill={selectedComponents.props ? "#8ccd82" : activeComponent === "props" ? "#4d87bf" : "#aebbc4"}
                    className="cursor-pointer transition-colors props-element"
                    onClick={() => setActiveComponent("props")}
                    onMouseOver={() => {
                      const elements = document.getElementsByClassName('props-element');
                      Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                      const tooltip = document.getElementById('component-tooltip');
                      if (tooltip) {
                        tooltip.textContent = 'Propeller';
                        tooltip.style.opacity = '1';
                      }
                    }}
                    onMouseOut={() => {
                      const elements = document.getElementsByClassName('props-element');
                      Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                    }}
                  />
                  {/* Motorhalterung (kleiner Kreis) */}
                  <circle
                    cx="0"
                    cy="0"
                    r="4"
                    fill={selectedComponents.props ? "#8ccd82" : activeComponent === "props" ? "#4d87bf" : "#aebbc4"}
                    className="props-element"
                  />
                </g>

                {/* Akku */}
                <rect
                  x="125"
                  y="190"
                  width="50"
                  height="15"
                  fill={selectedComponents.battery ? "#8ccd82" : activeComponent === "battery" ? "#4d87bf" : "#aebbc4"}
                  className="cursor-pointer hover:fill-[#82a8cd] transition-colors battery-element"
                  onClick={() => setActiveComponent("battery")}
                  onMouseOver={() => {
                  const elements = document.getElementsByClassName('battery-element');
                  Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                  const tooltip = document.getElementById('component-tooltip');
                  if (tooltip) {
                    tooltip.textContent = 'Akku';
                    tooltip.style.opacity = '1';
                  }
                  }}
                  onMouseOut={() => {
                  const elements = document.getElementsByClassName('battery-element');
                  Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                  }}
                />

                {/* Camera */}
                <rect
                  x="130"
                  y="75"
                  width="35"
                  height="25"
                  fill={selectedComponents.camera ? "#8ccd82" : activeComponent === "camera" ? "#4d87bf" : "#aebbc4"}
                  className="cursor-pointer hover:fill-[#82a8cd] transition-colors camera-element"
                  onClick={() => setActiveComponent("camera")}
                  onMouseOver={() => {
                  const elements = document.getElementsByClassName('camera-element');
                  Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                  const tooltip = document.getElementById('component-tooltip');
                  if (tooltip) {
                    tooltip.textContent = 'Kamera';
                    tooltip.style.opacity = '1';
                  }
                  }}
                  onMouseOut={() => {
                  const elements = document.getElementsByClassName('camera-element');
                  Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                  }}
                />

                {/* Labels */}
                <text x="150" y="125" textAnchor="middle" className="text-xs fill-foreground">
                  Frame
                </text>
                <text x="80" y="50" textAnchor="middle" className="text-xs fill-foreground">
                  Motor
                </text>
                <text x="200" y="155" textAnchor="middle" className="text-xs fill-foreground">
                  ESC/FC
                </text>
                <text x="150" y="220" textAnchor="middle" className="text-xs fill-foreground">
                  Akku
                </text>
                <text x="147" y="70" textAnchor="middle" className="text-xs fill-foreground ">
                  Kamera
                </text>
                </svg>
              </div>

              {/* Komponenten-Auswahl */}
              {activeComponent && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-center lg:text-left">
                      {activeComponent === "frame" && "Frame auswählen"}
                      {activeComponent === "motors" && "Motoren auswählen"}
                      {activeComponent === "esc" && "ESC auswählen"}
                      {activeComponent === "fc" && "Flight Controller auswählen"}
                      {activeComponent === "props" && "Propeller auswählen"}
                      {activeComponent === "battery" && "Akku auswählen"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {droneComponents[activeComponent]?.some((component) => component.options) && (
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
                      <div className="max-h-[80dvh] overflow-y-auto space-y-2">
                        {/* Komponentenliste */}
                        {droneComponents[activeComponent]
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
                          <div
                            key={index}
                            className="flex flex-col lg:flex-row items-center justify-between p-3 border rounded-lg dark:hover:bg-gray-900 hover:bg-gray-50 shadow-sm hover:shadow-xl transition-all duration-100 cursor-pointer"
                            onClick={() => handleComponentSelect(activeComponent, component)}
                          >
                            <div className="flex items-center w-full">
                              <Image
                                src={component.imageurl}
                                alt={component.name}
                                width={80}
                                height={80}
                                className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg mb-2 lg:mb-0 lg:mr-4 shrink-0"
                              />
                              <div className="text-center lg:text-left flex-1">
                                <h4 className="font-medium">{component.name}</h4>
                                <p className="text-xs text-gray-500">Shop: {component.shop}</p>
                                <p className="text-xs text-gray-500">Preis: ${component.price}</p>
                                {component.options && (
                                  <p className="text-sm text-gray-600">
                                    {component.options.map((option, i) => (
                                      <span key={i} className="inline-block mr-2">
                                        {Object.values(option)[0]}
                                      </span>
                                    ))}
                                  </p>
                                )}
                                {component.description && (
                                  <div className="mt-2">
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
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => openShop(e, component.link)}
                              className="mt-2 ml-2 lg:mt-0 shrink-0"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Shop
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="flex flex-col gap-2">
              {/* Konfiguration & Einkaufsliste */}
              <div className="space-y-4">
                <h3 className="font-semibold text-center lg:text-left">Deine Konfiguration</h3>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      Einkaufsliste
                      <Badge variant="outline">Total: CHF {getTotalPrice()}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(selectedComponents).map(([type, component]) => (
                        <div key={type} className="flex flex-col lg:flex-row items-center justify-between p-2 border rounded">
                          <div className="flex items-center">
                            <Image
                                src={component.imageurl}
                                alt={component.name}
                                width={80}
                                height={80}
                                className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg mb-2 lg:mb-0 lg:mr-4 shrink-0"
                            />
                            <div className="text-center lg:text-left">
                              <h4 className="font-medium text-sm">{component.name}</h4>
                              <p className="text-xs text-gray-600">{component.shop}</p>
                            </div>
                          </div>
                          <div className="text-right mt-2 lg:mt-0 flex items-center gap-2">
                            <p className="font-bold text-sm">CHF {component.price}</p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => openShop(e, component.link)}
                              className="mt-2 ml-2 lg:mt-0 shrink-0"
                            >
                              <ShoppingCart className="h-3 w-3 mr-1" />
                              Shop
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleComponentRemove(type)}
                              className="mt-2 ml-2 lg:mt-0 shrink-0"
                            >
                              <X className="h-3 w-3 mr-1" />
                              Entfernen
                            </Button>
                          </div>
                        </div>
                      ))}

                      {Object.keys(selectedComponents).length === 0 && (
                        <p className="text-gray-500 text-center py-4">
                          Klicke auf die Komponenten in der Drohnen-Ansicht um sie auszuwählen
                        </p>
                      )}
                    </div>

                    {Object.keys(selectedComponents).length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <Button className="w-full">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Totaler Preis CHF {getTotalPrice()}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Schweizer FPV Shops</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>fpvracing.ch</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open("https://fpvracing.ch", "_blank")}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex justify-between">
                        <span>FPVFrame.ch</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open("https://fpvframe.ch", "_blank")}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex justify-between">
                        <span>dronefactory.ch</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open("https://dronefactory.ch", "_blank")}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex justify-between">
                        <span>fpv24.com</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open("https://www.fpv24.com/de", "_blank")}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex justify-between">
                        <span>quadmula.com</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open("https://quadmula.com/", "_blank")}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Shop ablauf</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <ul className="pl-4">
                        <li className="list-disc">Frame</li>
                        <li className="list-disc">Flight Controller (FC)</li>
                        <li className="list-disc">Electronic Speed Controller (ESC)</li>
                        <li className="list-disc">Motoren</li>
                        <li className="list-disc">Propeller</li>
                        <li className="list-disc">Akku</li>
                        <li className="list-disc">FPV-System (Kamer und Videoübertragung)</li>
                        <li className="list-disc">Empfänger</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default Builder