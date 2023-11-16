import { ChevronRightIcon } from '@heroicons/react/20/solid'
import Badge from '@/components/Badge'
import Link from 'next/link'

export default function ListGroup(props) {
  return (
    <ul
      role="list"
      className="divide-y divide-gray-100/10 overflow-hidden bg-clip-padding border border-gray-100/10 shadow-sm ring-1 ring-gray-900/5 rounded-3xl"
    >
      {props.items.map((item) => (
        <li key={item.number} className="relative bg-gradient-to-tl from-white/[7%] via-white/[2%] to-transparent flex justify-between gap-x-6 px-4 py-5 hover:bg-white/[7%] transition-all duration-200 ease-in-out sm:px-6">
          <div className="flex min-w-0 gap-x-4">
            <div className="min-w-0 flex-auto">
              <p className="leading-6 text-cf-blue-50">
                #{item.number}
              </p>
              <p className="font-semibold leading-6 text-slate-50">
                <Link href={item.href}>
                  <span className="absolute inset-x-0 -top-px bottom-0" />
                  {item.title}
                </Link>
              </p>
              <p className="mt-1 flex text-xs leading-5 text-slate-300">
                {item.authors && item.authors.map((author ,index) => (
                  <Link href={`mailto:${author.email}`} className="relative truncate hover:underline">
                    {author.name}{index + 1 < item.authors.length && ",\u00A0"}
                  </Link>
                ))}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-4">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              <div className="flex leading-6">
                <Badge className={`text-sm ${item.statusBadgeColor}`} title={item.status} />
                {item.category && <Badge className="text-sm bg-cf-blue-50/70 ring-cf-blue-50/70 text-cf-blue-600 ml-2" title={item.category} />}
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-300 mt-2">
                Created on <time dateTime={item.created}>{item.created}</time>
              </p>
            </div>
            <ChevronRightIcon className="h-5 w-5 flex-none text-slate-400" aria-hidden="true" />
          </div>
        </li>
      ))}
    </ul>
  )
}
