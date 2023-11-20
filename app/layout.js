import './globals.css'
import { Chivo } from 'next/font/google'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const chivo = Chivo({ subsets: ['latin'] })

export const metadata = {
  title: 'Cardano Improvement Proposals',
  description: 'Home of Cardano Improvement Proposals (CIPs) and Cardano Problem Statements (CPSs).'}

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
