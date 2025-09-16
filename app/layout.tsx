import './globals.css'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { ThemeProvider } from '@/components/theme-provider'
import { SidebarStateProvider } from '@/components/sidebar-provider'
import { CommandPaletteProvider } from '@/components/command-palette'

export const metadata = {
  metadataBase: new URL('https://cips.cardano.org'),
  title: 'Cardano Improvement Proposals',
  description:
    'Home of Cardano Improvement Proposals (CIPs) and Cardano Problem Statements (CPSs).',
  openGraph: {
    title: 'Cardano Improvement Proposals',
    description:
      'Home of Cardano Improvement Proposals (CIPs) and Cardano Problem Statements (CPSs).',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cardano Improvement Proposals',
    description:
      'Home of Cardano Improvement Proposals (CIPs) and Cardano Problem Statements (CPSs).',
    creator: '@Cardano_CF',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CommandPaletteProvider>
            <SidebarStateProvider>
              <SidebarProvider>
                <AppSidebar />
                <main className="flex w-full justify-center transition-[padding] duration-200 ease-linear md:pl-[300px] md:peer-data-[state=collapsed]:pl-0">
                  {children}
                </main>
              </SidebarProvider>
            </SidebarStateProvider>
          </CommandPaletteProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
