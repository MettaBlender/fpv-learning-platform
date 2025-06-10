import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Play, FileText, ShoppingCart, Zap, Radio, Camera, Cpu, AppWindow } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const Controller = () => {
  return (
    <>
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
                <li>• 5GHz O4 Übertragung</li>
                <li>• Bis zu 6-15km Reichweite</li>
                <li>• 10 Stunden Akkulaufzeit</li>
              </ul>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Setup & Konfiguration:</h4>
                <div className="flex flex-col gap-2">
                    <Link
                    href="https://www.youtube.com/watch?v=3tMREwYGh7A&pp=ygUQZGppIGZwdiByZW1vdGUgMw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                  >
                    <Play className="h-4 w-4" />
                    Video Tutorial (DJI Controller 3 RICHTIG für FPV / MANUELL einstellen)
                  </Link>
                  <Link
                    href="https://www.youtube.com/watch?v=YPBy5JtkfTs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                  >
                    <Play className="h-4 w-4" />
                    Video Tutorial (DJI FPV Controller 3｜First Use)
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
    </>
  )
}

export default Controller