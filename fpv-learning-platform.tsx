"use client"

import React, { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Googles from "@/components/tabs/googles"
import Controller from "@/components/tabs/controller"
import Components from "@/components/tabs/components"
import Builder from "@/components/tabs/builder"
import Tutorial from "@/components/tabs/tutorials"
import Login from "@/components/tabs/login"
import Panel from "@/components/tabs/panel"
import { Button } from "./components/ui/button"
import { decodeUserSession } from "./lib/session"

export default function Component() {
  const [selectedTab, setSelectedTab] = useState('goggles')
  const [session, setSession] = useState<any>(null)

  // Load saved tab from localStorage on component mount
  useEffect(() => {
    const savedTab = localStorage.getItem('selectedTab')
    if (savedTab) {
      setSelectedTab(savedTab)
    }

    const getSession = async () => {
      const sessionkey = sessionStorage.getItem("session")
      const sessionvalue = await decodeUserSession(sessionkey || "")
      setSession(sessionvalue === 0 ? true : false)
    }

    getSession()

  }, [])

  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Funktion zum Speichern des ausgewählten Tabs im Local Storage
  const changeTab = (value: string) => {
    setSelectedTab(value)
    localStorage.setItem('selectedTab', value)
  }

  const handleLogout = () => {
    sessionStorage.removeItem("session")
    localStorage.setItem('selectedTab', 'login')
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background-gradient-1 to-background-gradient-2">
      <div className="absolute top-13 right-4 hidden md:flex p-2 bg-white rounded-lg shadow-md  gap-2">
        {session ? (
         <Button variant={"outline"} onClick={handleLogout}>
          Logout
        </Button>) : (
        <Button variant={"outline"} onClick={() => changeTab('login')}>
          Login
        </Button>
        )}
        <Button variant={"outline"} onClick={toggleTheme} className="p-2">
          Theme wechseln
        </Button>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex flex-row-reverse justify-center items-center gap-4 mb-2">
            <h1 className="text-4xl font-bold text-white">FPV Drohnen Lernplattform</h1>
            <Image
              src="/logo.png"
              alt="DJI FPV Remote Controller 3"
              width={200}
              height={200
              }
              className="h-20 w-auto rounded-lg"
            />
          </div>
          <p className="text-xl text-gray-300">Alles was du über FPV-Drohnen wissen musst</p>
        </div>

        <Tabs value={selectedTab} className="w-full h-fit" onValueChange={changeTab}>
          <TabsList className={`grid w-full ${session ? "md:grid-cols-6": "md:grid-cols-5"} mb-8 h-fit text-black`}>
            <TabsTrigger value="goggles">DJI Goggles</TabsTrigger>
            <TabsTrigger value="controller">RC Controller</TabsTrigger>
            <TabsTrigger value="components">Komponenten</TabsTrigger>
            <TabsTrigger value="builder">Drohnen Builder</TabsTrigger>
            <TabsTrigger value="tutorial">Weitere Tutorials</TabsTrigger>
            {session && (<TabsTrigger value="admin">Panel</TabsTrigger>)}
            {session && <TabsTrigger value="login" className="md:hidden" onClick={handleLogout}>Logout</TabsTrigger>}
            {!session && <TabsTrigger value="login" className="md:hidden">Login</TabsTrigger>}
            <TabsTrigger value="theme" className="md:hidden" onClick={toggleTheme}>Theme wechseln</TabsTrigger>
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

          <TabsContent value="login" className="space-y-6">
              <Login/>
          </TabsContent>

          {session ? (
            <TabsContent value="admin" className="space-y-6">
              <Panel/>
            </TabsContent>
          ) : (
            <TabsContent value="admin" className="space-y-6 text-center text-white">
              <h2 className="text-2xl font-bold mb-4 mt-45">Für diesen Tab must du Angemeldet sein 😉</h2>
              <Button variant="outline" className="text-[hsl(205,16%,40%)]" onClick={() => changeTab('login')}>
                Anmelden
              </Button>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}