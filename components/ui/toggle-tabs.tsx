'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ToggleTabsProps {
  options: { value: string; label: string }[]
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export function ToggleTabs({
  options,
  value,
  onChange,
  className,
}: ToggleTabsProps) {
  const selectedIndex = options.findIndex((option) => option.value === value)

  return (
    <div
      className={cn(
        'bg-muted relative flex h-8 w-full rounded-md p-1',
        className,
      )}
    >
      <div
        className="bg-background absolute top-1 bottom-1 rounded-sm shadow-sm transition-all duration-200 ease-in-out"
        style={{
          left: `calc(${selectedIndex * 50}% + 4px)`,
          width: `calc(50% - 8px)`,
        }}
      />

      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange?.(option.value)}
          className={cn(
            'relative z-10 flex flex-1 items-center justify-center rounded-sm px-3 py-0 text-sm font-medium transition-colors duration-200 ease-in-out',
            'hover:text-foreground',
            value === option.value
              ? 'text-foreground'
              : 'text-muted-foreground',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
