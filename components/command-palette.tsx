'use client'

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext,
  useRef,
} from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Command as CommandIcon,
  Clock,
  X,
  Filter,
  Globe,
  GitBranch,
  ArrowUp,
  ArrowDown,
  CornerDownLeft,
  ArrowBigUp,
  Settings,
} from 'lucide-react'
import { allCips, allCps } from 'content-collections'

import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Combobox } from '@/components/ui/combobox'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useSidebarState } from '@/components/sidebar-provider'
import { useTheme } from 'next-themes'
import { ScrollArea } from '@/components/ui/scroll-area'

type Item = {
  id: string
  title: string
  url: string
  type: 'CIP' | 'CPS' | 'Page' | 'Contribute' | 'Other'
  content?: string
}

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const highlightSearchTerm = (
  text: string,
  searchTerm: string,
): React.ReactNode => {
  if (!searchTerm || !text) return text

  const regex = new RegExp(
    `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
    'gi',
  )
  const parts = text.split(regex)

  return parts.map((part, index) => {
    if (part.toLowerCase() === searchTerm.toLowerCase()) {
      return (
        <mark
          key={index}
          className="bg-cf-blue-100 text-cf-blue-900 dark:bg-cf-blue-900/50 dark:text-cf-blue-100 rounded px-0.5"
        >
          {part}
        </mark>
      )
    }
    return part
  })
}

const getContentSnippet = (
  content: string,
  searchTerm: string,
  maxLength: number = 100,
): string => {
  if (!content || !searchTerm) return ''

  const lowerContent = content.toLowerCase()
  const lowerTerm = searchTerm.toLowerCase()
  const index = lowerContent.indexOf(lowerTerm)

  if (index === -1) return ''

  const start = Math.max(0, index - Math.floor(maxLength / 2))
  const end = Math.min(content.length, start + maxLength)

  let snippet = content.slice(start, end)

  snippet = snippet
    .replace(/#{1,6}\s*/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .trim()

  // Add ellipsis if truncated
  if (start > 0) snippet = '...' + snippet
  if (end < content.length) snippet = snippet + '...'

  return snippet
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentItems, setRecentItems] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const { setQuery, setType } = useSidebarState()
  const router = useRouter()
  const { setTheme, theme } = useTheme()

  const categoryComboboxRef = useRef<HTMLButtonElement>(null)
  const statusComboboxRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const returnFocusToSearch = useCallback(() => {
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus()
      } else {
        const input = document.querySelector(
          '[data-command-input]',
        ) as HTMLInputElement
        if (input) {
          input.focus()
        }
      }
    }, 100)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('command-palette-recent')
    if (stored) {
      try {
        const parsedItems = JSON.parse(stored)
        const filteredItems = parsedItems.filter((id: string) => {
          return !id.startsWith('page-') && !id.startsWith('contribute-')
        })
        setRecentItems(filteredItems)
        if (filteredItems.length !== parsedItems.length) {
          localStorage.setItem(
            'command-palette-recent',
            JSON.stringify(filteredItems),
          )
        }
      } catch (e) {
        setRecentItems([])
      }
    }
  }, [])

  const memoizedRecentItems = useMemo(() => recentItems, [recentItems])

  const { categories, statuses } = useMemo(() => {
    const categorySet = new Set<string>()
    const statusSet = new Set<string>()

    allCips.forEach((cip) => {
      if (cip.Category) categorySet.add(cip.Category)
      if (cip.Status) statusSet.add(cip.Status.split(' ')[0].toLowerCase())
    })

    allCps.forEach((cps) => {
      if (cps.Category) categorySet.add(cps.Category)
      if (cps.Status) statusSet.add(cps.Status.toLowerCase())
    })

    return {
      categories: [
        { label: 'All Categories', value: '' },
        ...Array.from(categorySet)
          .sort()
          .map((cat) => ({ label: cat, value: cat })),
      ],
      statuses: [
        { label: 'All Statuses', value: '' },
        ...Array.from(statusSet)
          .sort()
          .map((status) => ({
            label: status.charAt(0).toUpperCase() + status.slice(1),
            value: status,
          })),
      ],
    }
  }, [])

  const sortedCips = [...allCips].sort((a, b) => a.CIP - b.CIP)
  const sortedCps = [...allCps].sort((a, b) => a.CPS - b.CPS)

  const allItems: Item[] = useMemo(
    () => [
      {
        id: 'page-about',
        title: 'About',
        url: '/',
        type: 'Page' as const,
      },
      {
        id: 'page-contributors',
        title: 'Contributors',
        url: '/contributors',
        type: 'Page' as const,
      },
      {
        id: 'contribute-website',
        title: 'Contribute to the website',
        url: 'https://github.com/cardano-foundation/cf-cip-frontend',
        type: 'Contribute' as const,
      },
      {
        id: 'contribute-cips',
        title: 'Contribute to CIPs',
        url: 'https://github.com/cardano-foundation/CIPs',
        type: 'Contribute' as const,
      },
      {
        id: 'theme-toggle',
        title:
          theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        url: '#',
        type: 'Other' as const,
      },
      ...sortedCips.map((cip) => ({
        id: `CIP-${cip.CIP}`,
        title: cip.Title,
        url: `/cip/${cip.slug}`,
        type: 'CIP' as const,
        content: cip.content || '',
      })),
      ...sortedCps.map((cps) => ({
        id: `CPS-${cps.CPS}`,
        title: cps.Title,
        url: `/cps/${cps.slug}`,
        type: 'CPS' as const,
        content: cps.content || '',
      })),
    ],
    [sortedCips, sortedCps, theme],
  )

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()

    const filteredByFilters = allItems.filter((item) => {
      if (
        item.type === 'Page' ||
        item.type === 'Contribute' ||
        item.type === 'Other'
      ) {
        return !selectedCategory && !selectedStatus
      }

      const originalData =
        item.type === 'CIP'
          ? allCips.find((cip) => `CIP-${cip.CIP}` === item.id)
          : allCps.find((cps) => `CPS-${cps.CPS}` === item.id)

      if (!originalData) return false

      if (selectedCategory) {
        if (
          !originalData.Category ||
          originalData.Category !== selectedCategory
        ) {
          return false
        }
      }

      if (selectedStatus) {
        let status: string | undefined
        if (item.type === 'CIP') {
          status = originalData.Status?.split(' ')[0].toLowerCase()
        } else {
          status = originalData.Status?.toLowerCase()
        }

        if (!status || status !== selectedStatus) {
          return false
        }
      }

      return true
    })

    if (!q) {
      if (selectedCategory || selectedStatus) {
        return filteredByFilters
      }

      const recentItemsData = memoizedRecentItems
        .map((id) => filteredByFilters.find((item) => item.id === id))
        .filter((item): item is Item => Boolean(item))
        .filter(
          (item) =>
            item.type !== 'Page' &&
            item.type !== 'Contribute' &&
            item.type !== 'Other',
        )

      const staticItems = filteredByFilters.filter(
        (item) =>
          item.type === 'Page' ||
          item.type === 'Contribute' ||
          item.type === 'Other',
      )

      return [...recentItemsData, ...staticItems]
    }

    // Enhanced search algorithm with scoring and full-text search
    const searchResults = filteredByFilters
      .map((item) => {
        const titleLower = item.title.toLowerCase()
        const idLower = item.id.toLowerCase()
        const contentLower = item.content?.toLowerCase() || ''

        let score = 0

        // Exact ID match gets highest score
        if (idLower === q) score += 100
        // ID starts with search gets high score
        else if (idLower.startsWith(q)) score += 80
        // ID contains search gets medium score
        else if (idLower.includes(q)) score += 60

        // Title starts with search gets high score
        if (titleLower.startsWith(q)) score += 70
        // Title contains search gets lower score
        else if (titleLower.includes(q)) score += 40

        // Word boundary matches get bonus
        const words = titleLower.split(/\s+/)
        if (words.some((word) => word.startsWith(q))) score += 20

        // Full-text content search (only for CIP/CPS items with content)
        if (item.content && (item.type === 'CIP' || item.type === 'CPS')) {
          // Exact phrase match in content gets medium score
          if (contentLower.includes(q)) {
            score += 30

            // Bonus for multiple occurrences
            const occurrences = (
              contentLower.match(
                new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
              ) || []
            ).length
            if (occurrences > 1) score += Math.min(occurrences * 5, 25) // Cap bonus at 25
          }

          // Word boundary matches in content
          const contentWords = contentLower.split(/\s+/)
          const matchingWords = contentWords.filter((word) =>
            word.includes(q),
          ).length
          if (matchingWords > 0) {
            score += Math.min(matchingWords * 2, 15) // Cap bonus at 15
          }

          // Bonus for matches in headers (lines starting with #)
          const lines = contentLower.split('\n')
          const headerMatches = lines.filter(
            (line) => line.trim().startsWith('#') && line.includes(q),
          ).length
          if (headerMatches > 0) score += headerMatches * 10
        }

        return { ...item, score }
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20) // Increase limit slightly for better full-text results

    return searchResults
  }, [allItems, search, memoizedRecentItems, selectedCategory, selectedStatus])

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  useEffect(() => {
    setSelectedIndex(0)
  }, [selectedCategory, selectedStatus])

  useEffect(() => {
    if (selectedIndex >= 0 && open) {
      const selectedElement = document.querySelector(
        `[data-item-index="${selectedIndex}"]`,
      )
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      }
    }
  }, [selectedIndex, open])

  const handleSelect = useCallback(
    (item: Item) => {
      if (
        item.type !== 'Page' &&
        item.type !== 'Contribute' &&
        item.type !== 'Other'
      ) {
        const newRecentItems = [
          item.id,
          ...recentItems.filter((id) => id !== item.id),
        ].slice(0, 5)
        setRecentItems(newRecentItems)
        localStorage.setItem(
          'command-palette-recent',
          JSON.stringify(newRecentItems),
        )
      }

      setTimeout(() => {
        if (
          item.type !== 'Page' &&
          item.type !== 'Contribute' &&
          item.type !== 'Other'
        ) {
          setType(item.type)
          setQuery('')
        }

        if (item.type === 'Other' && item.id === 'theme-toggle') {
          setTheme(theme === 'dark' ? 'light' : 'dark')
        } else if (item.type === 'Contribute') {
          window.open(item.url, '_blank', 'noopener,noreferrer')
        } else if (item.type !== 'Other') {
          router.push(item.url)
        }

        onOpenChange(false)
        setSearch('')
      }, 0)
    },
    [setType, setQuery, router, onOpenChange, recentItems, setTheme, theme],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => {
            const newIndex = Math.min(prev + 1, filtered.length - 1)
            return newIndex
          })
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => {
            const newIndex = Math.max(prev - 1, 0)
            return newIndex
          })
          break
        case 'Enter':
          e.preventDefault()
          setSelectedIndex((currentIndex) => {
            if (filtered[currentIndex]) {
              handleSelect(filtered[currentIndex])
            }
            return currentIndex
          })
          break
        case 'Escape':
          e.preventDefault()
          onOpenChange(false)
          break
        case 'c':
        case 'C':
          // Cmd+Shift+C for categories
          if (e.metaKey && e.shiftKey) {
            e.preventDefault()
            e.stopPropagation()
            console.log('Opening category combobox')
            categoryComboboxRef.current?.click()
          }
          break
        case 's':
        case 'S':
          // Cmd+Shift+S for status
          if (e.metaKey && e.shiftKey) {
            e.preventDefault()
            e.stopPropagation()
            console.log('Opening status combobox')
            statusComboboxRef.current?.click()
          }
          break
        case 'r':
        case 'R':
          // Cmd+R to reset all filters and search
          if (e.metaKey && !e.shiftKey) {
            e.preventDefault()
            e.stopPropagation()
            console.log('Resetting all filters and search')
            setSearch('')
            setSelectedCategory('')
            setSelectedStatus('')
            setSelectedIndex(0)
          }
          break
      }
    },
    [open, filtered, onOpenChange, handleSelect],
  )

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      onOpenChange(newOpen)
      if (!newOpen) {
        setSearch('')
        setSelectedIndex(0)
        setSelectedCategory('')
        setSelectedStatus('')
      }
    },
    [onOpenChange],
  )

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        const input = document.querySelector(
          '[data-command-input]',
        ) as HTMLInputElement
        if (input) {
          input.focus()
          const commandEl = input.closest('[cmdk-root]') as HTMLElement
          if (commandEl) {
            commandEl.focus()
          }
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.shiftKey) {
        if (e.key === 'C' || e.key === 'c') {
          e.preventDefault()
          e.stopPropagation()
          console.log('Global: Opening category combobox')
          categoryComboboxRef.current?.click()
        } else if (e.key === 'S' || e.key === 's') {
          e.preventDefault()
          e.stopPropagation()
          console.log('Global: Opening status combobox')
          statusComboboxRef.current?.click()
        }
      } else if (e.metaKey && !e.shiftKey && (e.key === 'R' || e.key === 'r')) {
        e.preventDefault()
        e.stopPropagation()
        console.log('Global: Resetting all filters and search')
        setSearch('')
        setSelectedCategory('')
        setSelectedStatus('')
        setSelectedIndex(0)
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown, true)
    return () =>
      document.removeEventListener('keydown', handleGlobalKeyDown, true)
  }, [open])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className={cn(
            'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-4 right-4 left-4 z-50 w-auto max-w-xl gap-0 overflow-hidden rounded-lg border p-0 shadow-lg duration-200 sm:top-[50%] sm:right-auto sm:left-[50%] sm:w-full sm:translate-x-[-50%] sm:translate-y-[-50%]',
          )}
        >
          <DialogTitle className="sr-only">Command Palette</DialogTitle>
          <div className="bg-background flex max-h-[600px] flex-col rounded-lg border-0 shadow-lg">
            <div className="shrink-0 border-b px-3 py-4">
              <div className="relative flex items-center">
                <Search className="text-muted-foreground/60 pointer-events-none absolute left-3 h-4 w-4" />
                <div className="w-full">
                  <Input
                    ref={searchInputRef}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search titles, IDs, and content..."
                    className="placeholder:text-muted-foreground/60 bg-muted/30 focus:bg-muted/50 focus:border-cf-blue-300 focus:ring-cf-blue-300/50 w-full rounded-md border-0 py-2.5 pr-4 pl-10 text-base focus:ring-1 focus:ring-offset-0"
                    data-command-input
                  />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="shrink-0 border-b px-3 py-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Combobox
                    ref={categoryComboboxRef}
                    options={categories}
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    placeholder="Category"
                    className="!flex !w-full !min-w-0"
                    onClose={returnFocusToSearch}
                  />
                  {selectedCategory && (
                    <button
                      onClick={() => {
                        setSelectedCategory('')
                        returnFocusToSearch()
                      }}
                      className="text-muted-foreground hover:text-foreground hover:bg-muted/50 absolute top-1/2 right-7 -translate-y-1/2 rounded-sm p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Combobox
                    ref={statusComboboxRef}
                    options={statuses}
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    placeholder="Status"
                    className="!flex !w-full !min-w-0"
                    onClose={returnFocusToSearch}
                  />
                  {selectedStatus && (
                    <button
                      onClick={() => {
                        setSelectedStatus('')
                        returnFocusToSearch()
                      }}
                      className="text-muted-foreground hover:text-foreground hover:bg-muted/50 absolute top-1/2 right-7 -translate-y-1/2 rounded-sm p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto">
              <ScrollArea className="h-96 w-full" maskHeight={0}>
                <div className="w-full max-w-full p-2">
                  {filtered.length === 0 &&
                  (search || selectedCategory || selectedStatus) ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Search className="text-muted-foreground/50 mb-3 h-8 w-8" />
                      <p className="text-muted-foreground mb-1 text-sm">
                        No results found
                      </p>
                      <p className="text-muted-foreground/70 text-xs">
                        Try different search terms or filters
                      </p>
                    </div>
                  ) : (
                    <>
                      {!search &&
                        !selectedCategory &&
                        !selectedStatus &&
                        memoizedRecentItems.length > 0 && (
                          <div className="mb-2 px-2">
                            <p className="text-muted-foreground/60 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
                              <Clock className="h-3.5 w-3.5" />
                              Recent
                            </p>
                          </div>
                        )}
                      {filtered.map((item, index) => {
                        const isRecent =
                          !search &&
                          !selectedCategory &&
                          !selectedStatus &&
                          memoizedRecentItems.includes(item.id)
                        const isFirstPage =
                          item.type === 'Page' &&
                          !search &&
                          !selectedCategory &&
                          !selectedStatus &&
                          (index === 0 || filtered[index - 1].type !== 'Page')

                        const isFirstContribute =
                          item.type === 'Contribute' &&
                          !search &&
                          !selectedCategory &&
                          !selectedStatus &&
                          (index === 0 ||
                            filtered[index - 1].type !== 'Contribute')

                        const isFirstOther =
                          item.type === 'Other' &&
                          !search &&
                          !selectedCategory &&
                          !selectedStatus &&
                          (index === 0 || filtered[index - 1].type !== 'Other')

                        return (
                          <div key={item.id}>
                            {isFirstPage && (
                              <div className="mt-4 mb-2 px-2">
                                <p className="text-muted-foreground/60 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
                                  <Globe className="h-3.5 w-3.5" />
                                  Pages
                                </p>
                              </div>
                            )}
                            {isFirstContribute && (
                              <div className="mt-4 mb-2 px-2">
                                <p className="text-muted-foreground/60 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
                                  <GitBranch className="h-3.5 w-3.5" />
                                  Contribute
                                </p>
                              </div>
                            )}
                            {isFirstOther && (
                              <div className="mt-4 mb-2 px-2">
                                <p className="text-muted-foreground/60 flex items-center gap-2 text-xs font-medium tracking-wide uppercase">
                                  <Settings className="h-3.5 w-3.5" />
                                  Other
                                </p>
                              </div>
                            )}
                            <div
                              key={`item-${item.id}`}
                              data-item-index={index}
                              onClick={() => handleSelect(item)}
                              className={cn(
                                'hover:bg-accent/50 mb-1 flex w-full max-w-full cursor-pointer flex-col gap-2 rounded-md px-3 py-3 transition-colors',
                                index === selectedIndex &&
                                  'bg-accent text-accent-foreground',
                              )}
                            >
                              <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3">
                                <span className="text-muted-foreground/80 font-mono text-xs font-medium">
                                  {item.id}
                                </span>
                                <span className="min-w-0 truncate text-sm">
                                  {item.title}
                                </span>
                                <span
                                  className={cn(
                                    'rounded px-1.5 py-0.5 text-xs font-medium',
                                    item.type === 'CIP'
                                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                      : item.type === 'CPS'
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                                        : item.type === 'Page'
                                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                                          : item.type === 'Other'
                                            ? 'bg-gray-100 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300'
                                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
                                  )}
                                >
                                  {item.type}
                                </span>
                              </div>
                              {search.length >= 3 &&
                                item.content &&
                                (item.type === 'CIP' || item.type === 'CPS') &&
                                (() => {
                                  const snippet = getContentSnippet(
                                    item.content,
                                    search,
                                  )
                                  return snippet ? (
                                    <div className="text-muted-foreground/70 text-xs leading-relaxed">
                                      {highlightSearchTerm(snippet, search)}
                                    </div>
                                  ) : null
                                })()}
                            </div>
                          </div>
                        )
                      })}
                    </>
                  )}
                </div>
              </ScrollArea>
            </div>

            <div className="text-muted-foreground/60 -mx-2 hidden shrink-0 border-t px-4 py-2 text-xs sm:block">
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1">
                    <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-0.5 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                      <CornerDownLeft className="h-3 w-3" />
                    </kbd>
                    <span className="text-muted-foreground/60">Open</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-0.5 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                      <CommandIcon className="h-3 w-3" />
                      <ArrowBigUp className="h-3 w-3" />
                      <span className="text-xs">C</span>
                    </kbd>
                    <span className="text-muted-foreground/60">Category</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-0.5 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                      <CommandIcon className="h-3 w-3" />
                      <ArrowBigUp className="h-3 w-3" />
                      <span className="text-xs">S</span>
                    </kbd>
                    <span className="text-muted-foreground/60">Status</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-0.5 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                      <CommandIcon className="h-3 w-3" />
                      <span className="text-xs">R</span>
                    </kbd>
                    <span className="text-muted-foreground/60">Reset</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  )
}

type CommandPaletteContextType = {
  open: boolean
  setOpen: (open: boolean) => void
}

const CommandPaletteContext = createContext<CommandPaletteContextType | null>(
  null,
)

export function CommandPaletteProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <CommandPaletteContext.Provider value={{ open, setOpen }}>
      {children}
    </CommandPaletteContext.Provider>
  )
}

export function useCommandPalette() {
  const context = useContext(CommandPaletteContext)
  if (!context) {
    throw new Error(
      'useCommandPalette must be used within CommandPaletteProvider',
    )
  }
  return context
}
