import React, {useState, useEffect} from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { name } from 'process';
import { Textarea } from './ui/textarea';
import Image from 'next/image';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

const UpdateComponent = ({componentProps = {}, update = false}) => {
  const componentGroup = ["frame", "motors", "esc", "fc", "props", "battery", "camera"]
  const shops = ["Fpvracing", "FPVFrame", "Dronefactory", "FPV24", "Quadmula"]

  const [component, setComponent] = useState({
    component: componentProps.component || "frame",
    name: componentProps.name || "",
    description: componentProps.description || "",
    price: componentProps.price || "",
    shop: componentProps.shop || "",
    link: componentProps.link || "",
    imageurl: componentProps.imageurl || componentProps.imageUrl ||  "",
    options: componentProps.options || {}
  })
  const [hasError, setHasError] = useState(false);

  const [options, setOptions] = useState([
    {frame: [["grösse", "", 1], ["marke", "", 2]]},
    {motors: [["grösse", "", 1], ["marke", "", 2], ["anzahl", "0", 3], ["props", "", 4], ["serials", "", 5], ["kv", "", 6]]},
    {esc: [["grösse", "", 1], ["marke", "", 2]]},
    {fc: [["grösse", "", 1], ["marke", "", 2]]},
    {props: [["grösse", "", 1], ["marke", "", 2]]},
    {battery: [["c-rate", "", 1], ["marke", "", 2]]},
    {camera: [["marke", "", 1]]
  }]);

  useEffect(() => {
    const sesssionComponent = sessionStorage.getItem('component')
      ? JSON.parse(sessionStorage.getItem('component'))
      : null;
    if (sesssionComponent && !update) {
      console.log("Session Component:", sesssionComponent);
      setComponent(sesssionComponent);
      console.log("Component from sessionStorage:", component);
    } else if (componentProps && Object.keys(componentProps).length > 0) {
      // Initialize with props if no session data
      setComponent({
        component: componentProps.component || "frame",
        name: componentProps.name || "",
        description: componentProps.description || "",
        price: componentProps.price || "",
        shop: componentProps.shop || "",
        link: componentProps.link || "",
        imageurl: componentProps.imageurl || "",
        options: componentProps.options || {}
      });
    }
  }, [componentProps]);

   useEffect(() => {
    if (!(component.name === "" && component.description === "" && component.price == "" && component.shop === "" && component.link === "" && component.imageurl === "")) {
      console.log("Component updated:", component);
      // Speichere den aktuellen Zustand in sessionStorage
      sessionStorage.setItem('component', JSON.stringify(component).toString());
    }
  }, [component]);

  useEffect(() => {
    if (!component.type) return;

    const selectedOptions = options.find((opt) => opt[component.type]);
    if (selectedOptions && !component.options) {
      // Convert array structure [key, value, id] to object with IDs
      const optionsWithIds = {};
      selectedOptions[component.type].forEach(([key, value, id]) => {
        optionsWithIds[key] = { value, id };
      });
      setComponent((prev) => ({
        ...prev,
        options: optionsWithIds,
      }));
    }
  }, [component.type, component.options, options, setComponent]);

  const mapOptionsToArray = (optionsObj) => {
    return Object.entries(optionsObj).map(([key, { value }]) => ({ [key]: value }));
  };

  const handleAddComponent = async (e) => {
    e.preventDefault();
    if ((component.name || "").trim() === "" || (component.description || "").trim() === "" || component.price <= 0 || (component.shop || "").trim() === "" || (component.link || "").trim() === "" || (component.imageurl || "").trim() === "") {
      toast.error("Bitte füllen Sie alle Felder korrekt aus.");
      return;
    }

    let shipComponent = {...component};

    if (component.options) {
      shipComponent = {...component, options: mapOptionsToArray(component.options) };
    }

    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shipComponent),
      });

      if (!response.ok) {
        toast.error('Fehler beim Hinzufügen der Komponente');
        return;
      }

      const data = await response.json();
      console.log('Komponente erfolgreich hinzugefügt:', data);
      toast.success("Komponente erfolgreich hinzugefügt");
    } catch (error) {
      console.error('Fehler:', error);
      toast.error("Fehler beim Hinzufügen der Komponente");
    }
  }

  const handleComponentChange = (value) => {
    setComponent(prev => ({ ...prev, component: value }))
    const selectedOptions = options.find((opt) => opt[value]);
    const optionsWithIds = {};
    selectedOptions[value].forEach(([key, val, id]) => {
      optionsWithIds[key] = { value: val, id };
    });
    setComponent((prev) => ({
      ...prev,
      type: value,
      options: optionsWithIds,
    }));
  }


  // Aktualisiere options-Array basierend auf Änderungen in component.options
  const updateOptionsArray = (updatedOptions) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt[component.type]
          ? {
              [component.type]: Object.entries(updatedOptions).map(([key, obj]) => [
                key,
                obj.value,
                obj.id
              ])
            }
          : opt
      )
    );
  };

  const handleAddOption = () => {
    // Generate new ID based on existing options
    const existingIds = Object.values(component.options || {}).map(opt => opt.id);
    const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

    const updatedOptions = {
      ...component.options,
      [""]: { value: "", id: newId },
    };
    setComponent((prev) => ({
      ...prev,
      options: updatedOptions,
    }));
    updateOptionsArray(updatedOptions);
  };

  const handleRemoveOption = (key) => {
    const updatedOptions = { ...component.options };
    delete updatedOptions[key];
    setComponent((prev) => ({
      ...prev,
      options: updatedOptions,
    }));
    updateOptionsArray(updatedOptions);
  };

  const handleUpdateOption = (key, newValue) => {
    const updatedOptions = {
      ...component.options,
      [key]: { ...component.options[key], value: newValue },
    };
    setComponent((prev) => ({
      ...prev,
      options: updatedOptions,
    }));
    updateOptionsArray(updatedOptions);
  };

  const handleUpdateKey = (oldKey, newKey) => {
    // if (newKey.trim() === '') {
    //   toast.error('Der neue Schlüssel darf nicht leer sein.');
    //   return;
    // }
    if (component.options[newKey]) {
      toast.error('Dieser Schlüssel existiert bereits.');
      return;
    }

    const updatedOptions = { ...component.options };
    const optionData = updatedOptions[oldKey]; // Komplettes Objekt mit value und id
    delete updatedOptions[oldKey];
    updatedOptions[newKey] = optionData;

    setComponent((prev) => ({
      ...prev,
      options: updatedOptions,
    }));
    updateOptionsArray(updatedOptions);
  };

  return (
    <div className={`w-full ${!update ? 'px-[30%]' : ''} pt-1`}>
      <form className='w-full' onSubmit={handleAddComponent}>
        <h1 className='text-4xl font-bold text-white'>Komponent {!update ? 'Hinzufügen' : 'Bearbeiten'}</h1>
        <div>
          <Label className='text-white'>Wählen Sie eine Komponente aus: <span className={`${component.component === "" ? 'text-[#d9534f]' : 'text-[#8ccd82]'}`}>*</span></Label>
          <Select
            key={component.component}
            onValueChange={handleComponentChange}
            value={component.component || ''} // Fallback auf leeren String
          >
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
        <div className='my-2'>
          <Label className='text-white'>Titel: <span className={`${(component.name || "") === "" ? 'text-[#d9534f]' : 'text-[#8ccd82]'}`}>*</span></Label>
          <Input placeholder="Komponent Titel" onChange={(e) => setComponent(prev => ({ ...prev, name: e.target.value }))} value={component.name || ""}/>
          {(component.name || "").trimEnd() === "" && (<p className='text-[#d9534f]'>Bitte geben sie einen Titel ein</p>) }
        </div>
        <div className='my-2 relative'>
          <Label className='text-white'>Beschreibung: <span className={`${(component.description || "") === "" ? 'text-[#d9534f]' : 'text-[#8ccd82]'}`}>*</span></Label>
          <Textarea placeholder='Komponente Beschreibung' onChange={(e) => setComponent(prev => ({ ...prev, description: e.target.value }))} value={component.description || ""}/>
          {(component.description || "").trimEnd() === "" && (<p className='text-[#d9534f]'>Bitte geben sie eine Beschreibung ein</p>) }
        </div>
        <div className='my-2 relative'>
          <Label className='text-white'>Preis: <span className={`${component.price == 0 || component.price < 0 ? 'text-[#d9534f]' : 'text-[#8ccd82]'}`}>*</span></Label>
          <Input type="number" min="0" step="0.05" onChange={(e) => setComponent(prev => ({ ...prev, price: e.target.value }))} value={component.price || ""}/>
          {(component.price || 0) == 0 && (<p className='text-[#d9534f]'>Bitte geben sie einen Preis ein</p>) }
          {(component.price || 0) < 0 && (<p className='text-[#d9534f]'>Preis muss grösser als 0 sein</p>) }
        </div>
        <div className='my-2 relative'>
          <Label className='text-white'>Shop: <span className={`${(component.shop || "") === "" ? 'text-[#d9534f]' : 'text-[#8ccd82]'}`}>*</span></Label>
          <Select
            key={component.shop}
            onValueChange={(value) => {
              setComponent((prev) => ({ ...prev, shop: value }));
            }}
            value={component.shop || ''}
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
          {(component.shop || "").trimEnd() === "" && (<p className='text-[#d9534f]'>Bitte geben sie einen Shop ein</p>) }
        </div>
        <div className='my-2 relative'>
          <Label className='text-white'>Link zum Produkt: <span className={`${(component.link || "") === "" ? 'text-[#d9534f]' : 'text-[#8ccd82]'}`}>*</span></Label>
          <Input type="text" value={component.link || ""} onChange={(e) => setComponent(prev => ({...prev, link: e.target.value}))}/>
          {(component.link || "").trimEnd() === "" && (<p className='text-[#d9534f]'>Bitte geben sie einen Link zum Produkt ein</p>) }
        </div>
        <div className='my-2 relative'>
          <Label className='text-white'>Bild url: <span className={`${(component.imageurl || "") === "" ? 'text-[#d9534f]' : 'text-[#8ccd82]'}`}>*</span></Label>
          <Input type="text" onChange={(e) => setComponent(prev => ({ ...prev, imageurl: e.target.value }))} value={component.imageurl || ""}/>
          {(component.imageurl || "").trimEnd() === "" && (<p className='text-[#d9534f]'>Bitte geben sie ein Bild url ein ein</p>) }
          {(component.imageurl || "").trimEnd() !== "" && (
            <Image
              src={hasError ? "/img_not_found.png" : component.imageurl}
              alt="Bild vorschau"
              width={1000}
              height={1000}
              className='w-[50%] mx-auto h-fit mt-4 rounded-md'
              onError={() => setHasError(true)}
              onLoadingComplete={() => setHasError(false)}/>
          )}
        </div>
        <div className="my-2 relative">
          <Label className="text-white">Optionen: </Label>
          {component.component && (
            <div className="flex gap-2 my-2">
              <Button type='button' onClick={handleAddOption}>Option Hinzufügen</Button>
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
                      value={key || ''}
                      onChange={(e) => handleUpdateKey(key, e.target.value)}
                      className="p-2 bg-gray-800 text-white border-gray-600 rounded-md"
                    />
                    <Input
                      type="text"
                      value={optionData.value || ''}
                      onChange={(e) => handleUpdateOption(key, e.target.value)}
                      className="p-2 bg-gray-800 text-white border-gray-600 rounded-md"
                    />
                    {/* <span className="text-white text-sm">ID: {optionData.id}</span> */}
                    <Button variant="destructive" onClick={() => handleRemoveOption(key)}>
                      <Trash2/>
                    </Button>
                  </div>
                  {(optionData.value || "").trimEnd() === '' && (
                    <p className="text-[#d9534f] ml-25">Bitte geben Sie einen Wert ein</p>
                  )}
                </div>
              ))}
            </div>
          ) : component.type ? (
            <p className="text-gray-400">Keine Optionen hinzugefügt</p>
          ) : null}
          </div>
        <Button className='w-full mt-4' type='submit' disabled={(component.component || "") === "" || (component.name || "").trim() === "" || (component.description || "").trim() === "" || (component.price || 0) <= 0 || (component.shop || "").trim() === "" || (component.link || "").trim() === "" || (component.imageurl || "").trim() === ""}>Kompnent hinzufügen</Button>
      </form>
    </div>
  )
}

export default UpdateComponent
