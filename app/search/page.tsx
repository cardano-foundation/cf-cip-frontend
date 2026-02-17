'use client'

import { Suspense, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  Search,
  X,
  SearchX,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { highlightSearchTerm, getContentSnippet } from '@/lib/search'
import type { SortOption } from '@/lib/search'
import { useSearchState } from '@/hooks/use-search-params'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MultiCombobox } from '@/components/ui/multi-combobox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

function SortSelect({
  value,
  options,
  onChange,
}: {
  value: SortOption
  options: { label: string; value: SortOption }[]
  onChange: (value: SortOption) => void
}) {
  const [open, setOpen] = useState(false)
  const currentLabel = options.find((o) => o.value === value)?.label || 'Sort'

  return (
    <Popover open={open} onOpenChange={setOpen} className="w-auto">
      <PopoverTrigger>
        <Button
          variant="outline"
          size="sm"
          className="bg-background h-8 gap-1.5 px-3 text-xs font-medium"
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
          {currentLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="!w-44 p-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              onChange(opt.value)
              setOpen(false)
            }}
            className={cn(
              'hover:bg-accent flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-xs transition-colors',
              value === opt.value && 'bg-accent',
            )}
          >
            <Check
              className={cn(
                'h-3.5 w-3.5',
                value === opt.value ? 'opacity-100' : 'opacity-0',
              )}
            />
            {opt.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  )
}

function SearchPageContent() {
  const {
    query,
    categories,
    statuses,
    types,
    authors,
    implementors,
    sort,
    sortOptions,
    results,
    filterOptions,
    setQuery,
    setCategories,
    setStatuses,
    setTypes,
    setAuthors,
    setImplementors,
    setSort,
    clearAll,
  } = useSearchState()

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value)
    },
    [setQuery],
  )

  const hasActiveFilters =
    query.length > 0 ||
    categories.length > 0 ||
    statuses.length > 0 ||
    types.length > 0 ||
    authors.length > 0 ||
    implementors.length > 0

  const handleClearAll = useCallback(() => {
    clearAll()
  }, [clearAll])

  const allPills = [
    ...categories.map((v) => ({ key: `cat-${v}`, label: v, remove: () => setCategories(categories.filter((c) => c !== v)) })),
    ...statuses.map((v) => ({ key: `stat-${v}`, label: v.charAt(0).toUpperCase() + v.slice(1), remove: () => setStatuses(statuses.filter((s) => s !== v)) })),
    ...types.map((v) => ({ key: `type-${v}`, label: v, remove: () => setTypes(types.filter((t) => t !== v)) })),
    ...authors.map((v) => ({ key: `auth-${v}`, label: v, remove: () => setAuthors(authors.filter((a) => a !== v)) })),
    ...implementors.map((v) => ({ key: `impl-${v}`, label: v, remove: () => setImplementors(implementors.filter((i) => i !== v)) })),
  ]

  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full justify-center pt-16 pb-8">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="space-y-6">
          <header>
            <h1 className="text-4xl leading-tight font-bold tracking-tight sm:text-5xl">
              Advanced Search
            </h1>
          </header>

          {/* Search input */}
          <div className="relative">
            <Search className="text-muted-foreground/60 pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
            <Input
              value={query}
              onChange={handleInputChange}
              placeholder="Search CIPs and CPSs by title, ID, or content..."
              className="h-12 w-full rounded-lg pl-12 text-base"
              autoFocus
            />
          </div>

          {/* Filter bar */}
          <div className="bg-muted/30 rounded-lg border p-3">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="text-muted-foreground h-3.5 w-3.5" />
                <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                  Filters
                </span>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-muted-foreground h-6 px-2 text-xs"
                  >
                    <X className="mr-1 h-3 w-3" />
                    Clear all
                  </Button>
                )}
              </div>
              <SortSelect
                value={sort}
                options={sortOptions}
                onChange={setSort}
              />
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <MultiCombobox
                options={filterOptions.types}
                value={types}
                onChange={setTypes}
                placeholder="Type"
                className="!flex !w-full !min-w-0"
              />
              <MultiCombobox
                options={filterOptions.statuses}
                value={statuses}
                onChange={setStatuses}
                placeholder="Status"
                className="!flex !w-full !min-w-0"
              />
              <MultiCombobox
                options={filterOptions.categories}
                value={categories}
                onChange={setCategories}
                placeholder="Category"
                className="!flex !w-full !min-w-0"
              />
            </div>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <MultiCombobox
                options={filterOptions.authors}
                value={authors}
                onChange={setAuthors}
                placeholder="Author"
                className="!flex !w-full !min-w-0"
              />
              <MultiCombobox
                options={filterOptions.implementors}
                value={implementors}
                onChange={setImplementors}
                placeholder="Implementor"
                className="!flex !w-full !min-w-0"
              />
            </div>
          </div>

          {/* Results summary + filter pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground text-sm">
              {results.length} {results.length === 1 ? 'result' : 'results'}
              {query && (
                <>
                  {' '}
                  for &ldquo;{query}&rdquo;
                </>
              )}
            </span>
            {allPills.map((pill) => (
              <button
                key={pill.key}
                onClick={pill.remove}
                className="bg-muted text-muted-foreground hover:bg-muted/80 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs transition-colors"
              >
                {pill.label}
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>

          {/* Results list */}
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <SearchX className="text-muted-foreground/40 mb-4 h-12 w-12" />
              <p className="text-muted-foreground mb-1 text-lg font-medium">
                No results found
              </p>
              <p className="text-muted-foreground/70 text-sm">
                Try different search terms or filters
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((item) => {
                const snippet =
                  query.length >= 3
                    ? getContentSnippet(item.content, query, 160)
                    : ''

                return (
                  <Link
                    key={item.id}
                    href={item.url}
                    className="hover:bg-accent/50 border-border block rounded-lg border px-4 py-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground/80 font-mono text-xs font-medium">
                        {item.id}
                      </span>
                      <span
                        className={cn(
                          'rounded px-1.5 py-0.5 text-xs font-medium',
                          item.type === 'CIP'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
                        )}
                      >
                        {item.type}
                      </span>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset',
                          item.statusBadgeColor,
                        )}
                      >
                        {item.status.charAt(0).toUpperCase() +
                          item.status.slice(1)}
                      </span>
                      {item.category && (
                        <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs font-medium">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-sm font-medium">
                      {query
                        ? highlightSearchTerm(item.title, query)
                        : item.title}
                    </div>
                    {snippet && (
                      <div className="text-muted-foreground/70 mt-1 text-xs leading-relaxed">
                        {highlightSearchTerm(snippet, query)}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageContent />
    </Suspense>
  )
}
