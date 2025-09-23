'use client'

import { Search as SearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { useCommandPalette } from '@/components/command-palette'
import { useIsMobile } from '@/hooks/use-mobile'

export function FloatingIsland() {
  const { state } = useSidebar()
  const { setOpen } = useCommandPalette()
  const isMobile = useIsMobile()

  if (!isMobile && state !== 'collapsed') return null

  return (
    <div className="bg-sidebar fixed top-4 left-4 z-50 flex items-center gap-1 rounded-md border p-1 shadow-md">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="h-4 w-4" />
      </Button>
      <SidebarTrigger className="h-7 w-7" />
    </div>
  )
}
