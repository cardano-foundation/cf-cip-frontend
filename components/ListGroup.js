import { ChevronRightIcon } from '@heroicons/react/20/solid'

const people = [
  {
    number: 12,
    title: 'On-chain stake pool operator to delegates communication',
    status: 'Active',
    href: '#',
    createdAt: '2020-11-07',
    authors: [
      {
        name: 'Marek Mahut',
        email: 'marek.mahut@fivebinaries.com',
      },
      {
        name: 'Sebastien Guillemot',
        email: 'sebastien@emurgo.io',
      }
    ]
  },
  {
    number: 12,
    title: 'On-chain stake pool operator to delegates communication',
    status: 'Active',
    href: '#',
    createdAt: '2020-11-07',
    authors: [
      {
        name: 'Marek Mahut',
        email: 'marek.mahut@fivebinaries.com',
      },
      {
        name: 'Sebastien Guillemot',
        email: 'sebastien@emurgo.io',
      }
    ]
  },
  {
    number: 12,
    title: 'On-chain stake pool operator to delegates communication',
    status: 'Active',
    href: '#',
    createdAt: '2020-11-07',
    authors: [
      {
        name: 'Marek Mahut',
        email: 'marek.mahut@fivebinaries.com',
      },
      {
        name: 'Sebastien Guillemot',
        email: 'sebastien@emurgo.io',
      }
    ]
  },
  {
    number: 12,
    title: 'On-chain stake pool operator to delegates communication',
    status: 'Active',
    href: '#',
    createdAt: '2020-11-07',
    authors: [
      {
        name: 'Marek Mahut',
        email: 'marek.mahut@fivebinaries.com',
      },
      {
        name: 'Sebastien Guillemot',
        email: 'sebastien@emurgo.io',
      }
    ]
  },
  {
    number: 12,
    title: 'On-chain stake pool operator to delegates communication',
    status: 'Active',
    href: '#',
    createdAt: '2020-11-07',
    authors: [
      {
        name: 'Marek Mahut',
        email: 'marek.mahut@fivebinaries.com',
      },
      {
        name: 'Sebastien Guillemot',
        email: 'sebastien@emurgo.io',
      }
    ]
  },
]

export default function ListGroup() {
  return (
    <ul
      role="list"
      className="divide-y divide-gray-100/10 overflow-hidden bg-clip-padding border border-gray-100/10 shadow-sm ring-1 ring-gray-900/5 rounded-3xl"
    >
      {people.map((person) => (
        <li key={person.email} className="relative bg-gradient-to-tl from-white/[7%] via-white/[2%] to-transparent flex justify-between gap-x-6 px-4 py-5 hover:bg-white/[7%] sm:px-6">
          <div className="flex min-w-0 gap-x-4">
            <div className="min-w-0 flex-auto">
              <p className="font-semibold leading-6 text-slate-50">
                <a href={person.href}>
                  <span className="absolute inset-x-0 -top-px bottom-0" />
                  {person.title}
                </a>
              </p>
              <p className="mt-1 flex text-xs leading-5 text-slate-300">
                {person.authors && person.authors.map((author ,index) => (
                  <a href={`mailto:${author.email}`} className="relative truncate hover:underline">
                    {author.name}{index + 1 < person.authors.length && ",\u00A0"}
                  </a>
                ))}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-x-4">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              <p className="text-sm leading-6 text-slate-100">{person.status}</p>
              <p className="mt-1 text-xs leading-5 text-slate-300">
                Created on <time dateTime={person.createdAt}>{person.createdAt}</time>
              </p>
            </div>
            <ChevronRightIcon className="h-5 w-5 flex-none text-slate-400" aria-hidden="true" />
          </div>
        </li>
      ))}
    </ul>
  )
}
