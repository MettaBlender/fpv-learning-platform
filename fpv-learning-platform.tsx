"use client"

import React, { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Googles from "@/components/tabs/googles"
import Controller from "@/components/tabs/controller"
import Components from "@/components/tabs/components"
import Builder from "@/components/tabs/builder"
import Tutorial from "@/components/tabs/tutorials"

export default function Component() {

  const [getTab, setGetTab] = useState('googles');

  useEffect(() => {
    // Prüfe, ob localStorage verfügbar ist (Browser-Umgebung)
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTab = localStorage.getItem('selectedTab');
      if (savedTab) {
        setGetTab(savedTab); // Setze gespeicherten Tab-Wert
      }
    }
  }, []);

  // Funktion zum Speichern des ausgewählten Tabs im Local Storage
  const changeTab = (value: string) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('selectedTab', value);
    }
    setGetTab(value); // Aktualisiere den State
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex flex-row-reverse justify-center items-center gap-4 mb-2">
            <h1 className="text-4xl font-bold text-gray-900">FPV Drohnen Lernplattform</h1>
            <Image
              src="/logo.png"
              alt="DJI FPV Remote Controller 3"
              width={200}
              height={200
              }
              className="h-[5rem] w-auto rounded-lg"
            />
          </div>
          <p className="text-xl text-gray-600">Alles was du über FPV-Drohnen wissen musst</p>
        </div>

        <Tabs defaultValue={getTab} className="w-full h-fit" onValueChange={(value) => changeTab(value)}>
          <TabsList className="grid w-full md:grid-cols-5 mb-8 h-fit">
            <TabsTrigger value="goggles">DJI Goggles</TabsTrigger>
            <TabsTrigger value="controller">RC Controller</TabsTrigger>
            <TabsTrigger value="components">Komponenten</TabsTrigger>
            <TabsTrigger value="builder">Drohnen Builder</TabsTrigger>
            <TabsTrigger value="tutorial">Weitere Tutorials</TabsTrigger>
          </TabsList>

          {/* Section 1: DJI Goggles */}
          <TabsContent value="goggles" className="space-y-6">
              <Googles />
          </TabsContent>

          {/* Section 2: RC Controller */}
          <TabsContent value="controller" className="space-y-6">
              <Controller />
          </TabsContent>

          {/* Section 3: Komponenten */}
          <TabsContent value="components" className="space-y-6">
              <Components/>
          </TabsContent>

          {/* Section 4: Drohnen Builder */}
          <TabsContent value="builder" className="space-y-6">
              <Builder/>
          </TabsContent>

          {/* Section 5: Weitere Tutorials */}
          <TabsContent value="tutorial" className="space-y-6">
              <Tutorial/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}