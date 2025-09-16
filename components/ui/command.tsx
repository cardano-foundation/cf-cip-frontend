'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

export function Command({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn('w-full', className)}>{children}</div>
}

export function CommandInput({
  value,
  onValueChange,
  placeholder,
  className,
}: {
  value: string
  onValueChange: (v: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <Input
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      placeholder={placeholder}
      className={cn('h-8', className)}
    />
  )
}

export const CommandList = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{ className?: string }>
>(({ className, children }, ref) => {
  return (
    <div ref={ref} className={cn('max-h-60 overflow-auto', className)}>
      {children}
    </div>
  )
})
CommandList.displayName = 'CommandList'

export function CommandEmpty({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="text-muted-foreground px-2 py-1 text-sm">{children}</div>
  )
}

export function CommandItem({
  children,
  onSelect,
  active,
  className,
  ...props
}: React.PropsWithChildren<{
  onSelect: () => void
  active?: boolean
  className?: string
}> &
  React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-start rounded-sm px-2 py-1 text-left text-sm',
        active && 'bg-accent text-accent-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
