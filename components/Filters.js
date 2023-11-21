'use client'

import qs from 'query-string'
import {Fragment, useEffect, useRef, useState} from 'react'
import { useDebounce } from "use-debounce"
import { useSearchParams, useRouter } from "next/navigation"
import { Dialog, Disclosure, Menu, Popover, Transition } from '@headlessui/react'
import { XMarkIcon, CheckIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const sortOptions = [
  { value: 'number', label: 'Number' },
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
]

const filters = [
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'Meta', label: 'Meta' },
      { value: 'Wallets', label: 'Wallets' },
      { value: 'Tokens', label: 'Tokens' },
      { value: 'Metadata', label: 'Metadata' },
      { value: 'Tools', label: 'Tools' },
      { value: 'Plutus', label: 'Plutus' },
      { value: 'Ledger', label: 'Ledger' },
      { value: 'Catalyst', label: 'Catalyst' },
    ],
  },
  {
    id: 'status',
    name: 'Status',
    options: [
      { value: 'Proposed', label: 'Proposed', type: 'cip' },
      { value: 'Active', label: 'Active', type: 'cip' },
      { value: 'Inactive', label: 'Inactive', type: 'cip' },
      { value: 'Draft', label: 'Draft', type: 'cip' },
      { value: 'Open', label: 'Open', type: 'cps' },
      { value: 'Solved', label: 'Solved', type: 'cps' },
      { value: 'Inactive', label: 'Inactive', type: 'cps' },
    ],
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Filters({ type }) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500)

  const sort = searchParams.get('sort') || 'number'
  const category = searchParams.get('category')
  const status = searchParams.get('status')

  const handleFilters = (type, value) => {
    const current = qs.parse(searchParams.toString())

    const query = {
      ...current,
      [type]: current[type] ? `${current[type].split(',')},${value}` : value,
    }

    if (current[type] && current[type].split(',').includes(value)) {
      query[type] = current[type].split(',').filter((v) => v !== value).join(',')
    }

    const url = qs.stringifyUrl({
      url: window.location.href,
      query,
    }, { skipNull: true })

    router.replace(url, { scroll: false })
  }

  const handleSort = (value) => {
    const current = qs.parse(searchParams.toString())

    const query = {
      ...current,
      sort: value,
    }

    const url = qs.stringifyUrl({
      url: window.location.href,
      query,
    }, { skipNull: true });

    router.replace(url, { scroll: false })
  }

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSearch = () => {
    const current = qs.parse(searchParams.toString())

    const query = {
      ...current,
      search: debouncedSearchQuery,
    }

    const url = qs.stringifyUrl({
      url: window.location.href,
      query,
    }, { skipNull: true })

    router.replace(url, { scroll: false });
  }

  // useEffect that updates the search query in the URL from debouncedSearchQuery
  useEffect(() => {
    if (searchQuery === '') {
      return
    }

    console.log('this ran')

    handleSearch()
  }, [debouncedSearchQuery])

  return (
    <div className="w-full">
      {/* Mobile filter dialog */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 sm:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-transparent backdrop-blur-lg border-l border-gray-100/10 py-4 pb-6">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-slate-50">Filters</h2>
                  <button
                    type="button"
                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md p-2 text-slate-50 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Filters */}
                <form className="mt-4">
                  {filters.map((section) => (
                    <Disclosure as="div" key={section.name} className="border-t border-gray-100/10 px-4 py-6">
                      {({ open }) => (
                        <>
                          <h3 className="-mx-2 -my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between px-2 py-3 text-sm text-slate-100">
                              <span className="font-medium text-slate-100">{section.name}</span>
                              <span className="ml-6 flex items-center">
                                <ChevronDownIcon
                                  className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-5 w-5 transform')}
                                  aria-hidden="true"
                                />
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-6">
                              {section.options.map((option, optionIdx) => {
                                if (section.id === 'category' || (section.id === 'status' && type === option.type)) {
                                  return (
                                    <div key={option.value} className="flex items-center">
                                      <input
                                        id={`filter-mobile-${section.id}-${optionIdx}`}
                                        name={`${section.id}[]`}
                                        defaultValue={option.value}
                                        defaultChecked={
                                          (category && category.split(',').includes(option.value)) ||
                                          (status && status.split(',').includes(option.value))
                                        }
                                        type="checkbox"
                                        className="h-4 w-4 rounded text-cf-blue-900/50 bg-cf-blue-900/10 focus:ring-cf-blue-200 cursor-pointer"
                                        onChange={() => handleFilters(section.id, option.value)}
                                      />
                                      <label
                                        htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                        className="ml-3 text-sm text-slate-50"
                                      >
                                        {option.label}
                                      </label>
                                    </div>
                                  )
                                }
                              })}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <section aria-labelledby="filter-heading" className="py-6">
        <h2 id="filter-heading" className="sr-only">
          Filters
        </h2>

        <div className="flex items-center justify-between">
          <div className="flex items-center flex-grow">
            <Menu as="div" className="relative inline-block text-left pr-4 border-r border-gray-100/10">
              <div>
                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-slate-50 hover:text-cf-gray-100">
                  Sort
                  <ChevronDownIcon
                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-slate-300 group-hover:text-cf-gray-100"
                    aria-hidden="true"
                  />
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white/10 backdrop-blur-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <Menu.Item key={option.value}>
                        {({ active }) => (
                          <div
                            className={classNames(
                              active ? 'bg-white/20' : '',
                              'px-4 py-2 text-sm font-medium text-slate-50 flex justify-between cursor-pointer'
                            )}
                            onClick={() => handleSort(option.value)}
                          >
                            <span>{option.label}</span>
                            {option.value === sort && <CheckIcon className="h-4 w-4" aria-hidden="true" />}
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            <div className="flex px-4 w-full">
              <label htmlFor="search" className="hidden">
                Search
              </label>
              <div className="relative w-full">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                  <MagnifyingGlassIcon className="h-4 w-4 outline-current text-slate-300" aria-hidden="true" />
                </div>
                <input
                  onChange={handleSearchQueryChange}
                  id="search"
                  type="search"
                  placeholder="Search"
                  value={searchQuery}
                  className="w-full border-0 rounded-xl bg-transparent pl-6 text-slate-50 text-sm font-medium placeholder:text-cf-slate-300 focus:ring-2 focus:ring-inset focus:ring-cf-blue-50 sm:leading-6"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            className="inline-block text-sm font-medium text-slate-50 hover:text-cf-gray-100 sm:hidden"
            onClick={() => setOpen(true)}
          >
            Filters
          </button>

          <Popover.Group className="hidden sm:flex sm:items-baseline sm:space-x-8">
            {filters.map((section, sectionIdx) => (
              <Popover
                as="div"
                key={section.name}
                id={`desktop-menu-${sectionIdx}`}
                className="relative inline-block text-left"
              >
                <div>
                  <Popover.Button className="group inline-flex items-center justify-center text-sm font-medium text-slate-50 hover:text-cf-gray-100">
                    <span>{section.name}</span>
                    { section.id === 'category' && category?.split(',')[0] && <span className="ml-1.5 rounded bg-cf-blue-50 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-cf-blue-600">
                      { category?.split(',').length }
                    </span> }
                    { section.id === 'status' && status?.split(',')[0] && <span className="ml-1.5 rounded bg-cf-blue-50 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-cf-blue-600">
                      { status?.split(',').length }
                    </span> }
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-slate-300 group-hover:text-cf-gray-100"
                      aria-hidden="true"
                    />
                  </Popover.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white/10 backdrop-blur-lg p-4 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <form className="space-y-4">
                      {section.options.map((option, optionIdx) => {
                        if (section.id === 'category' || (section.id === 'status' && type === option.type)) {
                          return (
                            <div key={option.value} className="flex items-center">
                              <input
                                id={`filter-${section.id}-${optionIdx}`}
                                name={`${section.id}[]`}
                                defaultValue={option.value}
                                defaultChecked={
                                  (category && category.split(',').includes(option.value)) ||
                                  (status && status.split(',').includes(option.value))
                                }
                                type="checkbox"
                                className="h-4 w-4 rounded text-cf-blue-900/50 bg-cf-blue-900/10 focus:ring-cf-blue-200 cursor-pointer"
                                onChange={() => handleFilters(section.id, option.value)}
                              />
                              <label
                                htmlFor={`filter-${section.id}-${optionIdx}`}
                                className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-slate-50 cursor-pointer"
                              >
                                {option.label}
                              </label>
                            </div>
                          )
                        }
                      })}
                    </form>
                  </Popover.Panel>
                </Transition>
              </Popover>
            ))}
          </Popover.Group>
        </div>
      </section>
    </div>
  )
}
