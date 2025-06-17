import React from 'react'

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

const AddComponent = () => {
  const componentGroup = ["frame", "motors", "esc", "fc", "props", "battery", "camera"]

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
          <Label className='text-white'>Marke:</Label>
          <Input required onChange={null}/>
          {(<p className='text-[#d9534f]'>Bitte geben sie einen Benutzernamen ein</p>) }
        </div>
        <div className='my-2 relative'>
          <Label className='text-white'>Passwort:</Label>
          <Input type="text" required onChange={null}/>
          {(<p className='text-[#d9534f]'>Bitte geben sie ein Passwort ein</p>) }
        </div>
        <Button className='w-full mt-4' type='submit'>Login</Button>
      </form>
    </div>
  )
}

export default AddComponent
