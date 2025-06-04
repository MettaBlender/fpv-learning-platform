import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'fpv learning platform',
  description: 'A platform to learn about FPV drones',

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
