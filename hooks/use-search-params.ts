'use client'

import { useSearchParams, usePathname } from 'next/navigation'
import { useState, useMemo, useCallback, useDeferredValue, useEffect } from 'react'
import {
  getAllSearchableItems,
  getFilterOptions,
  searchItems,
  type SortOption,
} from '@/lib/search'

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Number (asc)', value: 'number-asc' },
  { label: 'Number (desc)', value: 'number-desc' },
  { label: 'Title (A-Z)', value: 'title-asc' },
  { label: 'Title (Z-A)', value: 'title-desc' },
  { label: 'Oldest first', value: 'created-asc' },
  { label: 'Newest first', value: 'created-desc' },
]

function parseParam(params: URLSearchParams, key: string): string[] {
  return params.get(key)?.split(',').filter(Boolean) || []
}

function buildQueryString(state: {
  query: string
  categories: string[]
  statuses: string[]
  types: string[]
  authors: string[]
  implementors: string[]
  sort: SortOption
}): string {
  const sp = new URLSearchParams()
  if (state.query) sp.set('q', state.query)
  if (state.categories.length > 0) sp.set('category', state.categories.join(','))
  if (state.statuses.length > 0) sp.set('status', state.statuses.join(','))
  if (state.types.length > 0) sp.set('type', state.types.join(','))
  if (state.authors.length > 0) sp.set('author', state.authors.join(','))
  if (state.implementors.length > 0) sp.set('implementor', state.implementors.join(','))
  if (state.sort !== 'number-asc') sp.set('sort', state.sort)
  const qs = sp.toString()
  return qs ? `?${qs}` : ''
}

export function useSearchState() {
  const initialParams = useSearchParams()
  const pathname = usePathname()

  // Initialize from URL, then manage locally
  const [query, setQuery] = useState(() => initialParams.get('q') || '')
  const [categories, setCategories] = useState(() => parseParam(initialParams, 'category'))
  const [statuses, setStatuses] = useState(() => parseParam(initialParams, 'status'))
  const [types, setTypes] = useState(() => parseParam(initialParams, 'type'))
  const [authors, setAuthors] = useState(() => parseParam(initialParams, 'author'))
  const [implementors, setImplementors] = useState(() => parseParam(initialParams, 'implementor'))
  const [sort, setSort] = useState<SortOption>(() => (initialParams.get('sort') as SortOption) || 'number-asc')

  // Sync local state when URL changes via navigation (e.g. command palette)
  useEffect(() => {
    setQuery(initialParams.get('q') || '')
    setCategories(parseParam(initialParams, 'category'))
    setStatuses(parseParam(initialParams, 'status'))
    setTypes(parseParam(initialParams, 'type'))
    setAuthors(parseParam(initialParams, 'author'))
    setImplementors(parseParam(initialParams, 'implementor'))
    setSort((initialParams.get('sort') as SortOption) || 'number-asc')
  }, [initialParams])

  const allItems = useMemo(() => getAllSearchableItems(), [])
  const filterOptions = useMemo(() => getFilterOptions(allItems), [allItems])

  const deferredQuery = useDeferredValue(query)

  const results = useMemo(
    () =>
      searchItems(
        allItems,
        deferredQuery,
        { categories, statuses, types, authors, implementors },
        sort,
      ),
    [allItems, deferredQuery, categories, statuses, types, authors, implementors, sort],
  )

  // Sync state to URL without triggering navigation
  const syncUrl = useCallback(
    (state: {
      query: string
      categories: string[]
      statuses: string[]
      types: string[]
      authors: string[]
      implementors: string[]
      sort: SortOption
    }) => {
      const qs = buildQueryString(state)
      window.history.replaceState(null, '', `${pathname}${qs}`)
    },
    [pathname],
  )

  const currentState = useCallback(
    () => ({ query, categories, statuses, types, authors, implementors, sort }),
    [query, categories, statuses, types, authors, implementors, sort],
  )

  const updateQuery = useCallback(
    (q: string) => {
      setQuery(q)
      syncUrl({ ...currentState(), query: q })
    },
    [syncUrl, currentState],
  )

  const updateCategories = useCallback(
    (cats: string[]) => {
      setCategories(cats)
      syncUrl({ ...currentState(), categories: cats })
    },
    [syncUrl, currentState],
  )

  const updateStatuses = useCallback(
    (stats: string[]) => {
      setStatuses(stats)
      syncUrl({ ...currentState(), statuses: stats })
    },
    [syncUrl, currentState],
  )

  const updateTypes = useCallback(
    (typs: string[]) => {
      setTypes(typs)
      syncUrl({ ...currentState(), types: typs })
    },
    [syncUrl, currentState],
  )

  const updateAuthors = useCallback(
    (auths: string[]) => {
      setAuthors(auths)
      syncUrl({ ...currentState(), authors: auths })
    },
    [syncUrl, currentState],
  )

  const updateImplementors = useCallback(
    (impls: string[]) => {
      setImplementors(impls)
      syncUrl({ ...currentState(), implementors: impls })
    },
    [syncUrl, currentState],
  )

  const updateSort = useCallback(
    (s: SortOption) => {
      setSort(s)
      syncUrl({ ...currentState(), sort: s })
    },
    [syncUrl, currentState],
  )

  const clearAll = useCallback(() => {
    setQuery('')
    setCategories([])
    setStatuses([])
    setTypes([])
    setAuthors([])
    setImplementors([])
    setSort('number-asc')
    window.history.replaceState(null, '', pathname)
  }, [pathname])

  return {
    query,
    categories,
    statuses,
    types,
    authors,
    implementors,
    sort,
    sortOptions: SORT_OPTIONS,
    results,
    filterOptions,
    allItems,
    setQuery: updateQuery,
    setCategories: updateCategories,
    setStatuses: updateStatuses,
    setTypes: updateTypes,
    setAuthors: updateAuthors,
    setImplementors: updateImplementors,
    setSort: updateSort,
    clearAll,
  }
}
