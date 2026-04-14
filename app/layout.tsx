import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: {
    default: 'LFG GovScan — UK Government Spending Transparency',
    template: '%s | LFG GovScan',
  },
  description:
    'Track UK government contracts, spending, and public procurement data. Built with open government data by looking for growth.',
  openGraph: {
    title: 'LFG GovScan',
    description: 'UK Government Spending Transparency',
    siteName: 'LFG GovScan',
    locale: 'en_GB',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="flex flex-col min-h-screen font-dm">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
