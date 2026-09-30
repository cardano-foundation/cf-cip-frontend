'use client'

import {
  Search as SearchIcon,
  Command,
  Info,
  Users,
  ArrowDownWideNarrow,
  ArrowDown,
  ArrowUp,
  Check,
} from 'lucide-react'
import { useMemo, useState, type CSSProperties } from 'react'
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ModeToggle } from '@/components/ui/mode-toggle'
import { ToggleTabs } from '@/components/ui/toggle-tabs'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FloatingIsland } from '@/components/floating-island'
import {
  useSidebarState,
  type SortDirection,
  type SortOrder,
} from '@/components/sidebar-provider'
import { CommandPalette, useCommandPalette } from '@/components/command-palette'
import { sortDirections, sortKey, sortOrders } from '@/lib/sidebar-sort'

type Item = {
  id: string
  title: string
  url: string
  number: number
  created: string
  updated: string
}

const sortOptions: { value: SortOrder; label: string }[] = [
  { value: 'number', label: 'Number' },
  { value: 'created', label: 'Created' },
  { value: 'updated', label: 'Updated' },
]

const directionOptions: {
  value: SortDirection
  label: string
  icon: typeof ArrowUp
}[] = [
  { value: 'asc', label: 'Ascending', icon: ArrowUp },
  { value: 'desc', label: 'Descending', icon: ArrowDown },
]

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

// Date ties fall back to the number so the order stays stable
const compareItems =
  (sort: SortOrder, direction: SortDirection) => (a: Item, b: Item) => {
    const sign = direction === 'asc' ? 1 : -1
    if (sort === 'number') return sign * (a.number - b.number)
    return (
      sign * (new Date(a[sort]).getTime() - new Date(b[sort]).getTime()) ||
      sign * (a.number - b.number)
    )
  }

const cipItems: Item[] = allCips.map((cip) => ({
  id: `CIP-${cip.CIP}`,
  title: cip.Title,
  url: `/cip/${cip.slug}`,
  number: cip.CIP,
  created: cip.Created,
  updated: cip.Updated,
}))

const cpsItems: Item[] = allCps.map((cps) => ({
  id: `CPS-${cps.CPS}`,
  title: cps.Title,
  url: `/cps/${cps.slug}`,
  number: cps.CPS,
  created: cps.Created,
  updated: cps.Updated,
}))

// Each item's position under every sort, exposed as --sort-<order>-<direction>
// so globals.css can order the list before hydration (see lib/sidebar-sort.ts)
const sortPositions = (items: Item[]) => {
  const positions: Record<string, Record<string, number>> = {}
  for (const sort of sortOrders) {
    for (const direction of sortDirections) {
      ;[...items].sort(compareItems(sort, direction)).forEach((item, i) => {
        positions[item.id] ??= {}
        positions[item.id][`--sort-${sortKey(sort, direction)}`] = i
      })
    }
  }
  return positions as Record<string, CSSProperties>
}

const cipPositions = sortPositions(cipItems)
const cpsPositions = sortPositions(cpsItems)

export function AppSidebar() {
  const {
    query,
    setQuery,
    type,
    setType,
    sort,
    setSort,
    direction,
    setDirection,
  } = useSidebarState()
  const isDefaultSort = sort === 'number' && direction === 'asc'
  const { open, setOpen } = useCommandPalette()
  const [sortOpen, setSortOpen] = useState(false)

  const items: Item[] = type === 'CIP' ? cipItems : cpsItems
  const positions = type === 'CIP' ? cipPositions : cpsPositions
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    const matches = q
      ? items.filter((i) => i.title.toLowerCase().includes(q))
      : items
    return [...matches].sort(compareItems(sort, direction))
  }, [items, query, sort, direction])

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
          <div className="flex items-center gap-2 px-3">
            <ToggleTabs
              options={[
                { value: 'CIP', label: 'CIP' },
                { value: 'CPS', label: 'CPS' },
              ]}
              value={type}
              onChange={(v) => setType(v as 'CIP' | 'CPS')}
            />
            <Popover
              open={sortOpen}
              onOpenChange={setSortOpen}
              className="w-auto shrink-0"
            >
              <PopoverTrigger>
                <button
                  type="button"
                  aria-label="Sort order"
                  className={cn(
                    'bg-muted hover:text-foreground relative flex size-8 items-center justify-center rounded-md transition-colors',
                    isDefaultSort ? 'text-muted-foreground' : 'text-foreground',
                  )}
                >
                  <ArrowDownWideNarrow className="size-4" />
                  {!isDefaultSort && (
                    <span className="bg-cf-blue-600 absolute top-1 right-1 size-1.5 rounded-full" />
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="!w-44">
                <div className="text-muted-foreground px-2 py-1.5 text-xs font-medium">
                  Sort by
                </div>
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSort(option.value)
                      // Dates read most naturally newest first
                      setDirection(option.value === 'number' ? 'asc' : 'desc')
                    }}
                    className="hover:bg-accent flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm"
                  >
                    {option.label}
                    {sort === option.value && <Check className="size-4" />}
                  </button>
                ))}
                <div className="bg-border -mx-1 my-1 h-px" />
                {directionOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDirection(option.value)}
                    className="hover:bg-accent flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <option.icon className="text-muted-foreground size-3.5" />
                      {option.label}
                    </span>
                    {direction === option.value && <Check className="size-4" />}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>
        </SidebarHeader>
        <SidebarSeparator className="mx-0 w-full" />
        <SidebarContent>
          <ScrollArea className="flex-1" maskHeight={0}>
            <SidebarGroup className="px-3 py-2">
              <SidebarGroupContent>
                <SidebarMenu>
                  {filtered.map((item) => (
                    <SidebarMenuItem
                      key={item.id}
                      data-sort-item
                      style={positions[item.id]}
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton asChild>
                            <Link
                              href={item.url}
                              className="grid w-full min-w-0 grid-cols-[auto_1fr] items-center gap-2"
                            >
                              <span className="font-mono text-xs opacity-70">
                                {item.id}
                              </span>
                              <span className="min-w-0 truncate">
                                {item.title}
                              </span>
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-sm">
                          <div className="font-medium">{item.id}</div>
                          <div className="text-xs opacity-90">{item.title}</div>
                          <div className="mt-1 text-xs opacity-70">
                            Created {formatDate(item.created)} · Updated{' '}
                            {formatDate(item.updated)}
                          </div>
                        </TooltipContent>
                      </Tooltip>
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
