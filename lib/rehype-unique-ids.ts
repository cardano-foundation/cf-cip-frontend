import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Element, Root } from 'hast'

const rehypeUniqueIds: Plugin<[], Root> = () => (tree) => {
  const used = new Set<string>()

  visit(tree, 'element', (node: Element) => {
    if (!node || !node.properties) return

    const tagName = node.tagName
    if (!tagName || !/^h[1-6]$/i.test(tagName)) {
      return
    }

    const value = node.properties.id
    if (typeof value !== 'string') return

    const base = value.trim()
    if (!base) return

    let candidate = base
    let index = 1

    while (used.has(candidate)) {
      candidate = `${base}-${index}`
      index += 1
    }

    if (candidate !== value) {
      node.properties.id = candidate
    }

    used.add(candidate)
  })
}

export default rehypeUniqueIds
