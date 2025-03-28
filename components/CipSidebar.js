'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { allCips } from 'content-collections'
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function CipSidebar() {
  const pathname = usePathname()
  const currentSlug = pathname.split('/')[2]
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Sort CIPs by number
  const sortedCips = [...allCips].sort((a, b) => a.CIP - b.CIP)

  const SidebarContent = () => (
    <nav className="space-y-1 px-4 py-4">
      {sortedCips.map((cip) => {
        const isActive = cip.slug === currentSlug
        return (
          <Link
            key={cip.slug}
            href={`/cip/${cip.slug}`}
            onClick={() => setMobileMenuOpen(false)}
            className={classNames(
              isActive
                ? 'bg-white/10 text-white'
                : 'text-slate-300 hover:bg-white/5 hover:text-white',
              'group flex items-center rounded-md px-2 py-2 text-sm font-medium'
            )}
          >
            <span className="mr-2 text-cf-blue-50">#{cip.CIP}</span>
            <span className="truncate">{cip.Title}</span>
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="min-[1160px]:hidden fixed bottom-6 right-6 z-50 inline-flex items-center justify-center rounded-full bg-white bg-opacity-[1%] backdrop-blur-lg p-3 text-white border border-gray-100/10 hover:bg-white/5"
        onClick={() => setMobileMenuOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Mobile sidebar */}
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 min-[1160px]:hidden" onClose={setMobileMenuOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white bg-opacity-[1%] backdrop-blur-lg border-l border-gray-100/10 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-white/20">
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100/10">
                  <Dialog.Title className="text-base font-semibold text-white">
                    Cardano Improvement Proposals
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md p-2 text-slate-400 hover:text-white hover:bg-white/5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <SidebarContent />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden min-[1160px]:block w-64 flex-shrink-0 border-r border-gray-100/10">
        <div className="sticky top-[49px] h-[calc(100vh-49px)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-white/20">
          <SidebarContent />
        </div>
      </div>
    </>
  )
} 