"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Play, FileText, ShoppingCart, Zap, Radio, Camera, Cpu, AppWindow } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { link } from "fs"

// Komponenten-Daten für den Builder
const droneComponents = {
  frame: [
    {
      name: "Axisflying MANTA 6 Dead Cat Frame Kit",
      price: 74.90,
      shop: "dronefactory.ch",
      description: "5 Zoll Freestyle Frame",
      link: "https://www.dronefactory.ch/produkt/axisflying-manta-6-dead-cat-frame-kit/",
      imageUrl: "https://www.dronefactory.ch/wp-content/uploads/2025/03/Axisflying-MANTA-6-Dead-Cat-Frame-Kit-DroneFactory1.jpg",
    },
    {
      name: "TBS Source One V5",
      price: 79,
      shop: "FPVRacing.ch",
      description: "Budget Freestyle Frame",
      link: "https://fpvracing.ch/de/frames/4068-impulserc-echo-5-frame-kit-blackbird.html",
      imageUrl: "https://fpvracing.ch/18023-large_default/impulserc-echo-5-frame-kit-blackbird.jpg",
    },
    {
      name: "iFlight Nazgul5 V3",
      price: 109,
      shop: "fpv24.ch",
      description: "Der SpeedyBee Mario 5 XH Frame O4 Advanced Version ist ein leichter und robuster FPV-Rahmen, der speziell für Racing- und Freestyle-Piloten entwickelt wurde. Mit einer Radstandlänge von 226 mm und einer hochwertigen T300 3K Carbon-Konstruktion bietet er maximale Stabilität und Widerstandsfähigkeit. Dank der luftfahrttauglichen Aluminiumlegierung ist die Kamera optimal geschützt, während die verstärkten 6 mm dicken Arme für minimale Torsion und verbesserte Flugstabilität sorgen. Die Anti-Rutsch-Batteriehalterung aus 3 mm Silikon sorgt zudem für einen sicheren Sitz der Akkus, selbst bei intensiven Manövern.Mit seinen vielseitigen Montagemöglichkeiten für FC, VTX und GPS ist der Mario 5 XH Frame ideal für individuelle Setups und kompatibel mit DJI O4 und anderen FPV-Systemen.",
      link: "https://www.fpv24.com/de/speedy-bee/speedybee-mario-5-xh-frame-o4-advanced-version",
      imageUrl: "https://cdnc.meilon.de/img/product/ru/run-sb-mario5-frame-xh-o4-adv/run-sb-mario5-frame-xh-o4-adv-b0b352_l.jpg",
    },
  ],
  motors: [
    {
      name: "Axis BlackBird V3",
      price: 29.90,
      shop: "dronefactory.ch",
      description: "Axis BlackBird V3 BB2207 2725kv",
      link: "https://www.dronefactory.ch/produkt/axis-blackbird-v3-bb2207-2725kv",
      imageUrl: "https://www.dronefactory.ch/wp-content/uploads/2022/07/Axis-BlackBird-V3-BB2207-DroneFactory.ch_.jpg",
    },
    {
      name: "iFlight XING R5",
      price: 25.90,
      shop: "fpvracing.ch",
      description: "iFlight XING R5 2207 2100Kv",
      link: "https://fpvracing.ch/de/motoren/4052-iflight-xing-r5-2207-2100kv.html",
      imageUrl: "https://fpvracing.ch/17880-large_default/iflight-xing-r5-2207-2100kv.jpg",
    },
    {
      name: "T-Motor",
      price: 24.90,
      shop: "fpv24.com",
      description: "T-Motor F2004 3000KV Schwarz Blau FPV Motor",
      link: "https://www.fpv24.com/de/t-motor/t-motor-f2004-3000kv-schwarz-rot-fpv-motor",
      imageUrl: "https://cdnc.meilon.de/img/product/tm/tmo-afd01010161/t-motor-f2004_l.jpg",
    },
  ],
  esc: [
    {
      name: "Speedybee V3 BL32 50A ESC 3-6S",
      price: 74.90,
      shop: "fpvracing.ch",
      description: "Der SpeedyBee 50A 128K ESC bietet 50A Leistung und ist mit einem schützenden CNC-Kühlkörper für Überhitzungsschutz ausgestattet.",
      link: "https://fpvracing.ch/de/esc/3342-speedybee-v3-bl32-50a-esc-3-6s.html",
      imageUrl: "https://fpvracing.ch/14870-large_default/speedybee-v3-bl32-50a-esc-3-6s.jpg",
    },
    {
      name: "Speedybee BLS 60A ESC 3-6S",
      price: 52.90,
      shop: "fpvracing.ch",
      description: "Der SpeedyBee BLS 60A 4-in-1 ESC kombiniert hochleistungsmerkmale zu einem erschwinglichen Preis.",
      link: "https://fpvracing.ch/de/esc/3825-speedybee-bls-60a-esc-3-6s.html",
      imageUrl: "https://fpvracing.ch/16292-large_default/speedybee-bls-60a-esc-3-6s.jpg",
    },
    {
      name: "Tiger Motor F45A Mini BLHeli32 ESC 3-6S",
      price: 82.90,
      shop: "fpvracing.ch",
      description: "Der T-Motor Mini F45A 6S BLHeli32 4-in-1-Regler biete viel Power in einem 20x20-ESC!",
      link: "https://fpvracing.ch/de/esc/3342-foxeer-reaper-mini-45a-blheli-32-3-6s-esc.html",
      imageUrl: "https://fpvracing.ch/12281-large_default/tiger-motor-f45a-mini-blheli32-esc-3-6s.jpg",
    },
  ],
  fc: [
    {
      name: "Speedybee F7 V3 Flight Controller",
      price: 74.9,
      shop: "fpvracing.ch",
      description: "Die SpeedyBee F7 V3 FC ist eine F722 FC mit einem BMP280 Barometer, OSD, 500MB Memory Blackbox, eingebauten FC LiPo Überwachungssystem und vielen weiteren Funktionen.",
      link: "https://fpvracing.ch/de/flight-controller/3343-speedybee-tx600-f7-v2-flight-controller.html",
      imageUrl: "https://fpvracing.ch/14873-large_default/speedybee-tx600-f7-v2-flight-controller.jpg",
    },
    {
      name: "GOKU GN 745 45A AIO 32bit MPU6000 V3 (AM32)",
      price: 105,
      shop: "FPVFrame.ch",
      description: "GOKU GN 745 45A AIO 32bit MPU6000 V3 (AM32)",
      link: "https://fpvframe.ch/product/goku-gn-745-45a-aio-32bit-mpu6000-v3-am32/",
      imageUrl: "https://i0.wp.com/fpvframe.ch/wp-content/uploads/2025/01/goku-gn-745-45a-aio-32bit-mpu600.jpg?fit=800%2C800&ssl=1",
    },
    {
      name: "iFlight BLITZ F7 Pro Flight Controlle",
      price: 99,
      shop: "dronefactory.ch",
      description: `Features
      Improved circuit design, better components, and lower electrical noise!
      DJI HD VTX Connector (Plug-and-Play / No soldering required)
      FC indicator LEDs for visual debugging
      512MB BlackBox
      With LC filter
      Specifications
      Mount pattern: 35*35mm/ 4mm PCB hole diameter
      Smartaudio / IRC Tramp VTX protocol supported
      Firmware target: IFLIGHT_BLITZ_F7_PRO
      Input Voltage: 14.8V-34V (4S-8S LIPO)
      Motor outputs: 4x (SH1.25 connector)
      Flash: 512MB (Blackbox flash)
      I2C serial: SDA / SLA pads
      Dimensions: 41*41.5mm
      Barometer: DPS310
      OSD Chip: AT7456E
      LED controller: Yes
      MCU: STM32 F722
      Weight: 17g (±2)
      Beeper pad: Yes
      Gyro: MPU6000
      UARTS: 4`,
      link: "https://www.dronefactory.ch/produkt/iflight-blitz-f7-pro-flight-controller/",
      imageUrl: "https://www.dronefactory.ch/wp-content/uploads/2023/01/BLITZ-F7-Pro-Flight-Controller-DroneFactory.ch_.png.webp",
    },
  ],
  props: [
    {
      name: "GEMFAN 6032 Triblade",
      price: 3.5,
      shop: "fpvframe.ch",
      description:'6" Propeller',
      link: "https://fpvframe.ch/product/gemfan-6030-triblade/",
      imageUrl: "https://i0.wp.com/fpvframe.ch/wp-content/uploads/2020/11/51466-scaled.jpg?fit=2560%2C2560&ssl=1",
    },
    {
      name: "iFlight Nazgul R5 V2 Propeller",
      price: 3.5,
      shop: "fpvracing.ch",
      description: '5.1" Propeller',
      link: "https://fpvracing.ch/de/propeller/4053-iflight-nazgul-r5-v2-propeller.html",
      imageUrl: "https://fpvracing.ch/17886-large_default/iflight-nazgul-r5-v2-propeller.jpg",
    },
    {
      name: "HQ MCK Prop Light Blue",
      price: 3.9,
      shop: "dronefactory.ch",
      description: '5.1" Propeller',
      link: "https://www.dronefactory.ch/produkt/hq-mck-prop-light-blue",
      imageUrl: "https://www.dronefactory.ch/wp-content/uploads/2025/03/MCK-Prop-04.jpg",
    },
  ],
  battery: [
    {
      name: "4S 1500mAh CNHL",
      price: 25,
      shop: "fpvframe.ch",
      description: "Black Series 100C – XT60",
      link: "https://fpvframe.ch/product/4s-1500mah-cnhl/",
      imageUrl: "https://i0.wp.com/fpvframe.ch/wp-content/uploads/2024/05/CNHL_4S_1500.jpg?fit=800%2C800&ssl=1",
    },
    {
      name: "Bonka 6S 1100mAh",
      price: 43.00,
      shop: "fpvframe.ch",
      description: "Bonka U2 130C XT60",
      link: "https://fpvframe.ch/product/bonka-6s-1100mah/",
      imageUrl: "https://i0.wp.com/fpvframe.ch/wp-content/uploads/2023/08/275c2b36dadd5c6.jpg?fit=1812%2C1812&ssl=1",
    },
    {
      name: "Tattu R-Line Version 3.0 2000mAh 14.8V 120C 4S1P Lipo mit XT60",
      price: 48.90,
      shop: "dronefactory.ch",
      description: `Tattu R-Line Version 3.0 2000mAh 14.8V 120C 4S1P LiPo battery pack is the updated version of R-Line series in 2019.
      With More Punch, Lower Internal Resistance and Less weight, Tattu R-line V3 definitely dominate all your races.
      What is R-Line R-Line is a brand new product line specifically designed for professional FPV racing competitions.
      It’s the selling version of Toppilot batteries. It’s also a subsidiary of the Tattu brand.
      It’s got higher capacity, lower internal resistance, and lower landing temperatures. They are more powerful than any graphene battery.
      Generally, R-Line batteries have the same specs as our popular Toppilot batteries.
      There are different R-Line versions for the needs of different FPV racing competitions.`,
      link: "https://www.dronefactory.ch/produkt/tattu-r-line-version-3-0-2000mah-14-8v-120c-4s1p-lipo-mit-xt60",
      imageUrl: "https://www.dronefactory.ch/wp-content/uploads/2023/07/Tattu-R-Line-Version-3.0-2000mAh-14.8V-120C-4S1P-Lipo-mit-XT60-DroneFactory5.jpg",
    },
    {
      name: "Tattu R-Line Version 5.0 1550mAh 22.2V 150C 6S1P XT60",
      price: 50,
      shop: "dronefactory.ch",
      description: `Tattu R-Line Version 5.0 1550mAh 22.2V 150C 6S1P LiPo battery pack is the updated version of R-Line series in 2022.
      With More Punch, Lower Internal Resistance and Less weight, Tattu R-line V4 definitely dominate all your races.
      What is R-Line? R-Line is a brand new product line specifically designed for professional FPV racing competitions.
      It’s the selling version of Toppilot batteries. It’s also a subsidiary of the Tattu brand.
      It’s got higher capacity, lower internal resistance, and lower landing temperatures.
      They are more powerful than any graphene battery. Generally, R-Line batteries have the same specs as our popular Toppilot batteries.
      There are different R-Line versions for the needs of different FPV racing competitions.`,
      link: "https://www.dronefactory.ch/produkt/tattu-r-line-version-5-0-1550mah-22-2v-150c-6s1p-xt60/",
      imageUrl: "https://www.dronefactory.ch/wp-content/uploads/2024/08/Tattu-R-Line-Version-5.0-1550mAh-22.2V-150C-6S1P-XT60-dronefactory.png",
    },
    {
      name: "TATTU R-Line 1300mAh 4S 120C V4.0 (XT60)",
      price: 33.90,
      shop: "fpvracing.ch",
      description: "Tattu R-Line 1300mAh 120C 4S1P LiPo - für FPV Racing.",
      link: "https://fpvracing.ch/de/4s/3733-tattu-r-line-1300mah-4s-120c-v30-xt60-6928493302903.html",
      imageUrl: "https://fpvracing.ch/15708-large_default/tattu-r-line-1300mah-4s-120c-v30-xt60.jpg",
    },
    {
      name: "GEPRC Storm 3300mAh 6S 95C (XT60)",
      price: 99,
      shop: "fpvracing.ch",
      description: 'GepRC Storm 3300mAh 95C 6S1P LiPo - ideal für 7" Long Range.',
      link: "https://fpvracing.ch/de/6s/4061-geprc-storm-3300mah-6s-95c-xt60.html",
      imageUrl: "https://fpvracing.ch/17961-large_default/geprc-storm-3300mah-6s-95c-xt60.jpg",
    },
  ],
}

