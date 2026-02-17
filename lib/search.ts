import React from 'react'
import { allCips, allCps } from 'content-collections'

export type SearchableItem = {
  id: string
  title: string
  url: string
  type: 'CIP' | 'CPS'
  content: string
  status: string
  category: string
  statusBadgeColor: string
  authors: string[]
  implementors: string[]
  created: string
}

export type ScoredItem = SearchableItem & { score: number }

function cleanName(name: string): string {
  return name.replace(/<[^>]*>/g, '').trim()
}

function cleanNames(names: string[]): string[] {
  return names.map(cleanName).filter(Boolean)
}

export function getAllSearchableItems(): SearchableItem[] {
  const sortedCips = [...allCips].sort((a, b) => a.CIP - b.CIP)
  const sortedCps = [...allCps].sort((a, b) => a.CPS - b.CPS)

  return [
    ...sortedCips.map((cip) => ({
      id: `CIP-${cip.CIP}`,
      title: cip.Title,
      url: `/cip/${cip.slug}`,
      type: 'CIP' as const,
      content: cip.content || '',
      status: cip.Status?.split(' ')[0].toLowerCase() || '',
      category: cip.Category || '',
      statusBadgeColor: cip.statusBadgeColor,
      authors: cleanNames(Array.isArray(cip.Authors) ? cip.Authors : [cip.Authors]),
      implementors: cleanNames(Array.isArray(cip.Implementors) ? cip.Implementors.map(String) : cip.Implementors ? [String(cip.Implementors)] : []),
      created: cip.Created,
    })),
    ...sortedCps.map((cps) => ({
      id: `CPS-${cps.CPS}`,
      title: cps.Title,
      url: `/cps/${cps.slug}`,
      type: 'CPS' as const,
      content: cps.content || '',
      status: cps.Status?.toLowerCase() || '',
      category: cps.Category || '',
      statusBadgeColor: cps.statusBadgeColor,
      authors: cleanNames(cps.Authors || []),
      implementors: [],
      created: cps.Created,
    })),
  ]
}

export function getFilterOptions(items: SearchableItem[]) {
  const categorySet = new Set<string>()
  const statusSet = new Set<string>()
  const typeSet = new Set<string>()
  const authorSet = new Set<string>()
  const implementorSet = new Set<string>()

  items.forEach((item) => {
    if (item.category) categorySet.add(item.category)
    if (item.status) statusSet.add(item.status)
    typeSet.add(item.type)
    item.authors.forEach((a) => { if (a) authorSet.add(a) })
    item.implementors.forEach((i) => { if (i) implementorSet.add(i) })
  })

  return {
    categories: [
      { label: 'All Categories', value: '' },
      ...Array.from(categorySet)
        .sort()
        .map((cat) => ({ label: cat, value: cat })),
    ],
    statuses: [
      { label: 'All Statuses', value: '' },
      ...Array.from(statusSet)
        .sort()
        .map((status) => ({
          label: status.charAt(0).toUpperCase() + status.slice(1),
          value: status,
        })),
    ],
    types: [
      { label: 'All Types', value: '' },
      ...Array.from(typeSet)
        .sort()
        .map((type) => ({ label: type, value: type })),
    ],
    authors: [
      { label: 'All Authors', value: '' },
      ...Array.from(authorSet)
        .sort()
        .map((a) => ({ label: a, value: a })),
    ],
    implementors: [
      { label: 'All Implementors', value: '' },
      ...Array.from(implementorSet)
        .sort()
        .map((i) => ({ label: i, value: i })),
    ],
  }
}

export function scoreItem(item: SearchableItem, query: string): number {
  const q = query.toLowerCase().trim()
  if (!q) return 0

  const titleLower = item.title.toLowerCase()
  const idLower = item.id.toLowerCase()
  const contentLower = item.content?.toLowerCase() || ''

  let score = 0

  // Exact ID match gets highest score
  if (idLower === q) score += 100
  // ID starts with search gets high score
  else if (idLower.startsWith(q)) score += 80
  // ID contains search gets medium score
  else if (idLower.includes(q)) score += 60

  // Title starts with search gets high score
  if (titleLower.startsWith(q)) score += 70
  // Title contains search gets lower score
  else if (titleLower.includes(q)) score += 40

  // Word boundary matches get bonus
  const words = titleLower.split(/\s+/)
  if (words.some((word) => word.startsWith(q))) score += 20

  // Full-text content search
  if (item.content) {
    // Exact phrase match in content gets medium score
    if (contentLower.includes(q)) {
      score += 30

      // Bonus for multiple occurrences
      const occurrences = (
        contentLower.match(
          new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
        ) || []
      ).length
      if (occurrences > 1) score += Math.min(occurrences * 5, 25)
    }

    // Word boundary matches in content
    const contentWords = contentLower.split(/\s+/)
    const matchingWords = contentWords.filter((word) =>
      word.includes(q),
    ).length
    if (matchingWords > 0) {
      score += Math.min(matchingWords * 2, 15)
    }

    // Bonus for matches in headers (lines starting with #)
    const lines = contentLower.split('\n')
    const headerMatches = lines.filter(
      (line) => line.trim().startsWith('#') && line.includes(q),
    ).length
    if (headerMatches > 0) score += headerMatches * 10
  }

  return score
}

