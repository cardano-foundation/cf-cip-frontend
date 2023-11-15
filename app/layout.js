import './globals.css'
import { Chivo } from 'next/font/google'
import Navigation from '@/components/Navigation'

const chivo = Chivo({ subsets: ['latin'] })

export const metadata = {
  title: 'Cardano Implementation Proposals',
  description: 'CIPs',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${chivo.className} bg-cf-blue-900`}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
