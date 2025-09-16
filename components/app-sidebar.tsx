'use client'

import { Search as SearchIcon, Command, Info, Users } from 'lucide-react'
import { useMemo } from 'react'
import Link from 'next/link'
import { allCips, allCps } from 'content-collections'
import socialsData from '@/data/socials.json'

import Logo from '@/components/logo'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { ToggleTabs } from '@/components/ui/toggle-tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FloatingIsland } from '@/components/floating-island'
import { useSidebarState } from '@/components/sidebar-provider'
import { CommandPalette, useCommandPalette } from '@/components/command-palette'

type Item = { id: string; title: string; url: string }

export function AppSidebar() {
  const { query, setQuery, type, setType } = useSidebarState()
  const { open, setOpen } = useCommandPalette()

  const sortedCips = [...allCips].sort((a, b) => a.CIP - b.CIP)
  const sortedCps = [...allCps].sort((a, b) => a.CPS - b.CPS)

  const cipItems: Item[] = sortedCips.map((cip) => ({
    id: `CIP-${cip.CIP}`,
    title: cip.Title,
    url: `/cip/${cip.slug}`,
  }))

  const cpsItems: Item[] = sortedCps.map((cps) => ({
    id: `CPS-${cps.CPS}`,
    title: cps.Title,
    url: `/cps/${cps.slug}`,
  }))

  const items: Item[] = type === 'CIP' ? cipItems : cpsItems
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return items
    return items.filter((i) => i.title.toLowerCase().includes(q))
  }, [items, query])

  return (
    <>
      <FloatingIsland />
      <CommandPalette open={open} onOpenChange={setOpen} />
      <Sidebar className="w-[300px] max-w-[300px] min-w-[300px]">
        <SidebarHeader className="gap-4 py-4">
          <div className="flex items-center justify-between px-3">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="text-cf-blue-600 h-8 w-8 dark:text-white" />
            </Link>
            <SidebarTrigger />
          </div>
          <div className="px-3">
            <div className="relative">
              <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2" />
              <Input
                placeholder="Search"
                className="focus:border-cf-blue-300 focus:ring-cf-blue-300/50 h-8 cursor-pointer pr-16 pl-8 focus:ring-1"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onClick={() => setOpen(true)}
                readOnly
              />
              <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
                <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                  <Command className="h-3 w-3" />
                  <span className="text-xs">K</span>
                </kbd>
              </div>
            </div>
          </div>
          <div className="px-3">
            <ToggleTabs
              options={[
                { value: 'CIP', label: 'CIP' },
                { value: 'CPS', label: 'CPS' },
              ]}
              value={type}
              onChange={(v) => setType(v as 'CIP' | 'CPS')}
            />
          </div>
        </SidebarHeader>
        <SidebarSeparator className="mx-0 w-full" />
        <SidebarContent>
          <ScrollArea className="flex-1" maskHeight={0}>
            <SidebarGroup className="px-3 py-2">
              <SidebarGroupContent>
                <SidebarMenu>
                  {filtered.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          className="grid w-full min-w-0 grid-cols-[auto_1fr] items-center gap-2"
                        >
                          <span className="font-mono text-xs opacity-70">
                            {item.id}
                          </span>
                          <span className="min-w-0 truncate">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </ScrollArea>
        </SidebarContent>

        <SidebarSeparator className="mx-0 w-full" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/" className="flex min-w-0 items-center gap-2">
                    <Info className="size-4 shrink-0 opacity-70" />
                    <span className="truncate">About</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/contributors"
                    className="flex min-w-0 items-center gap-2"
                  >
                    <Users className="size-4 shrink-0 opacity-70" />
                    <span className="truncate">Contributors</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-0 w-full" />
        <SidebarFooter>
          <div className="flex items-center justify-between px-3">
            <div className="text-muted-foreground flex items-center gap-1">
              {socialsData.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground inline-flex h-6 w-6 items-center justify-center rounded-md"
                  aria-label={social.name}
                >
                  <svg
                    className="size-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d={social.svg} />
                  </svg>
                </a>
              ))}
            </div>
            <ModeToggle />
          </div>
          <div className="px-3">
            <p className="text-muted-foreground text-center text-xs">
              © {new Date().getFullYear()} Cardano Foundation
            </p>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  )
}
