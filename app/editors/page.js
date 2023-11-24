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
      <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-transparent pb-12 pt-24 md:pt-40">
        {/* Thank you section */}
        <h1 className="via-cf-slate-50 px-4 text-3xl md:text-5xl bg-gradient-to-br from-white to-cf-blue-50/90 bg-clip-text text-center font-medium leading-tight tracking-tight text-transparent">
          Thank you for being part of the change!
        </h1>
        <div className="flex flex-col items-center px-4">
          {/* Editors Section */}
          <div className="mt-10 flex w-full flex-col gap-1 text-center text-gray-200">
            {Editors.map((person, index) => (
              <div key={index} className="grid grid-cols-2 text-base md:text-lg">
                <div className="mr-3 text-right text-cf-blue-50/40">Editor</div>
                <a
                  href={person.github_link}
                  target="_blank"
                  className="justify-left flex text-slate-50 hover:text-cf-gray-100"
                >
                  <div className="">{person.name}</div>
                </a>
              </div>
            ))}
          </div>
          {/* Authors Section */}
          <div className="mt-10 flex w-full flex-col gap-1 text-center text-gray-200">
            {Authors.map((person, index) => (
              <div key={index} className="grid grid-cols-2 text-base md:text-lg">
                <div className="mr-3 text-right text-cf-blue-50/40">Author</div>
                <a href={`mailto:${person.email}`} className="text-slate-50 hover:text-cf-gray-100">
                  <div className="flex-grow text-left">{person.name}</div>
                </a>
              </div>
            ))}
          </div>
          {/* Reviewer Section */}
          <div className="mt-10 flex w-full flex-col gap-1 text-center text-gray-200">
            {Contributors.map((person, index) => (
              <div key={index} className="grid grid-cols-2 text-base md:text-lg">
                <div className="mr-3 text-right text-cf-blue-50/40">Reviewer</div>
                <a href={person.html_url} target="_blank" className="text-slate-50 hover:text-cf-gray-100">
                  <div className="flex-grow text-left hover">{person.name}</div>
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