export default function Component() {
  const [selectedComponents, setSelectedComponents] = useState({})
  const [activeComponent, setActiveComponent] = useState(null)
  const [expandedDescriptions, setExpandedDescriptions] = useState({})

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

  const openShop = (e, shop) => {
    e.stopPropagation()
    window.open(shop, "_blank", "noopener,noreferrer")
  }

  const toggleDescription = (componentIndex) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [componentIndex]: !prev[componentIndex]
    }))
  }

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

        <Tabs defaultValue="goggles" className="w-full h-fit">
          <TabsList className="grid w-full md:grid-cols-5 mb-8 h-fit">
            <TabsTrigger value="goggles">DJI Goggles</TabsTrigger>
            <TabsTrigger value="controller">RC Controller</TabsTrigger>
            <TabsTrigger value="components">Komponenten</TabsTrigger>
            <TabsTrigger value="builder">Drohnen Builder</TabsTrigger>
            <TabsTrigger value="tutorial">Weitere Tutorials</TabsTrigger>
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
                    src="https://dronesolutions.ch/wp-content/uploads/2024/04/goggles-3-von-vorne.webp"
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
                      <li>• 3 Stunden Akkulaufzeit</li>
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="https://www.youtube.com/watch?v=YXVRuKTDnz4"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                    >
                      <Play className="h-4 w-4" />
                      Video Tutorial (DJI Goggles 3 Overview - The Era Of The Ecosystem)
                    </Link>
                    <Link
                      href="https://dl.djicdn.com/downloads/DJI_Goggles_3/DJI_Goggles_3_User_Manual_DE.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                    >
                      <FileText className="h-4 w-4" />
                      Handbuch
                    </Link>
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
                    src="https://dronesolutions.ch/wp-content/uploads/2025/01/dji-goggles-N-3-Brille.1.webp"
                    alt="DJI Goggles 3N"
                    width={300}
                    height={200}
                    className="w-full rounded-lg"
                  />
                  <div className="space-y-2">
                    <h4 className="font-semibold">Technische Daten:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• 1080p LCD Display</li>
                      <li>• 60Hz Bildwiederholrate</li>
                      <li>• Externe Antennen</li>
                      <li>• Leichter und günstiger</li>
                      <li>• 2.5 Stunden Akkulaufzeit</li>
                    </ul>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href="https://www.youtube.com/watch?v=XsCCcQk3z0o"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                    >
                      <Play className="h-4 w-4" />
                      Video Tutorial (DJI Goggles N3｜Usage)
                    </Link>
                    <Link
                      href="https://dl.djicdn.com/downloads/DJI_Goggles_N3/DJI_Goggles_N3_User_Manual_de.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                    >
                      <FileText className="h-4 w-4" />
                      Handbuch
                    </Link>
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
                        <td className="p-2">1080 LCD</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Preis (ca.)</td>
                        <td className="p-2">CHF 608</td>
                        <td className="p-2">CHF 262</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Zielgruppe</td>
                        <td className="p-2">Profis & Enthusiasten</td>
                        <td className="p-2">Einsteiger</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Link
                  href="https://www.youtube.com/watch?v=Pe2KBUw_QE8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                >
                  <Play className="h-4 w-4" />
                  Video Tutorial
                </Link>
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
                      src="https://dronesolutions.ch/wp-content/uploads/2024/04/remote-controller-3.webp"
                      alt="DJI FPV Remote Controller 3"
                      width={400}
                      height={300}
                      className="w-full rounded-lg"
                    />
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Hauptmerkmale:</h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Anpassbare Stick-Spannung</li>
                      <li>• 2.4GHz O4 Übertragung</li>
                      <li>• Bis zu 13km Reichweite</li>
                      <li>• 10 Stunden Akkulaufzeit</li>
                    </ul>

                    <Separator />

                    <div>
                      <h4 className="font-semibold mb-2">Setup & Konfiguration:</h4>
                      <div className="flex gap-2">
                         <Link
                          href="https://www.youtube.com/watch?v=3tMREwYGh7A&pp=ygUQZGppIGZwdiByZW1vdGUgMw%3D%3D"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                        >
                          <Play className="h-4 w-4" />
                          Video Tutorial
                        </Link>
                        <Link
                          href="https://www.youtube.com/watch?v=YPBy5JtkfTs"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                        >
                          <Play className="h-4 w-4" />
                          Video Tutorial
                        </Link>
                        <Link
                          href="https://dl.djicdn.com/downloads/DJI_FPV_RC_3/UM/DJI_FPV_Remote_Controller_3_User_Manual_v1.0_DE.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                        >
                          <FileText className="h-4 w-4" />
                          Handbuch
                        </Link>
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
                          src="https://www.hebu-shop.ch/wp-content/uploads/2025/03/445178-843-DJI-O4-Air-Unit-Pro-b1.jpg"
                          alt="DJI Air Unit 4"
                          width={160}
                          height={120}
                          className="w-full rounded"
                        />
                        <p className="text-xs">Zentrale Einheit für Video-Übertragung und Aufzeichnung</p>
                        <Badge variant="secondary">CHF 299</Badge>
                        <p className="text-xs text-gray-600">Verbaut: Zentral im Frame</p>
                        <Link
                          href="https://www.youtube.com/watch?v=yyOULp6pCO0"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                        >
                          <Play className="h-4 w-4" />
                          Video Tutorial (DJI O4 Air Unit Series｜Linking)
                        </Link>
                        <Link
                          href="https://www.youtube.com/shorts/ILR8Iloq-K8?feature=share"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                        >
                          <Play className="h-4 w-4" />
                          Video Tutorial (How to Bind the DJI Goggles 3 to O4 Air Unit ‘lite’)
                        </Link>
                      </CardContent>
                    </Card>

                    <Card className="border-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Frame (Rahmen)</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Image
                          src="https://m.media-amazon.com/images/I/61sdGFXVyjL._AC_UF894,1000_QL80_.jpg"
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
                          src="https://m.media-amazon.com/images/I/51UkA2m8XVL._AC_UF1000,1000_QL80_.jpg"
                          alt="FPV Motors"
                          width={160}
                          height={120}
                          className="w-full rounded"
                        />
                        <p className="text-xs">Brushless Motoren, meist 2207 für 5" Props</p>
                        <Badge variant="secondary">CHF 85-120</Badge>
                        <p className="text-xs text-gray-600">Verbaut: An den vier Armen des Frames</p>
                        <Link
                          href="https://www.youtube.com/watch?v=E6nsJpuaTQc"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                        >
                          <Play className="h-4 w-4" />
                          Video Tutorial (How do you choose motor KV for a build? - FPV Questions)
                        </Link>
                      </CardContent>
                    </Card>

                    <Card className="border-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">ESC (Electronic Speed Controller)</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Image
                          src="https://www.dronefactory.ch/wp-content/uploads/2019/10/HobbyWing-XRotor-Micro-60A-4in1-BLHeli32-6S-DroneFactory.ch_-300x300.jpg"
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
                          src="https://img-va.myshopline.com/image/store/1715652130323/tmotor-f7-30-5x30-5-fpv-drones-flight-controller-t-motor-1_1445x.png?w=1000&h=1000&q=100"
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
                          src="https://cdnc.meilon.de/img/product/ge/gem-pmpc5136-3b/GEM-PMPC5136-3B_sy.jpg"
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
                          src="https://www.swaytronic.ch/media/13/b8/f8/1636597942/SWAY_FPV_LiPo_3S_11.1V_450mAh_60C120C_JST_7640182626129_Web.jpg"
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
                    <h3 className="font-semibold text-center lg:text-left">Drohnen-Konfiguration</h3>
                    <div className="relative bg-gray-50 rounded-lg p-4 lg:p-8 min-h-[300px] lg:min-h-[400px] flex items-center justify-center">
                      {/* Tooltip that appears on hover */}
                      <div
                      id="component-tooltip"
                      className="absolute bg-black text-white px-2 py-1 rounded text-xs pointer-events-none opacity-0 transition-opacity"
                      style={{ top: '10px', left: '50%', transform: 'translateX(-50%)' }}
                      >
                      Component name
                      </div>

                      <svg
                      width="250"
                      height="250"
                      viewBox="0 0 300 300"
                      className="border rounded w-full max-w-[300px] h-auto"
                      onMouseOut={() => {
                        const tooltip = document.getElementById('component-tooltip');
                        if (tooltip) tooltip.style.opacity = '0';
                      }}
                      >
                      {/* Frame mit Armen */}
                      <rect
                        x="130"
                        y="130"
                        width="40"
                        height="40"
                        fill={selectedComponents.frame ? "#10b981" : "#6b7280"}
                        className="cursor-pointer hover:fill-blue-500 transition-colors frame-element"
                        onClick={() => setActiveComponent("frame")}
                        onMouseOver={() => {
                        const elements = document.getElementsByClassName('frame-element');
                        Array.from(elements).forEach(el => el.classList.add('fill-blue-500', 'stroke-blue-500'));
                        const tooltip = document.getElementById('component-tooltip');
                        if (tooltip) {
                          tooltip.textContent = 'Frame';
                          tooltip.style.opacity = '1';
                        }
                        }}
                        onMouseOut={() => {
                        const elements = document.getElementsByClassName('frame-element');
                        Array.from(elements).forEach(el => el.classList.remove('fill-blue-500', 'stroke-blue-500'));
                        }}
                      />

                      {/* Arme vom Frame zu den Motoren */}
                      <line
                        x1="150"
                        y1="150"
                        x2="80"
                        y2="80"
                        stroke={selectedComponents.frame ? "#10b981" : "#6b7280"}
                        strokeWidth="4"
                        className="cursor-pointer hover:stroke-blue-500 transition-colors frame-element"
                        onClick={() => setActiveComponent("frame")}
                        onMouseOver={() => {
                        const elements = document.getElementsByClassName('frame-element');
                        Array.from(elements).forEach(el => el.classList.add('fill-blue-500', 'stroke-blue-500'));
                        const tooltip = document.getElementById('component-tooltip');
                        if (tooltip) {
                          tooltip.textContent = 'Frame';
                          tooltip.style.opacity = '1';
                        }
                        }}
                        onMouseOut={() => {
                        const elements = document.getElementsByClassName('frame-element');
                        Array.from(elements).forEach(el => el.classList.remove('fill-blue-500', 'stroke-blue-500'));
                        }}
                      />
                      <line
                        x1="150"
                        y1="150"
                        x2="220"
                        y2="80"
                        stroke={selectedComponents.frame ? "#10b981" : "#6b7280"}
                        strokeWidth="4"
                        className="cursor-pointer hover:stroke-blue-500 transition-colors frame-element"
                        onClick={() => setActiveComponent("frame")}
                        onMouseOver={() => {
                        const elements = document.getElementsByClassName('frame-element');
                        Array.from(elements).forEach(el => el.classList.add('fill-blue-500', 'stroke-blue-500'));
                        const tooltip = document.getElementById('component-tooltip');
                        if (tooltip) {
                          tooltip.textContent = 'Frame';
                          tooltip.style.opacity = '1';
                        }
                        }}
                        onMouseOut={() => {
                        const elements = document.getElementsByClassName('frame-element');
                        Array.from(elements).forEach(el => el.classList.remove('fill-blue-500', 'stroke-blue-500'));
                        }}
                      />
                      <line
                        x1="150"
                        y1="150"
                        x2="80"
                        y2="220"
                        stroke={selectedComponents.frame ? "#10b981" : "#6b7280"}
                        strokeWidth="4"
                        className="cursor-pointer hover:stroke-blue-500 transition-colors frame-element"
                        onClick={() => setActiveComponent("frame")}
                        onMouseOver={() => {
                        const elements = document.getElementsByClassName('frame-element');
                        Array.from(elements).forEach(el => el.classList.add('fill-blue-500', 'stroke-blue-500'));
                        const tooltip = document.getElementById('component-tooltip');
                        if (tooltip) {
                          tooltip.textContent = 'Frame';
                          tooltip.style.opacity = '1';
                        }
                        }}
                        onMouseOut={() => {
                        const elements = document.getElementsByClassName('frame-element');
                        Array.from(elements).forEach(el => el.classList.remove('fill-blue-500', 'stroke-blue-500'));
                        }}
                      />
                      <line
                        x1="150"
                        y1="150"
                        x2="220"
                        y2="220"
                        stroke={selectedComponents.frame ? "#10b981" : "#6b7280"}
                        strokeWidth="4"
                        className="cursor-pointer hover:stroke-blue-500 transition-colors frame-element"
                        onClick={() => setActiveComponent("frame")}
                        onMouseOver={() => {
                        const elements = document.getElementsByClassName('frame-element');
                        Array.from(elements).forEach(el => el.classList.add('fill-blue-500', 'stroke-blue-500'));
                        const tooltip = document.getElementById('component-tooltip');
                        if (tooltip) {
                          tooltip.textContent = 'Frame';
                          tooltip.style.opacity = '1';
                        }
                        }}
                        onMouseOut={() => {
                        const elements = document.getElementsByClassName('frame-element');
                        Array.from(elements).forEach(el => el.classList.remove('fill-blue-500', 'stroke-blue-500'));
                        }}
                      />

                      {/* Motoren */}
                      <circle
                        cx="80"
                        cy="80"
                        r="15"
                        fill={selectedComponents.motors ? "#10b981" : "#6b7280"}
                        className="cursor-pointer hover:fill-blue-500 transition-colors motors-element"
                        onClick={() => setActiveComponent("motors")}
                        onMouseOver={() => {
                        const elements = document.getElementsByClassName('motors-element');
                        Array.from(elements).forEach(el => el.classList.add('fill-blue-500'));
                        const tooltip = document.getElementById('component-tooltip');
                        if (tooltip) {
                          tooltip.textContent = 'Motoren';
                          tooltip.style.opacity = '1';
                        }
                        }}
                        onMouseOut={() => {
                        const elements = document.getElementsByClassName('motors-element');
                        Array.from(elements).forEach(el => el.classList.remove('fill-blue-500'));
                        }}
                      />
                      <circle
                        cx="220"
                        cy="80"
                        r="15"
                        fill={selectedComponents.motors ? "#10b981" : "#6b7280"}
                        className="cursor-pointer hover:fill-blue-500 transition-colors motors-element"
                        onClick={() => setActiveComponent("motors")}
                        onMouseOver={() => {
                        const elements = document.getElementsByClassName('motors-element');
                        Array.from(elements).forEach(el => el.classList.add('fill-blue-500'));
                        const tooltip = document.getElementById('component-tooltip');
                        if (tooltip) {
                          tooltip.textContent = 'Motoren';
                          tooltip.style.opacity = '1';
                        }
                        }}
                        onMouseOut={() => {
                        const elements = document.getElementsByClassName('motors-element');
                        Array.from(elements).forEach(el => el.classList.remove('fill-blue-500'));
                        }}
                      />
                      <circle
                        cx="80"
                        cy="220"
                        r="15"
                        fill={selectedComponents.motors ? "#10b981" : "#6b7280"}
                        className="cursor-pointer hover:fill-blue-500 transition-colors motors-element"
                        onClick={() => setActiveComponent("motors")}
                        onMouseOver={() => {
                        const elements = document.getElementsByClassName('motors-element');
                        Array.from(elements).forEach(el => el.classList.add('fill-blue-500'));
                        const tooltip = document.getElementById('component-tooltip');
                        if (tooltip) {
                          tooltip.textContent = 'Motoren';
                          tooltip.style.opacity = '1';
                        }
                        }}
                        onMouseOut={() => {
                        const elements = document.getElementsByClassName('motors-element');
                        Array.from(elements).forEach(el => el.classList.remove('fill-blue-500'));
                        }}
                      />
                      <circle
                        cx="220"
                        cy="220"
                        r="15"
                        fill={selectedComponents.motors ? "#10b981" : "#6b7280"}
                        className="cursor-pointer hover:fill-blue-500 transition-colors motors-element"
                        onClick={() => setActiveComponent("motors")}
                        onMouseOver={() => {
                        const elements = document.getElementsByClassName('motors-element');
                        Array.from(elements).forEach(el => el.classList.add('fill-blue-500'));
                        const tooltip = document.getElementById('component-tooltip');
                        if (tooltip) {
                          tooltip.textContent = 'Motoren';
                          tooltip.style.opacity = '1';
                        }
                        }}
                        onMouseOut={() => {
                        const elements = document.getElementsByClassName('motors-element');
                        Array.from(elements).forEach(el => el.classList.remove('fill-blue-500'));
                        }}
                      />

                      {/* ESC */}
                      <rect
                        x="140"
                        y="140"
                        width="20"
                        height="20"
                        fill={selectedComponents.esc ? "#10b981" : "#6b7280"}
                        className="cursor-pointer hover:fill-blue-500 transition-colors esc-element"
                        onClick={() => setActiveComponent("esc")}
                        onMouseOver={() => {
                        const elements = document.getElementsByClassName('esc-element');
                        Array.from(elements).forEach(el => el.classList.add('fill-blue-500'));
                        const tooltip = document.getElementById('component-tooltip');
                        if (tooltip) {
                          tooltip.textContent = 'ESC';
                          tooltip.style.opacity = '1';
                        }
                        }}
                        onMouseOut={() => {
                        const elements = document.getElementsByClassName('esc-element');
                        Array.from(elements).forEach(el => el.classList.remove('fill-blue-500'));
                        }}
                      />

                      {/* Flight Controller */}
                      <rect
                        x="145"
                        y="145"
                        width="10"
                        height="10"
                        fill={selectedComponents.fc ? "#10b981" : "#6b7280"}
                        className="cursor-pointer hover:fill-blue-500 transition-colors fc-element"
                        onClick={() => setActiveComponent("fc")}
                        onMouseOver={() => {
                        const elements = document.getElementsByClassName('fc-element');
                        Array.from(elements).forEach(el => el.classList.add('fill-blue-500'));
                        const tooltip = document.getElementById('component-tooltip');
                        if (tooltip) {
                          tooltip.textContent = 'Flight Controller';
                          tooltip.style.opacity = '1';
                        }
                        }}
                        onMouseOut={() => {
                        const elements = document.getElementsByClassName('fc-element');
                        Array.from(elements).forEach(el => el.classList.remove('fill-blue-500'));
                        }}
                      />

                      {/* Propeller */}
                      <ellipse
                        cx="80"
                        cy="80"
                        rx="25"
                        ry="8"
                        fill={selectedComponents.props ? "#10b981" : "#6b7280"}
                        className="cursor-pointer hover:fill-blue-500 transition-colors props-element"
                        onClick={() => setActiveComponent("props")}
                        onMouseOver={() => {
                        const elements = document.getElementsByClassName('props-element');
                        Array.from(elements).forEach(el => el.classList.add('fill-blue-500'));
                        const tooltip = document.getElementById('component-tooltip');
                        if (tooltip) {
                          tooltip.textContent = 'Propeller';
                          tooltip.style.opacity = '1';
                        }
                        }}
                        onMouseOut={() => {
                        const elements = document.getElementsByClassName('props-element');
                        Array.from(elements).forEach(el => el.classList.remove('fill-blue-500'));
                        }}
                      />
                      <ellipse
                        cx="220"
                        cy="80"
                        rx="25"
                        ry="8"
                        fill={selectedComponents.props ? "#10b981" : "#6b7280"}
                        className="cursor-pointer hover:fill-blue-500 transition-colors props-element"
                        onClick={() => setActiveComponent("props")}
                        onMouseOver={() => {
                        const elements = document.getElementsByClassName('props-element');
                        Array.from(elements).forEach(el => el.classList.add('fill-blue-500'));
                        const tooltip = document.getElementById('component-tooltip');
                        if (tooltip) {
                          tooltip.textContent = 'Propeller';
                          tooltip.style.opacity = '1';
                        }
                        }}
                        onMouseOut={() => {
                        const elements = document.getElementsByClassName('props-element');
                        Array.from(elements).forEach(el => el.classList.remove('fill-blue-500'));
                        }}
                      />
                      <ellipse
                        cx="80"
                        cy="220"
                        rx="25"
                        ry="8"
                        fill={selectedComponents.props ? "#10b981" : "#6b7280"}
                        className="cursor-pointer hover:fill-blue-500 transition-colors props-element"
                        onClick={() => setActiveComponent("props")}
                        onMouseOver={() => {
                        const elements = document.getElementsByClassName('props-element');
                        Array.from(elements).forEach(el => el.classList.add('fill-blue-500'));
                        const tooltip = document.getElementById('component-tooltip');
                        if (tooltip) {
                          tooltip.textContent = 'Propeller';
                          tooltip.style.opacity = '1';
                        }
                        }}
                        onMouseOut={() => {
                        const elements = document.getElementsByClassName('props-element');
                        Array.from(elements).forEach(el => el.classList.remove('fill-blue-500'));
                        }}
                      />
                      <ellipse
                        cx="220"
                        cy="220"
                        rx="25"
                        ry="8"
                        fill={selectedComponents.props ? "#10b981" : "#6b7280"}
                        className="cursor-pointer hover:fill-blue-500 transition-colors props-element"
                        onClick={() => setActiveComponent("props")}
                        onMouseOver={() => {
                        const elements = document.getElementsByClassName('props-element');
                        Array.from(elements).forEach(el => el.classList.add('fill-blue-500'));
                        const tooltip = document.getElementById('component-tooltip');
                        if (tooltip) {
                          tooltip.textContent = 'Propeller';
                          tooltip.style.opacity = '1';
                        }
                        }}
                        onMouseOut={() => {
                        const elements = document.getElementsByClassName('props-element');
                        Array.from(elements).forEach(el => el.classList.remove('fill-blue-500'));
                        }}
                      />

                      {/* Akku */}
                      <rect
                        x="125"
                        y="180"
                        width="50"
                        height="15"
                        fill={selectedComponents.battery ? "#10b981" : "#6b7280"}
                        className="cursor-pointer hover:fill-blue-500 transition-colors battery-element"
                        onClick={() => setActiveComponent("battery")}
                        onMouseOver={() => {
                        const elements = document.getElementsByClassName('battery-element');
                        Array.from(elements).forEach(el => el.classList.add('fill-blue-500'));
                        const tooltip = document.getElementById('component-tooltip');
                        if (tooltip) {
                          tooltip.textContent = 'Akku';
                          tooltip.style.opacity = '1';
                        }
                        }}
                        onMouseOut={() => {
                        const elements = document.getElementsByClassName('battery-element');
                        Array.from(elements).forEach(el => el.classList.remove('fill-blue-500'));
                        }}
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
                          <CardTitle className="text-lg text-center lg:text-left">
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
                                className="flex flex-col lg:flex-row items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleComponentSelect(activeComponent, component)}
                              >
                                <div className="flex items-center w-full">
                                  <Image
                                    src={component.imageUrl}
                                    alt={component.name}
                                    width={80}
                                    height={80}
                                    className="w-16 h-16 lg:w-20 lg:h-20 rounded-lg mb-2 lg:mb-0 lg:mr-4 flex-shrink-0"
                                  />
                                  <div className="text-center lg:text-left flex-1">
                                    <h4 className="font-medium">{component.name}</h4>
                                    <p className="text-xs text-gray-500">Shop: {component.shop}</p>
                                    {component.description && (
                                      <div className="mt-2">
                                        <p className={`text-sm text-gray-600 transition-all duration-200 ${
                                          expandedDescriptions[index]
                                            ? 'line-clamp-none'
                                            : 'line-clamp-2'
                                        }`}>
                                          {component.description}
                                        </p>
                                        {component.description.length > 100 && (
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              toggleDescription(index)
                                            }}
                                            className="text-xs text-blue-500 hover:underline mt-1"
                                          >
                                            {expandedDescriptions[index] ? 'Weniger anzeigen' : 'Mehr anzeigen'}
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => openShop(e, component.link)}
                                  className="mt-2 ml-2 lg:mt-0 flex-shrink-0"
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

                  <div className="flex flex-col gap-2">
                    {/* Konfiguration & Einkaufsliste */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-center lg:text-left">Deine Konfiguration</h3>
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
                              <div key={type} className="flex flex-col lg:flex-row items-center justify-between p-2 border rounded">
                                <div className="text-center lg:text-left">
                                  <h4 className="font-medium text-sm">{component.name}</h4>
                                  <p className="text-xs text-gray-600">{component.shop}</p>
                                </div>
                                <div className="text-right mt-2 lg:mt-0">
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
                    </div>

                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Schweizer FPV Shops</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>fpvracing.ch</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => window.open("https://fpvracing.ch", "_blank")}
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
                            <div className="flex justify-between">
                              <span>fpv24.ch</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => window.open("https://www.fpv24.com/de", "_blank")}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </TabsContent>
          <TabsContent value="tutorial" className="space-y-6">
            <div className="w-full grid md:grid-cols-2 gap-2">
              <div className="space-y-2">
                <Link
                  href="https://youtu.be/V35DnyukOgY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                >
                  <Play className="h-4 w-4" />
                  Video Tutorial (Wir bauen die DJI O4 AIR UNIT Lite auf einen MICRO COPTER (er fliegt))
                </Link>
                <Link
                  href="https://www.youtube.com/watch?v=h1rkLJwKXps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                >
                  <Play className="h-4 w-4" />
                  Video Tutorial (Die Grundlagen zu LiPo Akkus! - FPV Grundlagen #6)
                </Link>
                <Link
                  href="https://www.youtube.com/watch?v=OH0RHBeMr4k"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                >
                  <Play className="h-4 w-4" />
                  Video Tutorial (Die coolsten 5" Motoren? 🚀)
                </Link>
                <Link
                  href="https://www.youtube.com/watch?v=E6nsJpuaTQc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                >
                  <Play className="h-4 w-4" />
                  Video Tutorial (How do you choose motor KV for a build? - FPV Questions)
                </Link>
                <Link
                  href="https://www.youtube.com/watch?v=RXW3I5SRrJs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                >
                  <Play className="h-4 w-4" />
                  Video Tutorial (Motoren - Teil 05: FPV Copter Technik Quickies)
                </Link>
                <Link
                  href="https://www.youtube.com/watch?v=RXW3I5SRrJs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                >
                  <Play className="h-4 w-4" />
                  Video Tutorial (DJI air unit 4)
                </Link>
                <Link
                  href="https://youtu.be/NoiqODFwU68?feature=shared"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                >
                  <Play className="h-4 w-4" />
                  Video Tutorial (How Do I Pick An ESC For My Flight Controller? - FPV Questions)
                </Link>
                <Link
                  href="https://www.youtube.com/watch?v=1jtcI5UXcAU"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                >
                  <Play className="h-4 w-4" />
                  Video Tutorial (Sub250g FPV Drone Build - 04 - DJI O4 Lite Install and Setup)
                </Link>
                <Link
                  href="https://www.youtube.com/watch?v=ksAHQfZGU6E"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                >
                  <Play className="h-4 w-4" />
                  Video Tutorial (So installieren Sie die DJI O4 Air Unit und O4 Air Unit Pro)
                </Link>
                <Link
                  href="https://www.youtube.com/watch?v=nX8vQ_faSes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                >
                  <Play className="h-4 w-4" />
                  Video Tutorial (So you want to build your first FPV drone? // DJI O4 Pro // Quadmula Djinn F25 SP //sub250g)
                </Link>
                <Link
                  href="https://www.youtube.com/watch?v=ExzR0098mgI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                >
                  <Play className="h-4 w-4" />
                  Video Tutorial (Build A Expensive DJI 04 FPV Drone That Is Practically Indestructible 🔥💪)
                </Link>
                <Link
                  href="hhttps://www.youtube.com/watch?v=R78j6z2r9Lw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                >
                  <Play className="h-4 w-4" />
                  Video Tutorial (FPV props and what you need to know!)
                </Link>
                <Link
                  href="https://www.youtube.com/watch?v=2tUazE5SSd0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                >
                  <Play className="h-4 w-4" />
                  Video Tutorial (Propeller - Teil 06: FPV Copter Technik Quickies)
                </Link>
                <Link
                  href="https://www.youtube.com/watch?v=XLvBsL73un8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                >
                  <Play className="h-4 w-4" />
                  Video Tutorial (Propeller an FPV Quad richtig anbringen und testen (und sich nicht zum Deppen machen))
                </Link>
                <Link
                  href="https://www.youtube.com/watch?v=epJ6L9MaXOQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                >
                  <Play className="h-4 w-4" />
                  Video Tutorial (How to choose the right props for your quadcopter: FPV Freestyle, Racing, and Long Range)
                </Link>
                <Link
                  href="https://www.youtube.com/watch?v=17eIl9JDoXI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                >
                  <Play className="h-4 w-4" />
                  Video Tutorial (FPV motors and what you need to know!)
                </Link>
                <Link
                  href="https://www.youtube.com/watch?v=25gTVz6ocQ0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                >
                  <Play className="h-4 w-4" />
                  Video Tutorial (Quadmula Djinn F25 SP + DJI O4: Tutorial zum Bau // MurdersFPV)
                </Link>
              </div>
              <div className="space-y-2">
                <Link
                  href="https://fpvframe.ch/learn-to-fly/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                >
                  <AppWindow className="h-4 w-4" />
                  Handbuch: Step by Step Guide for FPV Beginners
                </Link>

              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}