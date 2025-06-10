import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Play, FileText, ShoppingCart, Zap, Radio, Camera, Cpu, AppWindow } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const Components = () => {
  return (
    <>
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
                  <Link
                    href="https://www.youtube.com/shorts/X9s9U7uVI5M"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                  >
                    <Play className="h-4 w-4" />
                    Video Tutorial (Which drone frame is better?)
                  </Link>
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
                  <Link
                    href="https://www.youtube.com/watch?v=NoiqODFwU68"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                  >
                    <Play className="h-4 w-4" />
                    Video Tutorial (How Do I Pick An ESC For My Flight Controller? - FPV Questions)
                  </Link>
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
                  <Link
                    href="https://www.youtube.com/watch?v=xSOaeSd1AlM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                  >
                    <Play className="h-4 w-4" />
                    Video Tutorial (Flight controller basics for beginners)
                  </Link>
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
                  <Link
                    href="https://www.youtube.com/watch?v=epJ6L9MaXOQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                  >
                    <Play className="h-4 w-4" />
                    Video Tutorial (How to choose the right props for your quadcopter: FPV Freestyle, Racing, and Long Range)
                  </Link>
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
                  <Link
                    href="https://www.youtube.com/watch?v=h1rkLJwKXps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                  >
                    <Play className="h-4 w-4" />
                    Video Tutorial (Die Grundlagen zu LiPo Akkus! - FPV Grundlagen #6)
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Akku Tasche</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Image
                    src="https://fpvracing.ch/12060-large_default/betafpv-lipo-sicherheitstasche-165x90x120.jpg"
                    alt="LiPo Battery"
                    width={160}
                    height={120}
                    className="w-full rounded"
                  />
                  <p className="text-xs">Feuerfeste Aufbewahrungstasche für LiPo-Battterien. Ideal zum Laden von LiPo's, für den Transport und Reisen. </p>
                  <Badge variant="secondary">CHF 9</Badge>
                  <Link
                    href="https://www.youtube.com/watch?v=K2QQ2boHmZw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                  >
                    <Play className="h-4 w-4" />
                    Video Tutorial (Brandgefahr! Drohnen Akkus sicher aufbewahren mit dem Lipo Safe Bag z.B. DJI Mini 2 Lipo FPV Akkus)
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Betaflight</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Image
                    src="https://dl.flathub.org/media/io/github/betaflight.BetaflightConfigurator.desktop/d365efa464cecb095818db74d063ca60/screenshots/image-3_orig.webp"
                    alt="LiPo Battery"
                    width={160}
                    height={120}
                    className="w-full rounded"
                  />
                  <p className="text-xs">Betaflight is the world's leading multi-rotor flight control software.</p>
                  <Badge variant="secondary">CHF 0</Badge>
                  <Link
                    href="https://www.youtube.com/playlist?list=PLwoDb7WF6c8nT4jjsE4VENEmwu9x8zDiE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border rounded-lg px-3 py-2 text-sm text-blue-500 hover:bg-gray-100 flex items-center gap-1"
                  >
                    <Play className="h-4 w-4" />
                    Video Tutorial (Betaflight 4.3 Complete Walkthrough)
                  </Link>
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
    </>
  )
}

export default Components