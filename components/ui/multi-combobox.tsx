'use client'

import {
  KeyboardEvent,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ChevronsUpDown, Check, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Command, CommandItem, CommandList } from '@/components/ui/command'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

type Option = { label: string; value: string }

export const MultiCombobox = forwardRef<
  HTMLButtonElement,
  {
    options: Option[]
    value?: string[]
    onChange?: (values: string[]) => void
    placeholder?: string
    className?: string
    onClose?: () => void
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      options,
      value = [],
      onChange,
      placeholder = 'Select...',
      className,
      onClose,
      onOpenChange,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const listRef = useRef<HTMLDivElement>(null)

    const selectedOptions = options.filter((option) =>
      value.includes(option.value),
    )

    const filteredOptions = useMemo(() => {
      if (!search) return options
      return options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase()),
      )
    }, [options, search])

    useEffect(() => {
      setSelectedIndex(0)
    }, [filteredOptions])

    useEffect(() => {
      if (!open) {
        setSearch('')
        setSelectedIndex(0)
      } else {
        const searchInput = document.querySelector(
          '[data-multi-combobox-search]',
        ) as HTMLInputElement
        if (searchInput) {
          setTimeout(() => searchInput.focus(), 0)
        }
      }
    }, [open])

    useEffect(() => {
      if (selectedIndex >= 0 && open) {
        const selectedElement = document.querySelector(
          `[data-multi-combobox-item="${selectedIndex}"]`,
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
      (optionValue: string) => {
        const newValue = value.includes(optionValue)
          ? value.filter((v) => v !== optionValue)
          : [...value, optionValue]
        onChange?.(newValue)
      },
      [value, onChange],
    )

    const handleOpenChange = useCallback(
      (newOpen: boolean) => {
        setOpen(newOpen)
        onOpenChange?.(newOpen)
        if (!newOpen && onClose) {
          setTimeout(() => onClose(), 0)
        }
      },
      [onClose, onOpenChange],
    )

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (!open) return

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault()
            setSelectedIndex((prev) =>
              Math.min(prev + 1, filteredOptions.length - 1),
            )
            break
          case 'ArrowUp':
            e.preventDefault()
            setSelectedIndex((prev) => Math.max(prev - 1, 0))
            break
          case 'Enter':
            e.preventDefault()
            if (filteredOptions[selectedIndex]) {
              handleSelect(filteredOptions[selectedIndex].value)
            }
            break
          case 'Escape':
            e.preventDefault()
            handleOpenChange(false)
            break
        }
      },
      [open, filteredOptions, selectedIndex, handleSelect, handleOpenChange],
    )

    const getDisplayText = () => {
      if (selectedOptions.length === 0) {
        return <span className="text-muted-foreground">{placeholder}</span>
      }
      if (selectedOptions.length === 1) {
        return selectedOptions[0].label
      }
      return `${selectedOptions.length} selected`
    }

    return (
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'bg-background !flex h-8 !w-full min-w-0 justify-between',
              className,
            )}
          >
            <span className="truncate">{getDisplayText()}</span>
            <ChevronsUpDown className="ml-2 size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            {/* Search Input */}
            <div className="border-b px-3 py-2">
              <div className="relative">
                <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 opacity-50" />
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="placeholder:text-muted-foreground bg-background h-8 w-full border pr-2 pl-8 text-sm focus-visible:ring-1"
                  data-multi-combobox-search
                />
              </div>
            </div>

            <ScrollArea className="h-[200px]" maskHeight={0}>
              <CommandList
                ref={listRef}
                className="max-h-none overflow-visible p-2"
              >
                {filteredOptions.length === 0 && search ? (
                  <div className="text-muted-foreground py-6 text-center text-sm">
                    No results found.
                  </div>
                ) : (
                  filteredOptions.map((opt, index) => (
                    <CommandItem
                      key={opt.value}
                      onSelect={() => handleSelect(opt.value)}
                      className={cn(
                        'mb-1 cursor-pointer rounded-md px-2 py-2 last:mb-0',
                        index === selectedIndex &&
                          'bg-accent text-accent-foreground',
                      )}
                      data-multi-combobox-item={index}
                    >
                      <Check
                        className={cn(
                          'mr-2 size-4',
                          value.includes(opt.value)
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      {opt.label}
                    </CommandItem>
                  ))
                )}
              </CommandList>
            </ScrollArea>

            {/* Selected items display */}
            {selectedOptions.length > 0 && (
              <div className="border-t p-2">
                <div className="flex flex-wrap gap-1">
                  {selectedOptions.map((option) => (
                    <div
                      key={option.value}
                      className="bg-muted text-muted-foreground flex items-center gap-1 rounded px-2 py-1 text-xs"
                    >
                      <span>{option.label}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelect(option.value)
                        }}
                        className="hover:text-foreground ring-offset-background focus:ring-ring ml-1 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    )
  },
)

MultiCombobox.displayName = 'MultiCombobox'
