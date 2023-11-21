import EditorCard from '@/components/EditorCard'
import Contributors from '@/data/contributors.json'
import Image from 'next/image'
import Link from 'next/link'

export default function Editors() {

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
          <div className="mt-8 flex grid-cols-3 flex-wrap justify-center gap-8">
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
      <div className="flex items-center justify-center overflow-hidden bg-transparent py-12">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 sm:px-8 lg:px-12">
          <h1 className="via-cf-slate-50 bg-gradient-to-br from-white to-cf-blue-50/90 bg-clip-text text-center text-5xl font-medium leading-tight tracking-tight text-transparent sm:text-[5rem]">
            Contributors
          </h1>

          <div className="mx-auto mt-12 w-full max-w-7xl">
            <div className="isolate grid grid-cols-4 justify-items-center gap-4 sm:grid-cols-8 sm:gap-2 md:grid-cols-10 md:gap-3 lg:grid-cols-12 lg:gap-4">
              {Contributors.map((contributor, index) => (
                <Link
                  href={contributor.html_url}
                  target="_blank"
                  key={index}
                  className="relative group"
                >
                  <Image
                    className="relative z-30 inline-block h-full w-full rounded-full ring-2 group-hover:ring-8 group-hover:animate-spin ring-cf-blue-50/20"
                    src={contributor.image}
                    alt={contributor.name}
                    width={500}
                    height={300}
                    quality={90}
                  />

                  {/* overlay a gradient over the image for color consistency and hover effects */}
                  <div className="absolute flex items-center justify-center inset-0 z-40 w-full h-full bg-gradient-to-tl from-cf-blue-600/10 via-cf-blue-500/10 to-cf-blue-50/10 rounded-full transition duration-200 ease-in-out group-hover:from-cf-blue-600/70 group-hover:via-cf-blue-500/70 group-hover:to-cf-blue-50/20 group-hover:backdrop-blur-sm">
                    <svg className="w-1/2 h-1/2 fill-curent text-slate-100 opacity-0 group-hover:opacity-100 transition duration-200 ease-in-out" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' width='24' height='24'><path fillRule="evenodd" clipRule="evenodd" d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"></path></svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Thank you section */}
      <div className="flex items-center justify-center overflow-hidden bg-transparent pb-12">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 sm:px-8 lg:px-12">
          <h1 className="via-cf-slate-50 bg-gradient-to-br from-white to-cf-blue-50/90 bg-clip-text text-center text-2xl sm:text-4xl font-medium leading-tight tracking-tight text-transparent">
            Thank you for being part of the change!
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
