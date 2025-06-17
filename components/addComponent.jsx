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

const AddComponent = () => {
  const componentGroup = ["frame", "motors", "esc", "fc", "props", "battery", "camera"]
  const shops = [
    {id: 1, name: "Fpvracing", link: "https://fpvracing.ch"},
    {id: 2, name: "FPVFrame", link: "https://fpvframe.ch"},
    {id: 3, name: "Dronefactory", link: "https://dronefactory.ch"},
    {id: 4, name: "FPV24", link: "https://www.fpv24.com/de"},
    {id: 5, name: "Quadmula", link: "https://quadmula.com/"}, ]

  const [component, setComponent] = useState({component: "frame", title: "", description: "", price: "", shop: "", link: "", imageUrl: ""})
  const [hasError, setHasError] = useState(false);

  return (
    <div className='w-full px-[30%] pt-1'>
      <form className='w-full' onSubmit={null}>
        <h1 className='text-4xl font-bold text-white'>Komponent Hinzufügen</h1>
        <div>
          <Label className='text-white'>Wählen Sie eine Komponente aus:</Label>
          <Select
            onValueChange={(value) => setComponent(prev => ({ ...prev, title: value }))}
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
          <Label className='text-white'>Titel:</Label>
          <Input required placeholder="Komponent Titel" onChange={(e) => setComponent(prev => ({ ...prev, title: e.target.value }))} value={component.title}/>
          {component.title.trimEnd() === "" && (<p className='text-[#d9534f]'>Bitte geben sie einen Titel ein</p>) }
        </div>
        <div className='my-2 relative'>
          <Label className='text-white'>Beschreibung:</Label>
          <Textarea placeholder='Komponente Beschreibung' onChange={(e) => setComponent(prev => ({ ...prev, description: e.target.value }))} value={component.description}/>
          {component.description.trimEnd() === "" && (<p className='text-[#d9534f]'>Bitte geben sie eine Beschreibung ein</p>) }
        </div>
        <div className='my-2 relative'>
          <Label className='text-white'>Preis:</Label>
          <Input type="number" min="0" required onChange={(e) => setComponent(prev => ({ ...prev, price: e.target.value }))} value={component.price}/>
          {component.price == 0 && (<p className='text-[#d9534f]'>Bitte geben sie einen Preis ein</p>) }
          {component.price < 0 && (<p className='text-[#d9534f]'>Preis muss grösser als 0 sein</p>) }
        </div>
        <div className='my-2 relative'>
          <Label className='text-white'>Shop:</Label>
          <Select
            onValueChange={(value) => {
              const selectedShop = shops.find((shop) => shop.id.toString() === value);
              setComponent((prev) => ({
                ...prev,
                shop: selectedShop?.name || '',
                link: selectedShop?.link || '',
              }));
            }}
          >
            <SelectTrigger className="w-full p-2 border rounded-md mt-2">
              <SelectValue placeholder="-- Bitte wählen --" />
            </SelectTrigger>
            <SelectContent>
              {shops.map((shop) => (
                <SelectItem key={shop.id} value={shop.id.toString()}>
                  {shop.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {component.shop.trimEnd() === "" && (<p className='text-[#d9534f]'>Bitte geben sie einen Shop ein</p>) }
        </div>
        <div className='my-2 relative'>
          <Label className='text-white'>Link zum Shop:</Label>
          <Input type="text" readOnly value={component.link}/>
        </div>
        <div className='my-2 relative'>
          <Label className='text-white'>Bild url:</Label>
          <Input type="text" required onChange={(e) => setComponent(prev => ({ ...prev, imageUrl: e.target.value }))} value={component.imageUrl}/>
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
        <Button className='w-full mt-4' type='submit'>Login</Button>
      </form>
    </div>
  )
}

export default AddComponent
