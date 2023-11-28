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
      name: 'Sebastien Guillemot',
      github_link: 'https://github.com/SebastienGllmt',
    },
    {
      name: 'Robert Phair',
      github_link: 'https://github.com/rphair',
    },
    {
      name: 'Ryan Williams',
      github_link: 'https://github.com/Ryun1',
    },
    {
      name: 'Adam Dean',
      github_link: 'https://github.com/Crypto2099',
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
          <div className="mt-16 flex w-full flex-col items-center gap-1 text-center text-gray-200">
            <h2 className="text-3xl text-cf-blue-50/80">Editors</h2>
            <h3 className="text-xl text-slate-200/80 mb-6 max-w-lg">Editors triage, number, and briefly review new CIPs for visibility and potential reviews.</h3>
            {Editors.map((person, index) => (
              <div key={index} className="grid grid-cols-1 text-base md:text-lg ">
                <a
                  href={person.github_link}
                  target="_blank"
                  className="justify-center flex text-slate-200 hover:text-cf-gray-100"
                >
                  <div className="">{person.name}</div>
                </a>
              </div>
            ))}
          </div>
          {/* Authors Section */}
          <div className="mt-16 flex w-full flex-col items-center gap-1 text-center text-gray-200">
            <h2 className="text-3xl text-cf-blue-50/80">Authors</h2>
            <h3 className="text-xl text-slate-200/80 mb-6 max-w-lg">Authors open pull requests and await for feedback.</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-4">
              {Authors.map((person, index) => (
                <div key={index} className="grid grid-cols-1 text-base md:text-lg">
                  <a href={`mailto:${person.email}`} className="text-slate-200 hover:text-cf-gray-100">
                    <div className="flex-grow text-center">{person.name}</div>
                  </a>
                </div>
              ))}
            </div>
          </div>
          {/* Reviewer Section */}
          <div className="mt-10 flex w-full flex-col items-center gap-1 text-center text-gray-200">
            <h2 className="text-3xl text-cf-blue-50/80">Reviewers</h2>
            <h3 className="text-xl text-slate-200/80 mb-6 max-w-lg">Reviewers accept and review CIP and CPS content before it is merged.</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-4">
              {Contributors.map((person, index) => (
                <div key={index} className="grid grid-cols-1 text-base md:text-lg">
                  <a href={person.html_url} target="_blank" className="text-slate-200 hover:text-cf-gray-100">
                    <div className="flex-grow text-center">{person.name}</div>
                  </a>
                </div>
              ))}
            </div>
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
