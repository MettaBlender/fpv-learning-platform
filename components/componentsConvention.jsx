import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

const convention =  [
  {
    name: 'Frames',
    convention: [
      'Grösse',
      'Marke',
      "Stack-grösse"
    ]
  },
  {
    name: 'Motors',
    convention: []
  },
  {
    name: 'Flight Controller',
    convention: []
  },
  {
    name: 'ESC',
    convention: []
  },
  {
    name: 'Props',
    convention: []
  },
  {
    name: 'Batteries',
    convention: []
  },
  {
    name: 'Cameras',
    convention: []
  },
]

const ComponentsConvention = () => {
  return (
    <div className='w-full'>
      <h1 className='mb-2'>Die Komponeten sollten folgende Optionen enthalten:</h1>
       <div className='w-full flex flex-wrap justify-around items-start mb-4'>
        {convention.map((component) => (
          <Card key={component.name} className="w-[23dvw] h-[23dvw] flex flex-col mb-2">
            <CardHeader>
              <CardTitle>{component.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className='list-disc pl-4'>
                {component.convention.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ComponentsConvention