"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Play, FileText, ShoppingCart, Zap, Radio, Camera, Cpu } from "lucide-react"
import Image from "next/image"

// Komponenten-Daten für den Builder
const droneComponents = {
  frame: [
    {
      name: "Armattan Marmotte",
      price: 99,
      shop: "drone-fpv.ch",
      description: "5 Zoll Freestyle Frame",
      imageUrl: "https://drone-fpv.ch/shop/frames/5-frames/armattan-marmotte-5-fpv-frame/",
    },
    {
      name: "TBS Source One V5",
      price: 79,
      shop: "FPVFrame.ch",
      description: "Budget Freestyle Frame",
      imageUrl: "https://fpvframe.ch/tbs-source-one-v5-frame",
    },
    {
      name: "iFlight Nazgul5 V3",
      price: 109,
      shop: "dronefactory.ch",
      description: "Ready to Fly Frame",
      imageUrl: "https://dronefactory.ch/iflight-nazgul5-v3-analog-bnf/",
    },
  ],
  motors: [
    {
      name: "T-Motor F60 Pro V",
      price: 35,
      shop: "drone-fpv.ch",
      description: "2207 1750KV Motor",
      imageUrl: "https://drone-fpv.ch/shop/motoren/einzelmotoren/t-motor-f60-pro-v-2207-1750kv-motor/",
    },
    {
      name: "BrotherHobby Avenger 2207",
      price: 29,
      shop: "FPVFrame.ch",
      description: "2207 2550KV Motor",
      imageUrl: "https://fpvframe.ch/brotherhobby-avenger-2207-2550kv",
    },
    {
      name: "iFlight Xing2 2306",
      price: 32,
      shop: "dronefactory.ch",
      description: "2306 2450KV Motor",
      imageUrl: "https://dronefactory.ch/iflight-xing2-2306-motor/",
    },
  ],
  esc: [
    {
      name: "T-Motor F55A Pro II",
      price: 49,
      shop: "drone-fpv.ch",
      description: "3-6S 55A ESC",
      imageUrl: "https://drone-fpv.ch/shop/esc/einzel-esc/t-motor-f55a-pro-ii-3-6s-55a-esc/",
    },
    {
      name: "HGLRC Zeus55 Pro",
      price: 45,
      shop: "FPVFrame.ch",
      description: "3-6S 55A ESC",
      imageUrl: "https://fpvframe.ch/hglrc-zeus55-pro-blheli_32-55a-esc",
    },
    {
      name: "Foxeer Reaper Mini",
      price: 39,
      shop: "dronefactory.ch",
      description: "3-6S 45A ESC",
      imageUrl: "https://dronefactory.ch/foxeer-reaper-mini-45a-blheli_32-3-6s-esc/",
    },
  ],
  fc: [
    {
      name: "BrainFPV Radix 2",
      price: 89,
      shop: "drone-fpv.ch",
      description: "STM32F722 Flight Controller",
      imageUrl: "https://drone-fpv.ch/shop/flight-controller/brainfpv-radix-2-flight-controller/",
    },
    {
      name: "iFlight Beast F7",
      price: 69,
      shop: "FPVFrame.ch",
      description: "BLHeli_32 45A AIO",
      imageUrl: "https://fpvframe.ch/iflight-beast-f7-aio",
    },
    {
      name: "HGLRC Zeus F722",
      price: 59,
      shop: "dronefactory.ch",
      description: "F722 Flight Controller",
      imageUrl: "https://dronefactory.ch/hglrc-zeus-f722-mini-flight-controller/",
    },
  ],
  props: [
    {
      name: "HQProp Ethix S5",
      price: 6,
      shop: "drone-fpv.ch",
      description: "5.1x3.1x3 Propeller",
      imageUrl: "https://drone-fpv.ch/shop/propeller/5-propeller/hqprop-ethix-s5-watermelon-props-5-1x3-1x3/",
    },
    {
      name: "Gemfan Hurricane 51466",
      price: 5,
      shop: "FPVFrame.ch",
      description: "5.1 Inch Prop",
      imageUrl: "https://fpvframe.ch/gemfan-hurricane-51466-propeller",
    },
    {
      name: "Azure Power V2",
      price: 7,
      shop: "dronefactory.ch",
      description: "5 Inch Propeller",
      imageUrl: "https://dronefactory.ch/azure-power-v2-5-inch-propeller/",
    },
  ],
  battery: [
    {
      name: "Tattu R-Line 1300mAh",
      price: 29,
      shop: "drone-fpv.ch",
      description: "4S 120C Lipo",
      imageUrl: "https://drone-fpv.ch/shop/akkus/4s/tattu-r-line-1300mah-4s-120c-lipo-akku/",
    },
    {
      name: "CNHL Black Series 1300mAh",
      price: 25,
      shop: "FPVFrame.ch",
      description: "4S 130C Lipo",
      imageUrl: "https://fpvframe.ch/cnhl-black-series-1300mah-4s-130c-lipo-akku",
    },
    {
      name: "GNB 1100mAh",
      price: 22,
      shop: "dronefactory.ch",
      description: "4S 120C Lipo",
      imageUrl: "https://dronefactory.ch/gnb-1100mah-4s-120c-lipo-akku/",
    },
  ],
}

