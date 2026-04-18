import type { Metadata, Viewport } from 'next'
import { Inter, Dancing_Script, Funnel_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const dancingScript = Dancing_Script({ 
  subsets: ['latin'],
  variable: '--font-dancing',
})

const funnelDisplay = Funnel_Display({ 
  subsets: ['latin'],
  variable: '--font-funnel',
})

export const metadata: Metadata = {
  title: 'Stewardship5 - The 5 T\'s Self-Evaluation',
  description: 'A real-time self-evaluation app for assessing your stewardship in Time, Talent, Treasure, Temple, and Testimony.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-background">
      <body className={`${inter.variable} ${dancingScript.variable} ${funnelDisplay.variable} font-sans antialiased min-h-screen`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
