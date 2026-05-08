import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-serif',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Karacabey Tekstil | Digital Fabric Showroom',
  description: 'Premium textile catalog with 400+ fabrics. Technical specifications, high-fidelity texture inspection, and wholesale ordering for curtains, upholstery, and home textiles.',
  keywords: ['fabric catalog', 'textile wholesale', 'velvet', 'satin', 'linen', 'jacquard', 'upholstery fabric', 'curtain fabric', 'Turkey textile', 'B2B fabric'],
  authors: [{ name: 'Karacabey Tekstil' }],
  openGraph: {
    title: 'Karacabey Tekstil | Digital Fabric Showroom',
    description: 'Premium textile catalog with technical specifications. Wholesale ordering for discerning clients.',
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['tr_TR', 'ru_RU'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Karacabey Tekstil | Digital Fabric Showroom',
    description: 'Premium textile catalog with technical specifications.',
  },
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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FCFAF5' },
    { media: '(prefers-color-scheme: dark)', color: '#0A1128' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${playfair.variable} ${geistMono.variable} bg-background overflow-y-auto`}>
      <body className="font-sans antialiased bg-background text-foreground selection:bg-slate-200 selection:text-slate-900 overflow-y-auto overflow-x-hidden">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
