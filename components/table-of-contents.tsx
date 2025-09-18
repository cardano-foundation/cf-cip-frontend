'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronRightIcon, BookOpenIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeadingData {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  className?: string
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<HeadingData[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const activeElementRef = useRef<HTMLButtonElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const headingData: HeadingData[] = []

    headingElements.forEach((heading) => {
      if (heading.id) {
        headingData.push({
          id: heading.id,
          text: heading.textContent || '',
          level: parseInt(heading.tagName.substring(1)),
        })
      }
    })

    setHeadings(headingData)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)

            const currentIndex = headings.findIndex(
              (h) => h.id === entry.target.id,
            )
            if (currentIndex !== -1) {
              const progress = ((currentIndex + 1) / headings.length) * 100
              setReadingProgress(Math.round(progress))
            }
          }
        })
      },
      {
        rootMargin: '-100px 0px -80% 0px',
      },
    )

    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [headings])

  useEffect(() => {
    if (
      activeId &&
      activeElementRef.current &&
      scrollAreaRef.current &&
      !isCollapsed
    ) {
      const activeElement = activeElementRef.current
      const scrollContainer = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]',
      )

      if (scrollContainer) {
        const containerRect = scrollContainer.getBoundingClientRect()
        const elementRect = activeElement.getBoundingClientRect()

        const isAbove = elementRect.top < containerRect.top
        const isBelow = elementRect.bottom > containerRect.bottom

        if (isAbove || isBelow) {
          const elementTop = activeElement.offsetTop
          const containerHeight = scrollContainer.clientHeight
          const elementHeight = activeElement.offsetHeight
          const scrollTop = elementTop - containerHeight / 2 + elementHeight / 2

          scrollContainer.scrollTo({
            top: Math.max(0, scrollTop),
            behavior: 'smooth',
          })
        }
      }
    }
  }, [activeId, isCollapsed])

  if (headings.length === 0) {
    return null
  }

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const yOffset = -100
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })

      console.log('update')
      const { pathname, search } = window.location
      window.history.replaceState(null, '', `${pathname}${search}#${id}`)
    }
  }

  return (
    <div
      className={cn(
        'bg-card/50 border-border/50 sticky top-24 min-w-0 overflow-hidden rounded-xl border backdrop-blur-sm',
        className,
      )}
    >
      <div className="border-border/50 border-b p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
            <BookOpenIcon className="h-4 w-4" />
            <span>Table of Contents</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-mono text-xs">
              {readingProgress}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hover:bg-accent/50 h-6 w-6 p-0"
            >
              <ChevronRightIcon
                className={cn(
                  'h-3 w-3 transition-transform duration-200',
                  !isCollapsed && 'rotate-90',
                )}
              />
            </Button>
          </div>
        </div>

        <div className="bg-muted/50 h-1.5 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      </div>

      {!isCollapsed && (
        <div>
          <ScrollArea ref={scrollAreaRef} className="h-[60vh]" maskHeight={0}>
            <nav className="space-y-0.5 p-2">
              {headings.map((heading, index) => (
                <button
                  key={heading.id}
                  ref={activeId === heading.id ? activeElementRef : null}
                  onClick={() => scrollToHeading(heading.id)}
                  className={cn(
                    'group hover:bg-accent/60 hover:text-accent-foreground w-full rounded-md px-3 py-2 text-left transition-colors',
                    activeId === heading.id
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground',
                    heading.level === 1 && 'text-sm font-semibold',
                    heading.level === 2 && 'pl-4 text-sm font-medium',
                    heading.level === 3 && 'pl-6 text-sm',
                    heading.level === 4 && 'pl-8 text-xs',
                    heading.level >= 5 && 'pl-10 text-xs opacity-80',
                  )}
                >
                  {/* Heading text with wrapping */}
                  <span className="block leading-relaxed break-words">
                    {heading.text}
                  </span>
                </button>
              ))}
            </nav>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
