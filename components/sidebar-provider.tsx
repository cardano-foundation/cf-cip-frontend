'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type SidebarState = {
  query: string
  setQuery: (query: string) => void
  type: 'CIP' | 'CPS'
  setType: (type: 'CIP' | 'CPS') => void
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

  return (
    <SidebarStateContext.Provider value={{ query, setQuery, type, setType }}>
      {children}
    </SidebarStateContext.Provider>
  )
}
