'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { allCips } from 'content-collections'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function CipSidebar() {
  const pathname = usePathname()
  const currentSlug = pathname.split('/')[2]

  // Sort CIPs by number
  const sortedCips = [...allCips].sort((a, b) => a.CIP - b.CIP)

  return (
    <div className="w-64 flex-shrink-0 border-r border-gray-100/10">
      <div className="sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
        <nav className="space-y-1 px-4 py-4">
          {sortedCips.map((cip) => {
            const isActive = cip.slug === currentSlug
            return (
              <Link
                key={cip.slug}
                href={`/cip/${cip.slug}`}
                className={classNames(
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white',
                  'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
                )}
              >
                <span className="mr-2 text-cf-blue-50">#{cip.CIP}</span>
                <span className="truncate">{cip.Title}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
} 