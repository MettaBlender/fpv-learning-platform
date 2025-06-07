import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Play, FileText, ShoppingCart, Zap, Radio, Camera, Cpu, AppWindow } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const Googles = () => {
  return (
    <>
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
    </>
  )
}

export default Googles