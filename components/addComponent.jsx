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

const AddComponent = () => {
  const componentGroup = ["frame", "motors", "esc", "fc", "props", "battery", "camera"]

  const [component, setComponent] = useState({title: "", description: "", price: "", shop: "", link: "", imageUrl: ""})

  return (
    <div className='w-full px-[30%] pt-1'>
      <form className='w-full' onSubmit={null}>
        <h1 className='text-4xl font-bold text-white'>Komponent Hinzufügen</h1>
        <div>
          <Label className='text-white'>Wählen Sie eine Komponente aus:</Label>
          <Select
            onValueChange={null}
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
          {(<p className='text-[#d9534f]'>Bitte geben sie einen Benutzernamen ein</p>) }
        </div>
        <div className='my-2 relative'>
          <Label className='text-white'>Beschreibung:</Label>
          <Textarea placeholder='Komponente Beschreibung' onChange={(e) => setComponent(prev => ({ ...prev, description: e.target.value }))} value={component.description}/>
          {(<p className='text-[#d9534f]'>Bitte geben sie ein Passwort ein</p>) }
        </div>
        <div className='my-2 relative'>
          <Label className='text-white'>Preis:</Label>
          <Input type="number" required onChange={(e) => setComponent(prev => ({ ...prev, price: e.target.value }))} value={component.price}/>
          {(<p className='text-[#d9534f]'>Bitte geben sie ein Passwort ein</p>) }
        </div>
        <div className='my-2 relative'>
          <Label className='text-white'>Shop:</Label>
          <Input type="text" required onChange={(e) => setComponent(prev => ({ ...prev, shop: e.target.value }))} value={component.shop}/>
          {(<p className='text-[#d9534f]'>Bitte geben sie ein Passwort ein</p>) }
        </div>
        <div className='my-2 relative'>
          <Label className='text-white'>Link zum Shop:</Label>
          <Input type="text" required onChange={(e) => setComponent(prev => ({ ...prev, link: e.target.value }))} value={component.link}/>
          {(<p className='text-[#d9534f]'>Bitte geben sie ein Passwort ein</p>) }
        </div>
        <div className='my-2 relative'>
          <Label className='text-white'>Bild url:</Label>
          <Input type="text" required onChange={(e) => setComponent(prev => ({ ...prev, imageUrl: e.target.value }))} value={component.imageUrl}/>
          {(<p className='text-[#d9534f]'>Bitte geben sie ein Passwort ein</p>) }
        </div>
        <Button className='w-full mt-4' type='submit'>Login</Button>
      </form>
    </div>
  )
}

export default AddComponent
