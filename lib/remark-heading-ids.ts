import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Heading, Root } from 'mdast'

type HeadingData = {
  id?: string
  hProperties?: Record<string, unknown>
  [key: string]: unknown
}

type HeadingNode = Heading & {
  data?: HeadingData
}

const remarkHeadingIds: Plugin<[], Root> = () => (tree) => {
  const usedSlugs = new Set<string>()

  visit(tree, 'heading', (node: HeadingNode) => {
    const data = (node.data ??= {}) as HeadingData
    const properties = (data.hProperties ??= {}) as Record<string, unknown>

    const existingId = getExistingId(data, properties)
    if (existingId) {
      usedSlugs.add(existingId)
      return
    }

    const headingText = extractHeadingText(node)
    if (!headingText) {
      return
    }

    const baseSlug = createSlug(headingText)
    const uniqueSlug = ensureUniqueSlug(baseSlug, usedSlugs)

    properties.id = uniqueSlug
    data.id = uniqueSlug
  })
}

function getExistingId(
  data: HeadingData,
  properties: Record<string, unknown>,
): string | undefined {
  if (typeof data.id === 'string' && data.id.trim().length > 0) {
    return data.id.trim()
  }

  const candidate = properties.id
  if (typeof candidate === 'string' && candidate.trim().length > 0) {
    return candidate.trim()
  }

  return undefined
}

function extractHeadingText(node: HeadingNode): string {
  return node.children
    .map((child) => getNodeText(child))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getNodeText(node: any): string {
  if (!node) return ''
  if (typeof node.value === 'string') {
    return node.value
  }
  if (Array.isArray(node.children)) {
    return node.children.map(getNodeText).join(' ')
  }
  return ''
}

function createSlug(value: string): string {
  const normalized = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return normalized || 'heading'
}

function ensureUniqueSlug(base: string, used: Set<string>): string {
  let candidate = base
  let index = 1

  while (used.has(candidate)) {
    candidate = `${base}-${index}`
    index += 1
  }

  used.add(candidate)
  return candidate
}

export default remarkHeadingIds
