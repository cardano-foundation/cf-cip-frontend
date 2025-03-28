import { ChevronRightIcon } from '@heroicons/react/20/solid'
import Badge from '@/components/Badge'
import Link from 'next/link'

function parseAuthors(authors) {
  return authors.map((author) => {
    const [name, email] = author.split("<")
    return {
      name: name.trim(),
      email: email ? email.replace(">", "").trim() : '',
    }
  })
}

export default function ListGroup({items, type}) {
  return (
    <ul
      role="list"
      className="divide-y divide-gray-100/10 overflow-hidden bg-clip-padding border border-gray-100/10 shadow-sm ring-1 ring-gray-900/5 rounded-3xl"
    >
      {items.map((item, index) => (
        <li key={index} className="relative bg-gradient-to-tl from-white/[7%] via-white/[2%] to-transparent flex justify-between gap-x-6 px-4 py-5 hover:bg-white/[7%] transition-all duration-200 ease-in-out sm:px-6">
          <div className="flex min-w-0 gap-x-4">
            <div className="min-w-0 flex-auto">
              <div className="mb-2 sm:hidden">
                <Badge className={`text-sm ${item.statusBadgeColor}`} title={item.Status} />
                {item.Category && <Badge className="text-sm bg-white/10 ring-slate-400 text-slate-200 ml-2" title={item.Category} />}
              </div>
              <p className="leading-6 text-cf-blue-50">
                #{item[type.toUpperCase()]}
              </p>
              <p className="font-semibold leading-6 text-slate-50">
                <Link href={`/${type}/${item.slug}`}>
                  <span className="absolute inset-x-0 -top-px bottom-0" />
                  {item.Title}
                </Link>
              </p>
              <p className="mt-1 flex text-xs leading-5 text-slate-300 flex-wrap">
                {item.Authors && parseAuthors(item.Authors).map((author ,index) => (
                  <>
                    {item.Authors.length !== 1 && index + 1 === item.Authors.length && <>&nbsp;and&nbsp;</>}
                    <Link href={`mailto:${author.email}`} key={index} className="relative hover:underline">
                      {author.name}{index + 1 < item.Authors.length && ",\u00A0"}
                    </Link>
                  </>
                ))}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-4">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              <div className="flex leading-6">
                <Badge className={`text-sm ${item.statusBadgeColor}`} title={item.Status} />
                {item.Category && <Badge className="text-sm bg-white/10 ring-slate-400 text-slate-200 ml-2" title={item.Category} />}
              </div>
              <p className="text-xs leading-5 text-slate-300 mt-2">
                Created on <time dateTime={item.Created}>
                  {new Date(item.Created).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </p>
            </div>
            <ChevronRightIcon className="h-5 w-5 flex-none text-slate-400" aria-hidden="true" />
          </div>
        </li>
      ))}
    </ul>
  )
}
