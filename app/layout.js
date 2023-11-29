import './globals.css'
import { Chivo } from 'next/font/google'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const chivo = Chivo({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://cips.cardano.org'),
  title: 'Cardano Improvement Proposals',
  description: 'Home of Cardano Improvement Proposals (CIPs) and Cardano Problem Statements (CPSs).',
  openGraph: {
    title: 'Cardano Improvement Proposals',
    description: 'Home of Cardano Improvement Proposals (CIPs) and Cardano Problem Statements (CPSs).',
  },
  twitter: {
    card: "summary_large_image",
    title: "Cardano Improvement Proposals",
    description: "Home of Cardano Improvement Proposals (CIPs) and Cardano Problem Statements (CPSs).",
    creator: "@Cardano_CF",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${chivo.className} bg-cf-blue-900`}>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  )
}
