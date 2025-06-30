import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ExternalLink, Play, FileText, ShoppingCart, Zap, X, Camera, Cpu, Drone, ChevronDown, ChevronRight, Edit, Trash } from "lucide-react"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'sonner'
import { decodeUserSession } from "@/lib/session"

const Builds = () => {
  const [builds, setBuilds] = useState([])
  const [openBuilds, setOpenBuilds] = useState({})
  const [editBuild, setEditBuild] = useState(null)
  const [editingComponents, setEditingComponents] = useState({})
  const [activeEditComponent, setActiveEditComponent] = useState(null)
  const [filters, setFilters] = useState({})
  const [droneComponents, setDroneComponents] = useState({})
  const [expandedDescriptions, setExpandedDescriptions] = useState({})
  const [session, setSession] = useState(null)

  useEffect(() => {
    const getBuildData = async () => {
      try {
        const response = await fetch('/api/builds', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        const data = await response.json()
        setBuilds(data.data || [])
        console.log("Builds data:", data)
      } catch (error) {
        console.error('Error fetching builds:', error)
      }
    }

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

    const getSession = async () => {
      const sessionkey = sessionStorage.getItem("session")
      const sessionvalue = await decodeUserSession(sessionkey || "")
      setSession(sessionvalue === 0 ? true : false)
    }

    getSession()
    getBuildData()
    getData();

  }, [])


  // Edit Dialog Functions
  const handleEditComponentSelect = (componentType, component) => {
    setEditingComponents((prev) => ({
      ...prev,
      [componentType]: component,
    }))
    // Auto-progress to next component like in builder
    switch (componentType) {
      case "frame":
        setActiveEditComponent("fc")
        break
      case "fc":
        setActiveEditComponent("esc")
        break
      case "esc":
        setActiveEditComponent("motors")
        break
      case "motors":
        setActiveEditComponent("propellers")
        break
      case "props":
        setActiveEditComponent("battery")
        break
      case "battery":
        setActiveEditComponent("camera")
        break
      case "camera":
        setActiveEditComponent(null)
        break
      default:
        setActiveEditComponent(null)
    }
  }

  const toggleDescription = (index) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const openShop = (e, shop) => {
    e.stopPropagation()
    window.open(shop, "_blank", "noopener,noreferrer")
  }

  // Funktion, um einen Build in ein Array von Komponenten umzuwandeln
  const getComponentsFromBuild = (build) => {
    const components = [];

    // Definiere die erwarteten Komponententypen
    const componentTypes = ['frame', 'battery', 'camera', 'esc', 'fc', 'motors', 'propellers'];

    componentTypes.forEach(type => {
      if (build[type]) {
        components.push({
          type,
          ...build[type] // Direkt das Objekt verwenden, da es bereits die richtige Struktur hat
        });
      }
    });

    return components;
  };

  const toggleBuildOpen = (buildId) => {
    setOpenBuilds(prev => ({
      ...prev,
      [buildId]: !prev[buildId]
    }));
  };

  // Edit Funktionen
  const startEditBuild = (build) => {
    setEditBuild(build);
    const components = {};
    const componentTypes = ['frame', 'battery', 'camera', 'esc', 'fc', 'motors', 'propellers'];

    componentTypes.forEach(type => {
      if (build[type]) {
        components[type] = build[type];
      }
    });

    // Handle legacy "props" property name
    if (build.props && !components.propellers) {
      components.propellers = build.props;
    }

    setEditingComponents(components);
    setActiveEditComponent("frame");
    setFilters({});
  };

  const handleEditComponentRemove = (componentType) => {
    setEditingComponents((prev) => {
      const newComponents = { ...prev };
      delete newComponents[componentType];
      return newComponents;
    });
    // Navigation zurück zur entfernten Komponente
    setActiveEditComponent(componentType);
  };

  const getEditTotalPrice = () => {
    return Object.values(editingComponents).reduce((total, component) => total + (component?.price || 0), 0).toFixed(2);
  };

  const getEditFilteredComponents = () => {
    if (!activeEditComponent || !droneComponents[activeEditComponent]) return [];

    return droneComponents[activeEditComponent]
      .filter((component) => {
        const hasOptions = component.options;
        if (!hasOptions) return true;

        // Apply compatibility filtering like in builder
        switch (activeEditComponent) {
          case 'frame':
            return true
          case 'fc':
            return component.options.some((opt) => opt.grösse === editingComponents.frame?.options?.filter(obj => "stackGrösse" in obj).map(obj => obj["stackGrösse"])[0]);
          case 'esc':
            return component.options.some((opt) => opt.grösse === editingComponents.frame?.options?.filter(obj => "stackGrösse" in obj).map(obj => obj["stackGrösse"])[0]);
          case 'motors':
            return true
          case 'propellers':
            return component.options.some((opt) => opt.grösse === editingComponents.motors?.options?.filter(obj => "props" in obj).map(obj => obj["props"])[0]);
          case 'battery':
            return true
          case 'camera':
            return true
          default:
            return true;
        }
      })
      .filter((component) => {
        const hasOptions = component.options;
        if (!hasOptions) return true;
        const { keys } = getEditOptionKeysAndValues();
        return keys.every((key) => {
          const filterValue = filters[key];
          return filterValue
            ? component.options.some((opt) => opt[key] === filterValue)
            : true;
        });
      });
  };

  const getEditOptionKeysAndValues = () => {
    const allOptions = droneComponents[activeEditComponent]
      ?.flatMap((component) => component.options || []);
    const keys = [...new Set(allOptions?.map((option) => Object.keys(option)[0]) || [])];
    const optionsByKey = {};

    keys.forEach((key) => {
      optionsByKey[key] = [
        ...new Set(allOptions.filter((option) => option[key]).map((option) => option[key])),
      ].sort((a, b) => {
        const numA = parseFloat(a);
        const numB = parseFloat(b);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        }
        return a.localeCompare(b);
      });
    });

    return { keys, optionsByKey };
  };

  const saveEditedBuild = async () => {
    if (!editBuild) return;

    try {
      const updatedBuild = {
        build_id: editBuild.build_id,
        ...editingComponents
      };

      // Map propellers back to props for backend compatibility
      if (updatedBuild.propellers) {
        updatedBuild.props = updatedBuild.propellers;
        delete updatedBuild.propellers;
      }

      const response = await fetch(`/api/builds`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBuild)
      });

      if (!response.ok) {
        throw new Error('Failed to update build');
      }

      // Update local state with original property names
      const localUpdatedBuild = { ...editingComponents };
      if (localUpdatedBuild.propellers) {
        localUpdatedBuild.props = localUpdatedBuild.propellers;
        delete localUpdatedBuild.propellers;
      }

      setBuilds(prev => prev.map(build =>
        build.build_id === editBuild.build_id
          ? { ...build, ...localUpdatedBuild }
          : build
      ));

      setEditBuild(null);
      setEditingComponents({});
      toast.success('Build erfolgreich aktualisiert!');
    } catch (error) {
      console.error('Error updating build:', error);
      toast.error('Fehler beim Aktualisieren des Builds');
    }
  };

  const deleteBuild = async (id) => {

    if(!id) {
      toast.error('Fehlende ID beim Löschen des Builds');
      return;
    }

    try {
      const response = await fetch(`/api/builds`, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: id})
      });

      if (!response.ok) {
        throw new Error('Failed to update build');
      }

      toast.success('Build erfolgreich gelöscht!');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting build:', error);
      toast.error('Fehler beim Löschen des Builds');
    }
  };

  return (
    <div>
      {builds.sort((a, b) => a.build_id - b.build_id).map((build, index) => {
        const totalPrice = getComponentsFromBuild(build).reduce((total, component) => total + component.price, 0);
        const isOpen = openBuilds[build.build_id] || false;

        return (
          <Collapsible key={build.build_id} open={isOpen} onOpenChange={() => toggleBuildOpen(build.build_id)}>
            <Card className="mb-6">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer rounded-md group hover:bg-gray-50 transition-colors">
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center gap-2 group-hover:text-black transition-colors">
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <span>Build {build.build_id}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-green">Total: CHF {totalPrice.toFixed(2)}</span>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditBuild(build);
                            }}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-7xl h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Build {editBuild?.build_id} bearbeiten</DialogTitle>
                            <DialogDescription>
                              Passen Sie die Komponenten Ihres Builds an. Gesamtpreis: CHF {getEditTotalPrice()}
                            </DialogDescription>
                          </DialogHeader>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Drone Visualisierung - Linke Seite */}
                            <div>
                              <h3 className="text-lg font-semibold mb-4">Aktuelle Konfiguration</h3>
                              <div className="relative bg-transparent rounded-lg p-4 min-h-[400px] flex items-center justify-center border">
                                {/* Tooltip that appears on hover */}
                                <div
                                  id="edit-component-tooltip"
                                  className="absolute bg-gray-300 text-foreground px-2 py-1 rounded text-xs pointer-events-none opacity-0 transition-opacity z-10"
                                  style={{ top: '10px', left: '50%', transform: 'translateX(-50%)' }}
                                >
                                  Component name
                                </div>

                                <svg
                                  width="100%"
                                  height="100%"
                                  viewBox="0 0 300 300"
                                  className="border-none rounded w-full h-full min-h-[300px] max-h-[400px]"
                                  preserveAspectRatio="xMidYMid meet"
                                  onMouseOut={() => {
                                    const tooltip = document.getElementById('edit-component-tooltip');
                                    if (tooltip) tooltip.style.opacity = '0';
                                  }}
                                >
                                  {/* Frame mit Armen */}
                                  <rect
                                    x="130"
                                    y="130"
                                    width="40"
                                    height="40"
                                    fill={activeEditComponent === "frame" ? "#2563eb" : editingComponents.frame ? "#8ccd82" : "#aebbc4"}
                                    className="cursor-pointer hover:stroke-[#82a8cd] transition-colors edit-frame-element"
                                    onClick={() => setActiveEditComponent("frame")}
                                    onMouseOver={() => {
                                      const elements = document.getElementsByClassName('edit-frame-element');
                                      Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]', 'stroke-[#82a8cd]'));
                                      const tooltip = document.getElementById('edit-component-tooltip');
                                      if (tooltip) {
                                        tooltip.textContent = 'Frame';
                                        tooltip.style.opacity = '1';
                                      }
                                    }}
                                    onMouseOut={() => {
                                      const elements = document.getElementsByClassName('edit-frame-element');
                                      Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]', 'stroke-[#82a8cd]'));
                                    }}
                                  />

                                  {/* Arme vom Frame zu den Motoren */}
                                  <line
                                    x1="150"
                                    y1="150"
                                    x2="80"
                                    y2="80"
                                    stroke={activeEditComponent === "frame" ? "#2563eb" : editingComponents.frame ? "#8ccd82" : "#aebbc4"}
                                    strokeWidth="4"
                                    className="cursor-pointer hover:stroke-[#82a8cd] transition-colors edit-frame-element"
                                    onClick={() => setActiveEditComponent("frame")}
                                    onMouseOver={() => {
                                      const elements = document.getElementsByClassName('edit-frame-element');
                                      Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]', 'stroke-[#82a8cd]'));
                                      const tooltip = document.getElementById('edit-component-tooltip');
                                      if (tooltip) {
                                        tooltip.textContent = 'Frame';
                                        tooltip.style.opacity = '1';
                                      }
                                    }}
                                    onMouseOut={() => {
                                      const elements = document.getElementsByClassName('edit-frame-element');
                                      Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]', 'stroke-[#82a8cd]'));
                                    }}
                                  />
                                  <line
                                    x1="150"
                                    y1="150"
                                    x2="220"
                                    y2="80"
                                    stroke={activeEditComponent === "frame" ? "#2563eb" : editingComponents.frame ? "#8ccd82" : "#aebbc4"}
                                    strokeWidth="4"
                                    className="cursor-pointer hover:stroke-[#82a8cd] transition-colors edit-frame-element"
                                    onClick={() => setActiveEditComponent("frame")}
                                    onMouseOver={() => {
                                      const elements = document.getElementsByClassName('edit-frame-element');
                                      Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]', 'stroke-[#82a8cd]'));
                                      const tooltip = document.getElementById('edit-component-tooltip');
                                      if (tooltip) {
                                        tooltip.textContent = 'Frame';
                                        tooltip.style.opacity = '1';
                                      }
                                    }}
                                    onMouseOut={() => {
                                      const elements = document.getElementsByClassName('edit-frame-element');
                                      Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]', 'stroke-[#82a8cd]'));
                                    }}
                                  />
                                  <line
                                    x1="150"
                                    y1="150"
                                    x2="80"
                                    y2="220"
                                    stroke={activeEditComponent === "frame" ? "#2563eb" : editingComponents.frame ? "#8ccd82" : "#aebbc4"}
                                    strokeWidth="4"
                                    className="cursor-pointer hover:stroke-[#82a8cd] transition-colors edit-frame-element"
                                    onClick={() => setActiveEditComponent("frame")}
                                    onMouseOver={() => {
                                      const elements = document.getElementsByClassName('edit-frame-element');
                                      Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]', 'stroke-[#82a8cd]'));
                                      const tooltip = document.getElementById('edit-component-tooltip');
                                      if (tooltip) {
                                        tooltip.textContent = 'Frame';
                                        tooltip.style.opacity = '1';
                                      }
                                    }}
                                    onMouseOut={() => {
                                      const elements = document.getElementsByClassName('edit-frame-element');
                                      Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]', 'stroke-[#82a8cd]'));
                                    }}
                                  />
                                  <line
                                    x1="150"
                                    y1="150"
                                    x2="220"
                                    y2="220"
                                    stroke={activeEditComponent === "frame" ? "#2563eb" : editingComponents.frame ? "#8ccd82" : "#aebbc4"}
                                    strokeWidth="4"
                                    className="cursor-pointer hover:stroke-[#82a8cd] transition-colors edit-frame-element"
                                    onClick={() => setActiveEditComponent("frame")}
                                    onMouseOver={() => {
                                      const elements = document.getElementsByClassName('edit-frame-element');
                                      Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]', 'stroke-[#82a8cd]'));
                                      const tooltip = document.getElementById('edit-component-tooltip');
                                      if (tooltip) {
                                        tooltip.textContent = 'Frame';
                                        tooltip.style.opacity = '1';
                                      }
                                    }}
                                    onMouseOut={() => {
                                      const elements = document.getElementsByClassName('edit-frame-element');
                                      Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]', 'stroke-[#82a8cd]'));
                                    }}
                                  />

                                  {/* Motoren */}
                                  <circle
                                    cx="80"
                                    cy="80"
                                    r="15"
                                    fill={activeEditComponent === "motors" ? "#2563eb" : editingComponents.motors ? "#8ccd82" : "#aebbc4"}
                                    className="cursor-pointer hover:fill-[#82a8cd] transition-colors edit-motors-element"
                                    onClick={() => setActiveEditComponent("motors")}
                                    onMouseOver={() => {
                                      const elements = document.getElementsByClassName('edit-motors-element');
                                      Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                                      const tooltip = document.getElementById('edit-component-tooltip');
                                      if (tooltip) {
                                        tooltip.textContent = 'Motoren';
                                        tooltip.style.opacity = '1';
                                      }
                                    }}
                                    onMouseOut={() => {
                                      const elements = document.getElementsByClassName('edit-motors-element');
                                      Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                                    }}
                                  />
                                  <circle
                                    cx="220"
                                    cy="80"
                                    r="15"
                                    fill={activeEditComponent === "motors" ? "#2563eb" : editingComponents.motors ? "#8ccd82" : "#aebbc4"}
                                    className="cursor-pointer hover:fill-[#82a8cd] transition-colors edit-motors-element"
                                    onClick={() => setActiveEditComponent("motors")}
                                    onMouseOver={() => {
                                      const elements = document.getElementsByClassName('edit-motors-element');
                                      Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                                      const tooltip = document.getElementById('edit-component-tooltip');
                                      if (tooltip) {
                                        tooltip.textContent = 'Motoren';
                                        tooltip.style.opacity = '1';
                                      }
                                    }}
                                    onMouseOut={() => {
                                      const elements = document.getElementsByClassName('edit-motors-element');
                                      Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                                    }}
                                  />
                                  <circle
                                    cx="80"
                                    cy="220"
                                    r="15"
                                    fill={activeEditComponent === "motors" ? "#2563eb" : editingComponents.motors ? "#8ccd82" : "#aebbc4"}
                                    className="cursor-pointer hover:fill-[#82a8cd] transition-colors edit-motors-element"
                                    onClick={() => setActiveEditComponent("motors")}
                                    onMouseOver={() => {
                                      const elements = document.getElementsByClassName('edit-motors-element');
                                      Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                                      const tooltip = document.getElementById('edit-component-tooltip');
                                      if (tooltip) {
                                        tooltip.textContent = 'Motoren';
                                        tooltip.style.opacity = '1';
                                      }
                                    }}
                                    onMouseOut={() => {
                                      const elements = document.getElementsByClassName('edit-motors-element');
                                      Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                                    }}
                                  />
                                  <circle
                                    cx="220"
                                    cy="220"
                                    r="15"
                                    fill={activeEditComponent === "motors" ? "#2563eb" : editingComponents.motors ? "#8ccd82" : "#aebbc4"}
                                    className="cursor-pointer hover:fill-[#82a8cd] transition-colors edit-motors-element"
                                    onClick={() => setActiveEditComponent("motors")}
                                    onMouseOver={() => {
                                      const elements = document.getElementsByClassName('edit-motors-element');
                                      Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                                      const tooltip = document.getElementById('edit-component-tooltip');
                                      if (tooltip) {
                                        tooltip.textContent = 'Motoren';
                                        tooltip.style.opacity = '1';
                                      }
                                    }}
                                    onMouseOut={() => {
                                      const elements = document.getElementsByClassName('edit-motors-element');
                                      Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                                    }}
                                  />

                                  {/* ESC */}
                                  <rect
                                    x="140"
                                    y="140"
                                    width="20"
                                    height="20"
                                    fill={activeEditComponent === "esc" ? "#2563eb" : editingComponents.esc ? "#8ccd82" : "#aebbc4"}
                                    className="cursor-pointer hover:fill-[#82a8cd] transition-colors edit-esc-element"
                                    onClick={() => setActiveEditComponent("esc")}
                                    onMouseOver={() => {
                                      const elements = document.getElementsByClassName('edit-esc-element');
                                      Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                                      const tooltip = document.getElementById('edit-component-tooltip');
                                      if (tooltip) {
                                        tooltip.textContent = 'ESC';
                                        tooltip.style.opacity = '1';
                                      }
                                    }}
                                    onMouseOut={() => {
                                      const elements = document.getElementsByClassName('edit-esc-element');
                                      Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                                    }}
                                  />

                                  {/* Flight Controller */}
                                  <rect
                                    x="145"
                                    y="145"
                                    width="10"
                                    height="10"
                                    fill={activeEditComponent === "fc" ? "#2563eb" : editingComponents.fc ? "#8ccd82" : "#aebbc4"}
                                    className="cursor-pointer hover:fill-[#82a8cd] transition-colors edit-fc-element"
                                    onClick={() => setActiveEditComponent("fc")}
                                    onMouseOver={() => {
                                      const elements = document.getElementsByClassName('edit-fc-element');
                                      Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                                      const tooltip = document.getElementById('edit-component-tooltip');
                                      if (tooltip) {
                                        tooltip.textContent = 'Flight Controller';
                                        tooltip.style.opacity = '1';
                                      }
                                    }}
                                    onMouseOut={() => {
                                      const elements = document.getElementsByClassName('edit-fc-element');
                                      Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                                    }}
                                  />

                                  {/* Propeller */}
                                  <g transform="translate(80, 80) rotate(-5)">
                                    {/* Propeller-Blatt 1 */}
                                    <path
                                      d="M0 0 Q 35 -15 55 -35 Q 60 -40 55 -45 Q 30 -25 0 0 Z"
                                      fill={activeEditComponent === "propellers" ? "#2563eb" : editingComponents.propellers ? "#8ccd82" : "#aebbc4"}
                                      className="cursor-pointer transition-colors edit-propellers-element"
                                      onClick={() => setActiveEditComponent("propellers")}
                                      onMouseOver={() => {
                                        const elements = document.getElementsByClassName('edit-propellers-element');
                                        Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                                        const tooltip = document.getElementById('edit-component-tooltip');
                                        if (tooltip) {
                                          tooltip.textContent = 'Propeller';
                                          tooltip.style.opacity = '1';
                                        }
                                      }}
                                      onMouseOut={() => {
                                        const elements = document.getElementsByClassName('edit-propellers-element');
                                        Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                                      }}
                                    />
                                    {/* Propeller-Blatt 2 (180° gedreht) */}
                                    <path
                                      d="M0 0 Q 35 -15 55 -35 Q 60 -40 55 -45 Q 30 -25 0 0 Z"
                                      transform="rotate(180)"
                                      fill={activeEditComponent === "propellers" ? "#2563eb" : editingComponents.propellers ? "#8ccd82" : "#aebbc4"}
                                      className="cursor-pointer transition-colors edit-propellers-element"
                                      onClick={() => setActiveEditComponent("propellers")}
                                      onMouseOver={() => {
                                        const elements = document.getElementsByClassName('edit-propellers-element');
                                        Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                                        const tooltip = document.getElementById('edit-component-tooltip');
                                        if (tooltip) {
                                          tooltip.textContent = 'Propeller';
                                          tooltip.style.opacity = '1';
                                        }
                                      }}
                                      onMouseOut={() => {
                                        const elements = document.getElementsByClassName('edit-propellers-element');
                                        Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                                      }}
                                    />
                                    {/* Motorhalterung (kleiner Kreis) */}
                                    <circle
                                      cx="0"
                                      cy="0"
                                      r="4"
                                      fill={activeEditComponent === "propellers" ? "#2563eb" : editingComponents.propellers ? "#8ccd82" : "#aebbc4"}
                                      className="edit-propellers-element"
                                    />
                                  </g>
                                  <g transform="translate(220, 80) rotate(85)">
                                    {/* Propeller-Blatt 1 */}
                                    <path
                                      d="M0 0 Q 35 -15 55 -35 Q 60 -40 55 -45 Q 30 -25 0 0 Z"
                                      fill={activeEditComponent === "propellers" ? "#2563eb" : editingComponents.propellers ? "#8ccd82" : "#aebbc4"}
                                      className="cursor-pointer transition-colors edit-propellers-element"
                                      onClick={() => setActiveEditComponent("propellers")}
                                      onMouseOver={() => {
                                        const elements = document.getElementsByClassName('edit-propellers-element');
                                        Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                                        const tooltip = document.getElementById('edit-component-tooltip');
                                        if (tooltip) {
                                          tooltip.textContent = 'Propeller';
                                          tooltip.style.opacity = '1';
                                        }
                                      }}
                                      onMouseOut={() => {
                                        const elements = document.getElementsByClassName('edit-propellers-element');
                                        Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                                      }}
                                    />
                                    {/* Propeller-Blatt 2 (180° gedreht) */}
                                    <path
                                      d="M0 0 Q 35 -15 55 -35 Q 60 -40 55 -45 Q 30 -25 0 0 Z"
                                      transform="rotate(180)"
                                      fill={activeEditComponent === "propellers" ? "#2563eb" : editingComponents.propellers ? "#8ccd82" : "#aebbc4"}
                                      className="cursor-pointer transition-colors edit-propellers-element"
                                      onClick={() => setActiveEditComponent("propellers")}
                                      onMouseOver={() => {
                                        const elements = document.getElementsByClassName('edit-propellers-element');
                                        Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                                        const tooltip = document.getElementById('edit-component-tooltip');
                                        if (tooltip) {
                                          tooltip.textContent = 'Propeller';
                                          tooltip.style.opacity = '1';
                                        }
                                      }}
                                      onMouseOut={() => {
                                        const elements = document.getElementsByClassName('edit-propellers-element');
                                        Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                                      }}
                                    />
                                    {/* Motorhalterung (kleiner Kreis) */}
                                    <circle
                                      cx="0"
                                      cy="0"
                                      r="4"
                                      fill={activeEditComponent === "propellers" ? "#2563eb" : editingComponents.propellers ? "#8ccd82" : "#aebbc4"}
                                      className="edit-propellers-element"
                                    />
                                  </g>
                                  <g transform="translate(80, 220) rotate(-95)">
                                    {/* Propeller-Blatt 1 */}
                                    <path
                                      d="M0 0 Q 35 -15 55 -35 Q 60 -40 55 -45 Q 30 -25 0 0 Z"
                                      fill={activeEditComponent === "propellers" ? "#2563eb" : editingComponents.propellers ? "#8ccd82" : "#aebbc4"}
                                      className="cursor-pointer transition-colors edit-propellers-element"
                                      onClick={() => setActiveEditComponent("propellers")}
                                      onMouseOver={() => {
                                        const elements = document.getElementsByClassName('edit-propellers-element');
                                        Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                                        const tooltip = document.getElementById('edit-component-tooltip');
                                        if (tooltip) {
                                          tooltip.textContent = 'Propeller';
                                          tooltip.style.opacity = '1';
                                        }
                                      }}
                                      onMouseOut={() => {
                                        const elements = document.getElementsByClassName('edit-propellers-element');
                                        Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                                      }}
                                    />
                                    {/* Propeller-Blatt 2 (180° gedreht) */}
                                    <path
                                      d="M0 0 Q 35 -15 55 -35 Q 60 -40 55 -45 Q 30 -25 0 0 Z"
                                      transform="rotate(180)"
                                      fill={activeEditComponent === "propellers" ? "#2563eb" : editingComponents.propellers ? "#8ccd82" : "#aebbc4"}
                                      className="cursor-pointer transition-colors edit-propellers-element"
                                      onClick={() => setActiveEditComponent("propellers")}
                                      onMouseOver={() => {
                                        const elements = document.getElementsByClassName('edit-propellers-element');
                                        Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                                        const tooltip = document.getElementById('edit-component-tooltip');
                                        if (tooltip) {
                                          tooltip.textContent = 'Propeller';
                                          tooltip.style.opacity = '1';
                                        }
                                      }}
                                      onMouseOut={() => {
                                        const elements = document.getElementsByClassName('edit-propellers-element');
                                        Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                                      }}
                                    />
                                    {/* Motorhalterung (kleiner Kreis) */}
                                    <circle
                                      cx="0"
                                      cy="0"
                                      r="4"
                                      fill={activeEditComponent === "propellers" ? "#2563eb" : editingComponents.propellers ? "#8ccd82" : "#aebbc4"}
                                      className="edit-propellers-element"
                                    />
                                  </g>
                                  <g transform="translate(220, 220) rotate(-5)">
                                    {/* Propeller-Blatt 1 */}
                                    <path
                                      d="M0 0 Q 35 -15 55 -35 Q 60 -40 55 -45 Q 30 -25 0 0 Z"
                                      fill={activeEditComponent === "propellers" ? "#2563eb" : editingComponents.propellers ? "#8ccd82" : "#aebbc4"}
                                      className="cursor-pointer transition-colors edit-propellers-element"
                                      onClick={() => setActiveEditComponent("propellers")}
                                      onMouseOver={() => {
                                        const elements = document.getElementsByClassName('edit-propellers-element');
                                        Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                                        const tooltip = document.getElementById('edit-component-tooltip');
                                        if (tooltip) {
                                          tooltip.textContent = 'Propeller';
                                          tooltip.style.opacity = '1';
                                        }
                                      }}
                                      onMouseOut={() => {
                                        const elements = document.getElementsByClassName('edit-propellers-element');
                                        Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                                      }}
                                    />
                                    {/* Propeller-Blatt 2 (180° gedreht) */}
                                    <path
                                      d="M0 0 Q 35 -15 55 -35 Q 60 -40 55 -45 Q 30 -25 0 0 Z"
                                      transform="rotate(180)"
                                      fill={activeEditComponent === "propellers" ? "#2563eb" : editingComponents.propellers ? "#8ccd82" : "#aebbc4"}
                                      className="cursor-pointer transition-colors edit-propellers-element"
                                      onClick={() => setActiveEditComponent("propellers")}
                                      onMouseOver={() => {
                                        const elements = document.getElementsByClassName('edit-propellers-element');
                                        Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                                        const tooltip = document.getElementById('edit-component-tooltip');
                                        if (tooltip) {
                                          tooltip.textContent = 'Propeller';
                                          tooltip.style.opacity = '1';
                                        }
                                      }}
                                      onMouseOut={() => {
                                        const elements = document.getElementsByClassName('edit-propellers-element');
                                        Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                                      }}
                                    />
                                    {/* Motorhalterung (kleiner Kreis) */}
                                    <circle
                                      cx="0"
                                      cy="0"
                                      r="4"
                                      fill={activeEditComponent === "propellers" ? "#2563eb" : editingComponents.propellers ? "#8ccd82" : "#aebbc4"}
                                      className="edit-propellers-element"
                                    />
                                  </g>

                                  {/* Akku */}
                                  <rect
                                    x="125"
                                    y="190"
                                    width="50"
                                    height="15"
                                    fill={activeEditComponent === "battery" ? "#2563eb" : editingComponents.battery ? "#8ccd82" : "#aebbc4"}
                                    className="cursor-pointer hover:fill-[#82a8cd] transition-colors edit-battery-element"
                                    onClick={() => setActiveEditComponent("battery")}
                                    onMouseOver={() => {
                                      const elements = document.getElementsByClassName('edit-battery-element');
                                      Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                                      const tooltip = document.getElementById('edit-component-tooltip');
                                      if (tooltip) {
                                        tooltip.textContent = 'Akku';
                                        tooltip.style.opacity = '1';
                                      }
                                    }}
                                    onMouseOut={() => {
                                      const elements = document.getElementsByClassName('edit-battery-element');
                                      Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                                    }}
                                  />

                                  {/* Camera */}
                                  <rect
                                    x="130"
                                    y="75"
                                    width="35"
                                    height="25"
                                    fill={activeEditComponent === "camera" ? "#2563eb" : editingComponents.camera ? "#8ccd82" : "#aebbc4"}
                                    className="cursor-pointer hover:fill-[#82a8cd] transition-colors edit-camera-element"
                                    onClick={() => setActiveEditComponent("camera")}
                                    onMouseOver={() => {
                                      const elements = document.getElementsByClassName('edit-camera-element');
                                      Array.from(elements).forEach(el => el.classList.add('fill-[#82a8cd]'));
                                      const tooltip = document.getElementById('edit-component-tooltip');
                                      if (tooltip) {
                                        tooltip.textContent = 'Kamera';
                                        tooltip.style.opacity = '1';
                                      }
                                    }}
                                    onMouseOut={() => {
                                      const elements = document.getElementsByClassName('edit-camera-element');
                                      Array.from(elements).forEach(el => el.classList.remove('fill-[#82a8cd]'));
                                    }}
                                  />

                                  {/* Labels */}
                                  <text x="150" y="125" textAnchor="middle" className="text-xs fill-foreground">Frame</text>
                                  <text x="80" y="50" textAnchor="middle" className="text-xs fill-foreground">Motor</text>
                                  <text x="200" y="155" textAnchor="middle" className="text-xs fill-foreground">ESC/FC</text>
                                  <text x="150" y="220" textAnchor="middle" className="text-xs fill-foreground">Akku</text>
                                  <text x="147" y="70" textAnchor="middle" className="text-xs fill-foreground">Kamera</text>
                                </svg>
                              </div>

                              {/* Ausgewählte Komponenten */}
                              <div className="mt-4 space-y-2">
                                {Object.entries(editingComponents).map(([type, component]) => (
                                  <div key={type} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <div className="flex items-center">
                                      <Image src={component.imageurl} alt={component.name} width={40} height={40} className="w-10 h-10 rounded object-cover mr-3" />
                                      <div>
                                        <p className="font-medium text-sm">{component.name}</p>
                                        <p className="text-xs text-gray-600 capitalize">{type}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-sm">CHF {component.price.toFixed(2)}</span>
                                      <Button size="sm" variant="ghost" onClick={() => handleEditComponentRemove(type)}>
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Komponenten Auswahl - Rechte Seite */}
                            <div>
                              <h3 className="text-lg font-semibold mb-4">
                                {activeEditComponent ? `${activeEditComponent.charAt(0).toUpperCase() + activeEditComponent.slice(1)} auswählen` : 'Klicken Sie auf eine Komponente links, um sie zu ändern'}
                              </h3>

                              {activeEditComponent && (
                                <div className="space-y-4">
                                  {/* Filter */}
                                  {(() => {
                                    const { keys, optionsByKey } = getEditOptionKeysAndValues();
                                    return keys.length > 0 && (
                                      <div className="flex gap-4 mb-4 flex-wrap flex-col md:flex-row">
                                        {keys.map((key) => (
                                          <Select key={key} value={filters[key] || "all"} onValueChange={(value) => setFilters(prev => ({ ...prev, [key]: value === "all" ? "" : value }))}>
                                            <SelectTrigger className="w-40">
                                              <SelectValue placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)} wählen`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="all">Alle {key}</SelectItem>
                                              {optionsByKey[key].map((option) => (
                                                <SelectItem key={option} value={option}>{option}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        ))}
                                      </div>
                                    );
                                  })()}

                                  {/* Komponenten Liste */}
                                  <div className="max-h-96 overflow-y-auto space-y-3">
                                    {getEditFilteredComponents()?.map((component, index) => (
                                      <Card key={component.id} className={`cursor-pointer transition-all hover:shadow-md ${editingComponents[activeEditComponent]?.id === component.id ? 'ring-2 ring-blue-500' : ''}`} onClick={() => handleEditComponentSelect(activeEditComponent, component)}>
                                        <CardContent className="p-4">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                              <Image src={component.imageurl} alt={component.name} width={60} height={60} className="w-15 h-15 rounded-lg mr-4 object-cover" />
                                              <div>
                                                <h4 className="font-medium">{component.name}</h4>
                                                <p className="text-sm text-gray-600">{component.shop}</p>
                                                {component.options && (
                                                  <div className="flex flex-wrap gap-1 mt-1">
                                                    {component.options.map((option, optIndex) => (
                                                      <Badge key={optIndex} variant="outline" className="text-xs">
                                                        {Object.entries(option).map(([key, value]) => `${key}: ${value}`).join(', ')}
                                                      </Badge>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                            <div className="text-right">
                                              <p className="font-bold text-lg">CHF {component.price.toFixed(2)}</p>
                                              <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); openShop(e, component.link); }}>
                                                <ShoppingCart className="h-3 w-3 mr-1" />
                                                Shop
                                              </Button>
                                            </div>
                                          </div>
                                          {component.description && (
                                            <div className="mt-3">
                                              <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); toggleDescription(index); }}>
                                                {expandedDescriptions[index] ? 'Weniger anzeigen' : 'Beschreibung anzeigen'}
                                              </Button>
                                              {expandedDescriptions[index] && (
                                                <p className="text-sm text-gray-600 mt-2">{component.description}</p>
                                              )}
                                            </div>
                                          )}
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {!activeEditComponent && (
                                <div className="text-center py-8 text-gray-500">
                                  <p>Klicken Sie auf eine Komponente im Drone-Diagramm links, um sie zu ändern.</p>
                                  <p className="text-sm mt-2">Komponenten die bereits ausgewählt sind werden grün angezeigt.</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                            <DialogClose asChild>
                              <Button variant="outline" onClick={(e) => {
                                e.stopPropagation();
                                setEditBuild(null);
                              }}>
                                Abbrechen
                              </Button>
                            </DialogClose>
                            <Button onClick={saveEditedBuild}>
                              Build speichern
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteBuild(build.build_id)}}
                      >
                        <Trash className="h-3 w-3 mr-1" />
                        Löschen
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <div className="space-y-3">
                    {getComponentsFromBuild(build).map((component) => (
                      <div
                        key={`${build.build_id}-${component.type}`}
                        className="flex flex-col lg:flex-row items-center justify-between p-3 border rounded-lg group hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <Image
                            src={component.imageurl}
                            alt={component.name}
                            width={80}
                            height={80}
                            className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg mb-2 lg:mb-0 lg:mr-4 shrink-0 object-cover"
                          />
                          <div className="text-center lg:text-left">
                            <h4 className="font-medium text-sm group-hover:text-black">{component.name}</h4>
                            <p className="text-xs text-gray-600">{component.shop}</p>
                            <p className="text-xs text-gray-500 capitalize">{component.type}</p>
                          </div>
                        </div>
                        <div className="text-right mt-2 lg:mt-0 flex items-center gap-2">
                          <p className="font-bold text-sm group-hover:text-black">CHF {component.price.toFixed(2)}</p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              openShop(e, component.link);
                            }}
                            className="shrink-0"
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Shop
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        );
      })}
    </div>
  )
}

export default Builds