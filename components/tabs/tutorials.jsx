import { ExternalLink, Play, FileText, ShoppingCart, Zap, Radio, Camera, Cpu, AppWindow } from "lucide-react"
import Link from "next/link"
import { videoTutorials } from "@/components/tabs/Videos"
import { Handbuch } from "@/components/tabs/Handbuch"

const Tutorials = () => {
  return (
    <>
      <div className="w-full grid md:grid-cols-2 gap-2">
        <div className="space-y-2">
          {videoTutorials?.map((video, index) => (
            <Link
              key={index}
              href={video.video}
              target="_blank"
              rel="noopener noreferrer"
              className="border rounded-lg px-3 py-2 shadow-sm text-sm text-foreground bg-background hover:bg-gray-300 dark:hover:bg-gray-700 border-[#bdc4cc]/10 hover:border-[#bdc4cc]/80 hover:shadow-xl flex items-center gap-1"
            >
              <Play className="h-4 w-4" />
              Video Tutorial: ({video.titel})
            </Link>
          ))}
        </div>
        <div className="space-y-2">
          {Handbuch?.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="border rounded-lg px-3 py-2 shadow-sm text-sm text-foreground bg-background hover:bg-gray-300 dark:hover:bg-gray-700 border-[#bdc4cc]/10 hover:border-[#bdc4cc]/80 hover:shadow-xl flex items-center gap-1"
            >
              <FileText className="h-4 w-4" />
              Handbuch: ({item.titel})
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

export default Tutorials