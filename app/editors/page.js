import EditorCard from '@/components/EditorCard'
import Contributors from '../Contributors/Contributors.json'
import Image from 'next/image'

export default function Home() {

  // List of editors
  const editors = [
    {
      name: 'Matthias Benkort',
      github_link: 'https://github.com/KtorZ',
      image: 'editors/Matthias-Benkort.jpeg',
    },
    {
      name: 'John Greene',
      github_link: 'https://github.com/KtorZ',
      image: 'editors/John-Greene.jpeg',
    },
    {
      name: 'Vanessa Hurhangee',
      github_link: 'https://github.com/KtorZ',
      image: 'editors/Vanessa-Hurhangee.jpg',
    },
    {
      name: 'Thomas Mayfield',
      github_link: 'https://github.com/KtorZ',
      image: 'editors/Thomas-Mayfiel.jpeg',
    },
    {
      name: 'Michiel Bellen',
      github_link: 'https://github.com/KtorZ',
      image: 'editors/Michiel-Bellen.jpeg',
    },
  ]

  return (
    <main className="relative isolate min-h-screen bg-cf-blue-900">

      {/* Editors Section */}
      <div className="flex items-center justify-center overflow-hidden bg-transparent pb-12 pt-40">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 sm:px-8 lg:px-12">
          <h1 className="via-cf-slate-50 bg-gradient-to-br from-white to-cf-blue-50/90 bg-clip-text text-center text-5xl font-medium leading-tight tracking-tight text-transparent sm:text-[5rem]">
            Editors
          </h1>
          <div className="my-12 flex grid-cols-3 flex-wrap justify-center gap-8">
            {editors.map((person, index) => (
              <div key={index}>
                <EditorCard
                  image={person.image}
                  name={person.name}
                  github_link={person.github_link}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contributors Section */}
      <div className="flex items-center justify-center overflow-hidden bg-transparent pb-12 pt-24">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 sm:px-8 lg:px-12">
          <h1 className="via-cf-slate-50 bg-gradient-to-br from-white to-cf-blue-50/90 bg-clip-text text-center text-5xl font-medium leading-tight tracking-tight text-transparent sm:text-[5rem]">
            Contributors
          </h1>

          <div className="mx-auto mt-12 w-full max-w-7xl">
            <div className="isolate grid grid-cols-4 justify-items-center gap-x-1 gap-y-2 sm:grid-cols-8 sm:gap-x-2 sm:gap-y-3 md:grid-cols-10 md:gap-x-3 md:gap-y-4 lg:grid-cols-12 lg:gap-x-4 lg:gap-y-5">
              {Contributors.map((contributor, index) => (
                <a
                  href={contributor.html_url}
                  target="_blank"
                  key={index}
                >
                  <Image
                    className="relative z-30 inline-block h-16 w-16 rounded-full ring-2"
                    src={contributor.image}
                    alt={contributor.name}
                    width={500}
                    height={300}
                    quality={90}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Thank you section */}
      <div className="flex items-center justify-center overflow-hidden bg-transparent pb-12">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 sm:px-8 lg:px-12">
          <h1 className="via-cf-slate-50 bg-gradient-to-br from-white to-cf-blue-50/90 bg-clip-text text-center text-2xl sm:text-4xl font-medium leading-tight tracking-tight text-transparent">
            Thank you to all contributors!
          </h1>
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