export type SearchFilters = {
  categories?: string[]
  statuses?: string[]
  types?: string[]
  authors?: string[]
  implementors?: string[]
}

export type SortOption = 'number-asc' | 'number-desc' | 'title-asc' | 'title-desc' | 'created-asc' | 'created-desc'

function extractNumber(id: string): number {
  const match = id.match(/\d+/)
  return match ? parseInt(match[0], 10) : 0
}

export function searchItems(
  items: SearchableItem[],
  query: string,
  filters: SearchFilters = {},
  sort: SortOption = 'number-asc',
  limit?: number,
): ScoredItem[] {
  const { categories = [], statuses = [], types = [], authors = [], implementors = [] } = filters

  // Apply filters
  let filtered = items.filter((item) => {
    if (categories.length > 0 && !categories.includes(item.category)) {
      return false
    }
    if (statuses.length > 0 && !statuses.includes(item.status)) {
      return false
    }
    if (types.length > 0 && !types.includes(item.type)) {
      return false
    }
    if (authors.length > 0 && !item.authors.some((a) => authors.includes(a))) {
      return false
    }
    if (implementors.length > 0 && !item.implementors.some((i) => implementors.includes(i))) {
      return false
    }
    return true
  })

  const q = query.trim()

  // If no query, return all filtered items with score 0
  if (!q) {
    const results = filtered.map((item) => ({ ...item, score: 0 }))
    return applySorting(results, sort, limit)
  }

  // Score and filter by match
  const scored = filtered
    .map((item) => ({ ...item, score: scoreItem(item, q) }))
    .filter((item) => item.score > 0)

  return applySorting(scored, sort, limit)
}

function applySorting(items: ScoredItem[], sort: SortOption, limit?: number): ScoredItem[] {
  const sorted = [...items]

  switch (sort) {
    case 'number-asc':
      sorted.sort((a, b) => extractNumber(a.id) - extractNumber(b.id))
      break
    case 'number-desc':
      sorted.sort((a, b) => extractNumber(b.id) - extractNumber(a.id))
      break
    case 'title-asc':
      sorted.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'title-desc':
      sorted.sort((a, b) => b.title.localeCompare(a.title))
      break
    case 'created-asc':
      sorted.sort((a, b) => a.created.localeCompare(b.created))
      break
    case 'created-desc':
      sorted.sort((a, b) => b.created.localeCompare(a.created))
      break
  }

  return limit ? sorted.slice(0, limit) : sorted
}

export function highlightSearchTerm(
  text: string,
  searchTerm: string,
): React.ReactNode {
  if (!searchTerm || !text) return text

  const regex = new RegExp(
    `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
    'gi',
  )
  const parts = text.split(regex)

  return parts.map((part, index) => {
    if (part.toLowerCase() === searchTerm.toLowerCase()) {
      return React.createElement(
        'mark',
        {
          key: index,
          className:
            'bg-cf-blue-100 text-cf-blue-900 dark:bg-cf-blue-900/50 dark:text-cf-blue-100 rounded px-0.5',
        },
        part,
      )
    }
    return part
  })
}

export function getContentSnippet(
  content: string,
  searchTerm: string,
  maxLength: number = 100,
): string {
  if (!content || !searchTerm) return ''

  const lowerContent = content.toLowerCase()
  const lowerTerm = searchTerm.toLowerCase()
  const index = lowerContent.indexOf(lowerTerm)

  if (index === -1) return ''

  const start = Math.max(0, index - Math.floor(maxLength / 2))
  const end = Math.min(content.length, start + maxLength)

  let snippet = content.slice(start, end)

  snippet = snippet
    .replace(/#{1,6}\s*/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .trim()

  // Add ellipsis if truncated
  if (start > 0) snippet = '...' + snippet
  if (end < content.length) snippet = snippet + '...'

  return snippet
}