export default function Component() {
  const [selectedComponents, setSelectedComponents] = useState({})
  const [activeComponent, setActiveComponent] = useState(null)

  const handleComponentSelect = (componentType, component) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [componentType]: component,
    }))
    setActiveComponent(null)
  }

  const getTotalPrice = () => {
    return Object.values(selectedComponents).reduce((total, component) => total + (component?.price || 0), 0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">FPV Drohnen Lernplattform</h1>
          <p className="text-xl text-gray-600">Alles was du über FPV-Drohnen wissen musst</p>
        </div>

        <Tabs defaultValue="goggles" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="goggles">DJI Goggles</TabsTrigger>
            <TabsTrigger value="controller">RC Controller</TabsTrigger>
            <TabsTrigger value="components">Komponenten</TabsTrigger>
            <TabsTrigger value="builder">Drohnen Builder</TabsTrigger>
          </TabsList>

          {/* Section 1: DJI Goggles */}
          <TabsContent value="goggles" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    DJI Goggles 3
                  </CardTitle>
                  <CardDescription>Die neueste Generation der DJI FPV-Brille</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Image
                    src="/placeholder.svg?height=200&width=300"
                    alt="DJI Goggles 3"
                    width={300}
                    height={200}
                    className="w-full rounded-lg"
                  />
                  <div className="space-y-2">
                    <h4 className="font-semibold">Technische Daten:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 1080p Micro-OLED Display</li>
                      <li>• 100Hz Bildwiederholrate</li>
                      <li>• Integrierte Antennen</li>
                      <li>• Head Tracking</li>
                      <li>• 2 Stunden Akkulaufzeit</li>
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Play className="h-4 w-4 mr-1" />
                      Video Tutorial
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      Handbuch
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    DJI Goggles 3N
                  </CardTitle>
                  <CardDescription>Kompakte Version für Einsteiger</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Image
                    src="/placeholder.svg?height=200&width=300"
                    alt="DJI Goggles 3N"
                    width={300}
                    height={200}
                    className="w-full rounded-lg"
                  />
                  <div className="space-y-2">
                    <h4 className="font-semibold">Technische Daten:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 720p LCD Display</li>
                      <li>• 60Hz Bildwiederholrate</li>
                      <li>• Externe Antennen</li>
                      <li>• Leichter und günstiger</li>
                      <li>• 2.5 Stunden Akkulaufzeit</li>
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Play className="h-4 w-4 mr-1" />
                      Video Tutorial
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      Handbuch
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Vergleich und Empfehlungen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Feature</th>
                        <th className="text-left p-2">Goggles 3</th>
                        <th className="text-left p-2">Goggles 3N</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">Display</td>
                        <td className="p-2">1080p Micro-OLED</td>
                        <td className="p-2">720p LCD</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Preis (ca.)</td>
                        <td className="p-2">CHF 649</td>
                        <td className="p-2">CHF 449</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Zielgruppe</td>
                        <td className="p-2">Profis & Enthusiasten</td>
                        <td className="p-2">Einsteiger</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Section 2: RC Controller */}
          <TabsContent value="controller" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5" />
                  DJI FPV Remote Controller 3
                </CardTitle>
                <CardDescription>Professioneller FPV-Controller mit Hall-Sensor Gimbals für präzise Steuerung und anpassbare Stick-Spannung</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Image
                      src="/placeholder.svg?height=300&width=400"
                      alt="DJI RC Controller 3"
                      width={400}
                      height={300}
                      className="w-full rounded-lg"
                    />
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Hauptmerkmale:</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Hall-Sensor Gimbals für präzise Kontrolle</li>
                      <li>• Anpassbare Stick-Spannung</li>
                      <li>• 2.4GHz O4 Übertragung</li>
                      <li>• Bis zu 13km Reichweite</li>
                      <li>• Integriertes 2.8" Display</li>
                      <li>• 3 Stunden Akkulaufzeit</li>
                    </ul>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-2">Setup & Konfiguration:</h4>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4 mr-1" />
                          Setup Video
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Anleitung
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Stick-Modi</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs">
                      <p>Mode 1: Throttle rechts</p>
                      <p>Mode 2: Throttle links (Standard)</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Flugmodi</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs">
                      <p>Normal, Sport, Manual</p>
                      <p>Acro für Fortgeschrittene</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Wartung</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs">
                      <p>Gimbal-Kalibrierung</p>
                      <p>Firmware-Updates</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Section 3: Komponenten */}
          <TabsContent value="components" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    DJI Air Unit 4 System
                  </CardTitle>
                  <CardDescription>Alle Komponenten für deine FPV-Drohne mit DJI Air Unit 4</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="border-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Camera className="h-4 w-4" />
                          DJI Air Unit 4
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Image
                          src="/placeholder.svg?height=120&width=160"
                          alt="DJI Air Unit 4"
                          width={160}
                          height={120}
                          className="w-full rounded"
                        />
                        <p className="text-xs">Zentrale Einheit für Video-Übertragung und Aufzeichnung</p>
                        <Badge variant="secondary">CHF 299</Badge>
                        <p className="text-xs text-gray-600">Verbaut: Zentral im Frame</p>
                      </CardContent>
                    </Card>

                    <Card className="border-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Frame (Rahmen)</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Image
                          src="/placeholder.svg?height=120&width=160"
                          alt="FPV Frame"
                          width={160}
                          height={120}
                          className="w-full rounded"
                        />
                        <p className="text-xs">Carbon-Rahmen, meist 5" für Racing/Freestyle</p>
                        <Badge variant="secondary">CHF 75-95</Badge>
                        <p className="text-xs text-gray-600">Basis: Alle Komponenten werden hier montiert</p>
                      </CardContent>
                    </Card>

                    <Card className="border-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Motoren (4x)</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Image
                          src="/placeholder.svg?height=120&width=160"
                          alt="FPV Motors"
                          width={160}
                          height={120}
                          className="w-full rounded"
                        />
                        <p className="text-xs">Brushless Motoren, meist 2207 für 5" Props</p>
                        <Badge variant="secondary">CHF 85-120</Badge>
                        <p className="text-xs text-gray-600">Verbaut: An den vier Armen des Frames</p>
                      </CardContent>
                    </Card>

                    <Card className="border-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">ESC (Electronic Speed Controller)</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Image
                          src="/placeholder.svg?height=120&width=160"
                          alt="ESC"
                          width={160}
                          height={120}
                          className="w-full rounded"
                        />
                        <p className="text-xs">4-in-1 ESC für Motorsteuerung, meist 45A</p>
                        <Badge variant="secondary">CHF 55-70</Badge>
                        <p className="text-xs text-gray-600">Verbaut: Unter dem Flight Controller</p>
                      </CardContent>
                    </Card>

                    <Card className="border-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Flight Controller</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Image
                          src="/placeholder.svg?height=120&width=160"
                          alt="Flight Controller"
                          width={160}
                          height={120}
                          className="w-full rounded"
                        />
                        <p className="text-xs">F7 Prozessor mit Betaflight Firmware</p>
                        <Badge variant="secondary">CHF 40-50</Badge>
                        <p className="text-xs text-gray-600">Verbaut: Zentral, über dem ESC</p>
                      </CardContent>
                    </Card>

                    <Card className="border-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Propeller (4x)</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Image
                          src="/placeholder.svg?height=120&width=160"
                          alt="Propellers"
                          width={160}
                          height={120}
                          className="w-full rounded"
                        />
                        <p className="text-xs">5" Propeller, meist 5x4.3x3 für Racing</p>
                        <Badge variant="secondary">CHF 10-15</Badge>
                        <p className="text-xs text-gray-600">Verbaut: Auf den Motoren</p>
                      </CardContent>
                    </Card>

                    <Card className="border-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">LiPo Akku</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Image
                          src="/placeholder.svg?height=120&width=160"
                          alt="LiPo Battery"
                          width={160}
                          height={120}
                          className="w-full rounded"
                        />
                        <p className="text-xs">4S LiPo, 1300-1550mAh für 5" Drohnen</p>
                        <Badge variant="secondary">CHF 25-35</Badge>
                        <p className="text-xs text-gray-600">Verbaut: Unten am Frame mit Strap</p>
                      </CardContent>
                    </Card>

                    <Card className="border-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Antennen</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Image
                          src="/placeholder.svg?height=120&width=160"
                          alt="Antennas"
                          width={160}
                          height={120}
                          className="w-full rounded"
                        />
                        <p className="text-xs">2.4GHz Antennen für O4 System</p>
                        <Badge variant="secondary">CHF 15-25</Badge>
                        <p className="text-xs text-gray-600">Verbaut: Oben am Frame, möglichst frei</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Aufbau-Reihenfolge</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        1
                      </div>
                      <span>Frame vorbereiten und Motoren montieren</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      <span>ESC im Frame installieren</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        3
                      </div>
                      <span>Flight Controller montieren und verkabeln</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        4
                      </div>
                      <span>DJI Air Unit 4 installieren</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        5
                      </div>
                      <span>Antennen montieren</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        6
                      </div>
                      <span>Propeller aufsetzen und Software konfigurieren</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Section 4: Drohnen Builder */}
          <TabsContent value="builder" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  FPV Drohnen Builder
                </CardTitle>
                <CardDescription>Klicke auf die Komponenten um deine Drohne zu konfigurieren</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* 2D Drohnen-Ansicht */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Drohnen-Konfiguration</h3>
                    <div className="relative bg-gray-50 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
                      <svg width="300" height="300" viewBox="0 0 300 300" className="border rounded">
                        {/* Frame mit Armen */}
                        <rect
                          x="130"
                          y="130"
                          width="40"
                          height="40"
                          fill={selectedComponents.frame ? "#10b981" : "#6b7280"}
                          className="cursor-pointer hover:fill-blue-500 transition-colors"
                          onClick={() => setActiveComponent("frame")}
                        />

                        {/* Arme vom Frame zu den Motoren */}
                        <line
                          x1="150"
                          y1="130"
                          x2="80"
                          y2="80"
                          stroke={selectedComponents.frame ? "#10b981" : "#6b7280"}
                          strokeWidth="4"
                          className="cursor-pointer hover:stroke-blue-500 transition-colors"
                          onClick={() => setActiveComponent("frame")}
                        />
                        <line
                          x1="150"
                          y1="150"
                          x2="220"
                          y2="80"
                          stroke={selectedComponents.frame ? "#10b981" : "#6b7280"}
                          strokeWidth="4"
                          className="cursor-pointer hover:stroke-blue-500 transition-colors"
                          onClick={() => setActiveComponent("frame")}
                        />
                        <line
                          x1="150"
                          y1="150"
                          x2="80"
                          y2="220"
                          stroke={selectedComponents.frame ? "#10b981" : "#6b7280"}
                          strokeWidth="4"
                          className="cursor-pointer hover:stroke-blue-500 transition-colors"
                          onClick={() => setActiveComponent("frame")}
                        />
                        <line
                          x1="150"
                          y1="150"
                          x2="220"
                          y2="220"
                          stroke={selectedComponents.frame ? "#10b981" : "#6b7280"}
                          strokeWidth="4"
                          className="cursor-pointer hover:stroke-blue-500 transition-colors"
                          onClick={() => setActiveComponent("frame")}
                        />

                        {/* Motoren */}
                        <circle
                          cx="80"
                          cy="80"
                          r="15"
                          fill={selectedComponents.motors ? "#10b981" : "#6b7280"}
                          className="cursor-pointer hover:fill-blue-500 transition-colors"
                          onClick={() => setActiveComponent("motors")}
                        />
                        <circle
                          cx="220"
                          cy="80"
                          r="15"
                          fill={selectedComponents.motors ? "#10b981" : "#6b7280"}
                          className="cursor-pointer hover:fill-blue-500 transition-colors"
                          onClick={() => setActiveComponent("motors")}
                        />
                        <circle
                          cx="80"
                          cy="220"
                          r="15"
                          fill={selectedComponents.motors ? "#10b981" : "#6b7280"}
                          className="cursor-pointer hover:fill-blue-500 transition-colors"
                          onClick={() => setActiveComponent("motors")}
                        />
                        <circle
                          cx="220"
                          cy="220"
                          r="15"
                          fill={selectedComponents.motors ? "#10b981" : "#6b7280"}
                          className="cursor-pointer hover:fill-blue-500 transition-colors"
                          onClick={() => setActiveComponent("motors")}
                        />

                        {/* ESC */}
                        <rect
                          x="140"
                          y="140"
                          width="20"
                          height="20"
                          fill={selectedComponents.esc ? "#10b981" : "#6b7280"}
                          className="cursor-pointer hover:fill-blue-500 transition-colors"
                          onClick={() => setActiveComponent("esc")}
                        />

                        {/* Flight Controller */}
                        <rect
                          x="145"
                          y="145"
                          width="10"
                          height="10"
                          fill={selectedComponents.fc ? "#10b981" : "#6b7280"}
                          className="cursor-pointer hover:fill-blue-500 transition-colors"
                          onClick={() => setActiveComponent("fc")}
                        />

                        {/* Propeller */}
                        <ellipse
                          cx="80"
                          cy="80"
                          rx="25"
                          ry="8"
                          fill={selectedComponents.props ? "#10b981" : "#6b7280"}
                          className="cursor-pointer hover:fill-blue-500 transition-colors"
                          onClick={() => setActiveComponent("props")}
                        />
                        <ellipse
                          cx="220"
                          cy="80"
                          rx="25"
                          ry="8"
                          fill={selectedComponents.props ? "#10b981" : "#6b7280"}
                          className="cursor-pointer hover:fill-blue-500 transition-colors"
                          onClick={() => setActiveComponent("props")}
                        />
                        <ellipse
                          cx="80"
                          cy="220"
                          rx="25"
                          ry="8"
                          fill={selectedComponents.props ? "#10b981" : "#6b7280"}
                          className="cursor-pointer hover:fill-blue-500 transition-colors"
                          onClick={() => setActiveComponent("props")}
                        />
                        <ellipse
                          cx="220"
                          cy="220"
                          rx="25"
                          ry="8"
                          fill={selectedComponents.props ? "#10b981" : "#6b7280"}
                          className="cursor-pointer hover:fill-blue-500 transition-colors"
                          onClick={() => setActiveComponent("props")}
                        />

                        {/* Akku */}
                        <rect
                          x="125"
                          y="180"
                          width="50"
                          height="15"
                          fill={selectedComponents.battery ? "#10b981" : "#6b7280"}
                          className="cursor-pointer hover:fill-blue-500 transition-colors"
                          onClick={() => setActiveComponent("battery")}
                        />

                        {/* Labels */}
                        <text x="150" y="125" textAnchor="middle" className="text-xs fill-gray-700">
                          Frame
                        </text>
                        <text x="80" y="50" textAnchor="middle" className="text-xs fill-gray-700">
                          Motor
                        </text>
                        <text x="150" y="210" textAnchor="middle" className="text-xs fill-gray-700">
                          ESC/FC
                        </text>
                        <text x="150" y="220" textAnchor="middle" className="text-xs fill-gray-700">
                          Akku
                        </text>
                      </svg>
                    </div>

                    {/* Komponenten-Auswahl */}
                    {activeComponent && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {activeComponent === "frame" && "Frame auswählen"}
                            {activeComponent === "motors" && "Motoren auswählen"}
                            {activeComponent === "esc" && "ESC auswählen"}
                            {activeComponent === "fc" && "Flight Controller auswählen"}
                            {activeComponent === "props" && "Propeller auswählen"}
                            {activeComponent === "battery" && "Akku auswählen"}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {droneComponents[activeComponent]?.map((component, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleComponentSelect(activeComponent, component)}
                              >
                                <div>
                                  <h4 className="font-medium">{component.name}</h4>
                                  <p className="text-sm text-gray-600">{component.description}</p>
                                  <p className="text-xs text-gray-500">Shop: {component.shop}</p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(component.imageUrl, "_blank")}
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Shop
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Konfiguration & Einkaufsliste */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Deine Konfiguration</h3>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                          Einkaufsliste
                          <Badge variant="outline">Total: CHF {getTotalPrice()}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Object.entries(selectedComponents).map(([type, component]) => (
                            <div key={type} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <h4 className="font-medium text-sm">{component.name}</h4>
                                <p className="text-xs text-gray-600">{component.shop}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-sm">CHF {component.price}</p>
                                <Button size="sm" variant="ghost" className="h-6 text-xs">
                                  <ShoppingCart className="h-3 w-3 mr-1" />
                                  Kaufen
                                </Button>
                              </div>
                            </div>
                          ))}

                          {Object.keys(selectedComponents).length === 0 && (
                            <p className="text-gray-500 text-center py-4">
                              Klicke auf die Komponenten in der Drohnen-Ansicht um sie auszuwählen
                            </p>
                          )}
                        </div>

                        {Object.keys(selectedComponents).length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <Button className="w-full">
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Alle Komponenten kaufen (CHF {getTotalPrice()})
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Schweizer FPV Shops</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>drone-fpv.ch</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open("https://drone-fpv.ch", "_blank")}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex justify-between">
                            <span>FPVFrame.ch</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open("https://fpvframe.ch", "_blank")}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex justify-between">
                            <span>dronefactory.ch</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open("https://dronefactory.ch", "_blank")}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
