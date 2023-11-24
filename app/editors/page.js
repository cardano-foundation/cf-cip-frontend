import Contributors from '@/data/contributors.json'
import Authors from '@/data/authors.json'
import Image from 'next/image'
import Link from 'next/link'

export default function Editors() {
  // List of editors
  const Editors = [
    {
      name: 'Matthias Benkort',
      github_link: 'https://github.com/KtorZ',
    },
    {
      name: 'John Greene',
      github_link: 'https://github.com/KtorZ',
    },
    {
      name: 'Vanessa Hurhangee',
      github_link: 'https://github.com/KtorZ',
    },
    {
      name: 'Thomas Mayfield',
      github_link: 'https://github.com/KtorZ',
    },
    {
      name: 'Michiel Bellen',
      github_link: 'https://github.com/KtorZ',
    },
  ]

  return (
    <main className="relative isolate min-h-screen bg-cf-blue-900">
      <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-transparent pb-12 pt-40">
        {/* Thank you section */}
        <h1 className="via-cf-slate-50 sm:text-[3 rem] bg-gradient-to-br from-white to-cf-blue-50/90 bg-clip-text text-center text-5xl font-medium leading-tight tracking-tight text-transparent">
          Thank you for being part of the change!
        </h1>
        <div className="flex flex-col items-center">
          {/* Editors Section */}
          <div className="mt-10 flex w-full flex-col gap-1 text-center text-gray-200">
            {Editors.map((person, index) => (
              <div key={index} className="grid grid-cols-2">
                <div className="mr-4 text-right">Editors</div>
                <a
                  href={person.github_link}
                  target="_blank"
                  className="justify-left flex"
                >
                  <div className="">{person.name}</div>
                </a>
              </div>
            ))}
          </div>
          {/* Authors Section */}
          <div className="mt-10 flex w-full flex-col gap-1 text-center text-gray-200">
            {Authors.map((person, index) => (
              <div key={index} className="grid grid-cols-2">
                <div className="mr-4 text-right">Authors</div>
                <a href={`mailto:${person.email}`}>
                  <div className="flex-grow text-left">{person.name}</div>
                </a>
              </div>
            ))}
          </div>
          {/* Reviewer Section */}
          <div className="mt-10 flex w-full flex-col gap-1 text-center text-gray-200">
            {Contributors.map((person, index) => (
              <div key={index} className="grid grid-cols-2">
                <div className="mr-4 text-right">Reviewer</div>
                <a href={person.html_url} target="_blank">
                  <div className="flex-grow text-left">{person.name}</div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background gradient */}
      <div
        className="absolute left-0 top-0 -z-10 h-screen w-full"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% -20%,rgba(248,250,252,0.15), hsla(0,0%,100%,0)',
        }}
      />
    </main>
  )
}
