'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Disclosure, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Socials from '@/data/socials'
import Logo from '@/components/Logo'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Navigation = () => {
  const pathname = usePathname()

  const navigation = [
    { name: 'About CIPs', href: '/about', current: pathname === '/about' },
    { name: 'Contributors', href: '/contributors', current: pathname === '/contributors' },
  ]

  return (
    <Disclosure
      as="nav"
      className="fixed top-0 z-10 w-full border-b border-gray-100/10 bg-white bg-opacity-[1%] backdrop-blur-lg"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-12 justify-between">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center lg:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-slate-50 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/30">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/">
                    <Logo className="w-48 lg:mr-1" />
                  </Link>
                </div>
                <div className="hidden lg:ml-4 lg:flex lg:items-center lg:space-x-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? 'text-cf-gray-100'
                          : 'hover:text-cf-gray-100',
                        'px-2 py-2 text-slate-50 hover:text-cf-gray-100',
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex flex-shrink-0 space-x-4">
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
              </div>
            </div>
          </div>

          <Transition
            enter="transition duration-100 ease-in"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className="shadow-2xl lg:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                <Disclosure.Button
                  as={Link}
                  href="/"
                  className={classNames(
                    pathname === '/' ? 'bg-white/20' : 'hover:bg-white/20',
                    'block rounded-md px-3 py-2 text-base font-medium text-slate-50',
                  )}
                  aria-current={pathname === '/' ? 'page' : undefined}
                >
                  Home
                </Disclosure.Button>
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    href={item.href}
                    className={classNames(
                      item.current ? 'bg-white/20' : 'hover:bg-white/20',
                      'block rounded-md px-3 py-2 text-base font-medium text-slate-50',
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  )
}

export default Navigation
