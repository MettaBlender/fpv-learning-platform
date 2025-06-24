"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ComponentFrom from "@/components/componentForm"
import ComponentsConvention from "@/components/componentsConvention" // Assuming this is a component for conventions
import Scrapper from "@/components/Scrapper" // Assuming this is a component for scrapping data
import Allcomponents from "@/components/AllComponents" // Assuming this is a component for displaying all components

const Panel = () => {

  const [tabsValue, setTabsValue] = useState("components")

  useEffect(() => {
    setTabsValue(localStorage.getItem("panelTab") || "components")

  }, [])


  const changeTabsValue = (value) => {
    setTabsValue(value)
    localStorage.setItem("panelTab", value)
  }

  return (
    <div className="w-full">
      <Tabs value={tabsValue} onValueChange={changeTabsValue}>
        <TabsList>
          <TabsTrigger value="components">Alle Komponenten</TabsTrigger>
          <TabsTrigger value="add">Komponenten hinzufügen</TabsTrigger>
          <TabsTrigger value="convention">Komponenten Option vorlagen</TabsTrigger>
          <TabsTrigger value="scrapper">Komponenten Scrapper</TabsTrigger>
        </TabsList>
        <TabsContent value="components">
          <Allcomponents/>
        </TabsContent>
        <TabsContent value="add">
          <ComponentFrom />
        </TabsContent>
        <TabsContent value="convention">
          <ComponentsConvention />
        </TabsContent>
        <TabsContent value="scrapper">
          <Scrapper />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Panel
