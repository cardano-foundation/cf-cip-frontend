import Link from 'next/link'
import Socials from '@/data/socials'

export default function Footer() {
  return (
    <footer className="border-t border-gray-100/10 bg-cf-blue-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-4 md:order-2">
          {Socials.map((item) => (
            <Link key={item.name} href={item.url} target="_blank">
              <svg
                className="fill-curent h-5 w-5 text-slate-50 hover:text-cf-gray-100"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="24"
                height="24"
              >
                <path d={item.svg}></path>
              </svg>
            </Link>
          ))}
        </div>
        <div className="mt-4 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-slate-100">
            &copy; 2023 Cardano Foundation
          </p>
        </div>
      </div>
    </footer>
  )
}
