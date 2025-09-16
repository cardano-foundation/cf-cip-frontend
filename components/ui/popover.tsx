'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type PopoverContextValue = {
  open: boolean
  setOpen: (v: boolean) => void
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null)

export function Popover({
  open: openProp,
  defaultOpen,
  onOpenChange,
  className,
  children,
}: React.PropsWithChildren<{
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (v: boolean) => void
  className?: string
}>) {
  const [open, setOpenState] = React.useState<boolean>(defaultOpen ?? false)
  const controlled = typeof openProp === 'boolean'
  const setOpen = React.useCallback(
    (v: boolean) => {
      if (!controlled) setOpenState(v)
      onOpenChange?.(v)
    },
    [controlled, onOpenChange],
  )
  const value = React.useMemo(
    () => ({ open: controlled ? (openProp as boolean) : open, setOpen }),
    [controlled, openProp, open, setOpen],
  )

  return (
    <PopoverContext.Provider value={value}>
      <div className={cn('relative inline-block w-full', className)}>
        {children}
      </div>
    </PopoverContext.Provider>
  )
}

export function PopoverTrigger({ children }: React.PropsWithChildren<{}>) {
  const ctx = React.useContext(PopoverContext)
  if (!ctx) throw new Error('PopoverTrigger must be used within Popover')
  const child = React.Children.only(children) as React.ReactElement<any>
  return React.cloneElement(child, {
    onClick: (e: React.MouseEvent) => {
      child.props?.onClick?.(e)
      ctx.setOpen(!ctx.open)
    },
    'aria-expanded': ctx.open,
  } as any)
}

export function PopoverContent({
  className,
  align = 'start',
  children,
}: React.PropsWithChildren<{ className?: string; align?: 'start' | 'end' }>) {
  const ctx = React.useContext(PopoverContext)
  const contentRef = React.useRef<HTMLDivElement>(null)

  if (!ctx) throw new Error('PopoverContent must be used within Popover')

  // Handle click outside to close popover
  React.useEffect(() => {
    if (!ctx.open) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(event.target as Node)
      ) {
        // Also check if click is on the trigger
        const trigger = contentRef.current.parentElement?.querySelector(
          '[aria-expanded="true"]',
        )
        if (trigger && !trigger.contains(event.target as Node)) {
          ctx.setOpen(false)
        }
      }
    }

    // Add slight delay to prevent immediate closure when opening
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 0)

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ctx])

  // Set width to match trigger element
  React.useEffect(() => {
    if (ctx.open && contentRef.current) {
      const trigger = contentRef.current.parentElement?.querySelector(
        '[aria-expanded="true"]',
      )
      if (trigger) {
        const triggerWidth = trigger.getBoundingClientRect().width
        contentRef.current.style.width = `${triggerWidth}px`
      }
    }
  }, [ctx.open])

  if (!ctx.open) return null

  return (
    <div
      ref={contentRef}
      role="dialog"
      className={cn(
        'bg-popover text-popover-foreground absolute z-50 mt-1 rounded-md border p-1 shadow-md outline-none',
        align === 'end' ? 'right-0' : 'left-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
