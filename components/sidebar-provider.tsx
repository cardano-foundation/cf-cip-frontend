'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type SortOrder = 'number' | 'created' | 'updated'
export type SortDirection = 'asc' | 'desc'

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
  const [sort, setSort] = useState<SortOrder>('number')
  const [direction, setDirection] = useState<SortDirection>('asc')

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
