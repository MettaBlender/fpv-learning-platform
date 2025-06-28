import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

const convention =  [
  {
    name: 'Frames',
    convention: [
      'Grösse',
      'Marke',
      "stack-size",
      'motor-mounting-size',
    ]
  },
  {
    name: 'Motors',
    convention: [
      'motor-mounting-size',
      'marke',
      'anzahl',
      'props-size',
      'serials',
      'kv: 2400',
    ]
  },
  {
    name: 'Fligt Controller',
    convention: [
      'stack-size',
      'marke'
    ]
  },
  {
    name: 'ESC',
    convention: [
      'stack-size',
      'marke'
    ]
  },
  {
    name: 'Props',
    convention: [
      'marke',
      'props-size',
      'blätter',
      'pitch',
      'anzahl',
      'drehrichtung',
    ]
  },
  {
    name: 'Batteries',
    convention: [
      'C-Rate',
      'Marke'
    ]
  },
  {
    name: 'Cameras',
    convention: [
      'Marke',
    ]
  },
]

const ComponentsConvention = () => {
  return (
    <div className='w-full'>
      <h1 className='mb-2'>Die Komponeten sollten folgende Optionen enthalten:</h1>
       <div className='w-full flex flex-col md:flex-row flex-wrap justify-around items-start mb-4'>
        {convention.map((component) => (
          <Card key={component.name} className="w-full md:w-[23dvw] h-auto md:h-[23dvw] aspect-square md:aspect-auto flex flex-col mb-2">
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