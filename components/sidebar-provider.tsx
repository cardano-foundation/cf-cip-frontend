'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'

import {
  DIRECTION_STORAGE_KEY,
  SORT_STORAGE_KEY,
  sortDirections,
  sortKey,
  sortOrders,
  type SortDirection,
  type SortOrder,
} from '@/lib/sidebar-sort'

export type { SortDirection, SortOrder }

type SidebarState = {
  query: string
  setQuery: (query: string) => void
  type: 'CIP' | 'CPS'
  setType: (type: 'CIP' | 'CPS') => void
  sort: SortOrder
  setSort: (sort: SortOrder) => void
  direction: SortDirection
  setDirection: (direction: SortDirection) => void
}

// Storage can be unavailable (private mode, blocked site data), so failures
// just fall back to the default sort.
function readStored<T extends string>(key: string, allowed: T[]) {
  try {
    const value = localStorage.getItem(key)
    return allowed.find((option) => option === value) ?? null
  } catch {
    return null
  }
}

function writeStored(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {}
}

const SidebarStateContext = createContext<SidebarState | null>(null)

export function useSidebarState() {
  const context = useContext(SidebarStateContext)
  if (!context) {
    throw new Error('useSidebarState must be used within SidebarStateProvider')
  }
  return context
}

export function SidebarStateProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<'CIP' | 'CPS'>('CIP')
  const [sort, setSortState] = useState<SortOrder>('number')
  const [direction, setDirectionState] = useState<SortDirection>('asc')
  const [restored, setRestored] = useState(false)

  // Restored after mount so the server-rendered list matches the first render;
  // until then the list is ordered by CSS from <html data-sort>
  useEffect(() => {
    const storedSort = readStored(SORT_STORAGE_KEY, sortOrders)
    const storedDirection = readStored(DIRECTION_STORAGE_KEY, sortDirections)
    if (storedSort) setSortState(storedSort)
    if (storedDirection) setDirectionState(storedDirection)
    setRestored(true)
  }, [])

  // Keep the CSS ordering in step with the rendered order once restored
  useEffect(() => {
    if (restored) {
      document.documentElement.dataset.sort = sortKey(sort, direction)
    }
  }, [restored, sort, direction])

  // Persisted only on user changes, so mounting never overwrites stored values
  const setSort = (value: SortOrder) => {
    setSortState(value)
    writeStored(SORT_STORAGE_KEY, value)
  }

  const setDirection = (value: SortDirection) => {
    setDirectionState(value)
    writeStored(DIRECTION_STORAGE_KEY, value)
  }

  return (
    <SidebarStateContext.Provider
      value={{
        query,
        setQuery,
        type,
        setType,
        sort,
        setSort,
        direction,
        setDirection,
      }}
    >
      {children}
    </SidebarStateContext.Provider>
  )
}
