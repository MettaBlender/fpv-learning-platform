import React, {useState} from 'react'

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
import { title } from 'process';
import { Textarea } from './ui/textarea';
import Image from 'next/image';
import { toast } from 'sonner';

const AddComponent = () => {
  const componentGroup = ["frame", "motors", "esc", "fc", "props", "battery", "camera"]
  const shops = ["Fpvracing", "FPVFrame", "Dronefactory", "FPV24", "Quadmula"]

  const [component, setComponent] = useState({component: "frame", title: "", description: "", price: "", shop: "", link: "", imageUrl: "", options: {}})
  const [hasError, setHasError] = useState(false);

  const handleAddComponent = async (e) => {
    e.preventDefault();
    if (component.title.trim() === "" || component.description.trim() === "" || component.price <= 0 || component.shop.trim() === "" || component.link.trim() === "" || component.imageUrl.trim() === "") {
      toast.error("Bitte füllen Sie alle Felder korrekt aus.");
      return;
    }

    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(component),
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
    setComponent(prev => ({ ...prev, component: value }));
    switch (value) {
      case "frame":
        setComponent(prev => ({
          ...prev,
          options: {
            frameSize: "",
            frameType: "",
            frameMaterial: ""
          }
        }));
        break;
      case "motors":
        setComponent(prev => ({
          ...prev,
          options: {
            motorSize: "",
            motorKV: "",
            motorType: ""
          }
        }));
        break;
      case "esc":
        setComponent(prev => ({
          ...prev,
          options: {
            escSize: "",
            escType: "",
            escAmperage: ""
          }
        }));
        break;
      case "fc":
        setComponent(prev => ({
          ...prev,
          options: {
            fcType: "",
            fcSize: "",
            fcFeatures: ""
          }
        }));
        break;
      case "props":
        setComponent(prev => ({
          ...prev,
          options: {
            propSize: "",
            propMaterial: "",
            propType: ""
          }
        }));
        break;
      case "battery":
        setComponent(prev => ({
          ...prev,
          options: {
            batterySize: "",
            batteryType: "",
            batteryCapacity: ""
          }
        }));
        break;
      case "camera":
        setComponent(prev => ({
          ...prev,
          options: {
            cameraType: "",
            cameraResolution: "",
            cameraFeatures: ""
          }
        }));
        break;
      default:
        break;
    }
  }

  return (
    <div className='w-full px-[30%] pt-1'>
      <form className='w-full' onSubmit={handleAddComponent}>
        <h1 className='text-4xl font-bold text-white'>Komponent Hinzufügen</h1>
        <div>
          <Label className='text-white'>Wählen Sie eine Komponente aus: *</Label>
          <Select
            onValueChange={handleComponentChange}
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
          <Label className='text-white'>Titel: *</Label>
          <Input placeholder="Komponent Titel" onChange={(e) => setComponent(prev => ({ ...prev, title: e.target.value }))} value={component.title}/>
          {component.title.trimEnd() === "" && (<p className='text-[#d9534f]'>Bitte geben sie einen Titel ein</p>) }
        </div>
        <div className='my-2 relative'>
          <Label className='text-white'>Beschreibung: *</Label>
          <Textarea placeholder='Komponente Beschreibung' onChange={(e) => setComponent(prev => ({ ...prev, description: e.target.value }))} value={component.description}/>
          {component.description.trimEnd() === "" && (<p className='text-[#d9534f]'>Bitte geben sie eine Beschreibung ein</p>) }
        </div>
        <div className='my-2 relative'>
          <Label className='text-white'>Preis: *</Label>
          <Input type="number" min="0" onChange={(e) => setComponent(prev => ({ ...prev, price: e.target.value }))} value={component.price}/>
          {component.price == 0 && (<p className='text-[#d9534f]'>Bitte geben sie einen Preis ein</p>) }
          {component.price < 0 && (<p className='text-[#d9534f]'>Preis muss grösser als 0 sein</p>) }
        </div>
        <div className='my-2 relative'>
          <Label className='text-white'>Shop: *</Label>
          <Select
            onValueChange={(value) => {
              setComponent((prev) => ({...prev, shop: value}));
            }}
          >
            <SelectTrigger className="w-full p-2 border rounded-md mt-2">
              <SelectValue placeholder="-- Bitte wählen --" />
            </SelectTrigger>
            <SelectContent>
              {shops.map((shop, index) => (
                <SelectItem key={index} value={shop}>
                  {shop}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {component.shop.trimEnd() === "" && (<p className='text-[#d9534f]'>Bitte geben sie einen Shop ein</p>) }
        </div>
        <div className='my-2 relative'>
          <Label className='text-white'>Link zum Produkt: *</Label>
          <Input type="text" value={component.link} onChange={(e) => setComponent(prev => ({...prev, link: e.target.value}))}/>
          {component.link.trimEnd() === "" && (<p className='text-[#d9534f]'>Bitte geben sie einen Link zum Produkt ein</p>) }
        </div>
        <div className='my-2 relative'>
          <Label className='text-white'>Bild url: *</Label>
          <Input type="text" onChange={(e) => setComponent(prev => ({ ...prev, imageUrl: e.target.value }))} value={component.imageUrl}/>
          {component.imageUrl.trimEnd() === "" && (<p className='text-[#d9534f]'>Bitte geben sie ein Bild url ein ein</p>) }
          {component.imageUrl.trimEnd() !== "" && (
            <Image
              src={hasError ? "/img_not_found.png" : component.imageUrl}
              alt="Bild vorschau"
              width={1000}
              height={1000}
              className='w-[50%] mx-auto h-fit mt-4 rounded-md'
              onError={() => setHasError(true)}
              onLoadingComplete={() => setHasError(false)}/>
          )}
        </div>
        <div className='my-2 relative'>
          <Label className='text-white'>Optionen: *</Label>
          {component.options && Object.keys(component.options).length > 0 ? (
            Object.entries(component.options).map(([key, value]) => (
              <div key={key}>
                <div className="my-2 relative flex items-center gap-2">
                  <Label className="text-white w-25">{key}</Label>
                  <Input
                    type="text"
                    value={value || ''} // Wert der Option (nicht component.options.option)
                    onChange={(e) =>
                      setComponent((prev) => ({
                        ...prev,
                        options: {
                          ...prev.options,
                          [key]: e.target.value, // Aktualisiere den Wert für den spezifischen Schlüssel
                        },
                      }))
                    }
                    className="p-2"
                  />
                </div>
                {value.trimEnd() === '' && (
                  <p className="text-[#d9534f] ml-25">Bitte geben Sie einen Wert ein</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400">Keine Optionen hinzugefügt</p>
          )}
        </div>
        <Button className='w-full mt-4' type='submit'>Kompnent hinzufügen</Button>
      </form>
    </div>
  )
}

export default AddComponent
