import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { Header } from "@/components/header"

export const metadata: Metadata = {
  title: "Genorama - Plataforma de Lanzamientos Musicales",
  description: "La plataforma definitiva para músicos y bandas. Descubre, vota y apoya nuevos lanzamientos musicales.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased min-h-screen bg-background`}>
        <Header />
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
