export type SortOrder = 'number' | 'created' | 'updated'
export type SortDirection = 'asc' | 'desc'

export const SORT_STORAGE_KEY = 'sidebar-sort'
export const DIRECTION_STORAGE_KEY = 'sidebar-sort-direction'
export const sortOrders: SortOrder[] = ['number', 'created', 'updated']
export const sortDirections: SortDirection[] = ['asc', 'desc']

export const sortKey = (sort: SortOrder, direction: SortDirection) =>
  `${sort}-${direction}`

// Runs before first paint to put the stored sort on <html data-sort>, which
// globals.css uses to order the statically rendered sidebar list so it
// doesn't jump once React restores the preference after hydration.
export const sortInitScript = `(function () {
  try {
    var sort = localStorage.getItem(${JSON.stringify(SORT_STORAGE_KEY)})
    var direction = localStorage.getItem(${JSON.stringify(DIRECTION_STORAGE_KEY)})
    if (${JSON.stringify(sortOrders)}.indexOf(sort) < 0) sort = 'number'
    if (${JSON.stringify(sortDirections)}.indexOf(direction) < 0) direction = 'asc'
    document.documentElement.dataset.sort = sort + '-' + direction
  } catch (e) {}
})()`
