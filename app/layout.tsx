import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Voir comme une machine : IA, vision et TinyML sur le XIAO',
  description:
    'Une exploration interactive et détaillée de la façon dont les machines voient les images, dont les classificateurs apprennent, dont les CNN fonctionnent, et de l’entraînement et du déploiement d’un modèle TinyML sur la carte Seeed Studio XIAO.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#fbfbf9',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
