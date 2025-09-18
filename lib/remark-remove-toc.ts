import { visit } from 'unist-util-visit'
import type { Node, Parent } from 'unist'

interface HeadingNode extends Node {
  type: 'heading'
  depth: number
  children: Node[]
}

interface TextNode extends Node {
  type: 'text'
  value: string
}

interface InlineCodeNode extends Node {
  type: 'inlineCode'
  value: string
}

interface HtmlNode extends Node {
  type: 'html'
  value: string
}

export default function remarkRemoveToc() {
  return (tree: Node) => {
    const nodesToRemove: { node: Node; index: number; parent: Parent }[] = []
    let tocMode: 'none' | 'heading' | 'html' = 'none'
    let tocLevel = 0

    visit(
      tree,
      (node: Node, index: number | undefined, parent: Parent | null) => {
        if (!parent || index === undefined) return

        if (tocMode === 'heading') {
          if (node.type === 'heading' && (node as HeadingNode).depth <= tocLevel) {
            tocMode = 'none'
            tocLevel = 0
            return
          }

          nodesToRemove.push({ node, index, parent })
          return
        }

        if (tocMode === 'html') {
          nodesToRemove.push({ node, index, parent })

          if (node.type === 'html' && isTocHtmlClose(node as HtmlNode)) {
            tocMode = 'none'
          }

          return
        }

        if (node.type === 'heading') {
          const headingText = getHeadingText(node as HeadingNode).toLowerCase()

          if (isTocHeading(headingText)) {
            tocMode = 'heading'
            tocLevel = (node as HeadingNode).depth
            nodesToRemove.push({ node, index, parent })
          }

          return
        }

        if (node.type === 'html' && isTocHtmlOpen(node as HtmlNode)) {
          tocMode = 'html'
          nodesToRemove.push({ node, index, parent })
        }
      },
    )

    nodesToRemove.reverse().forEach(({ index, parent }) => {
      parent.children.splice(index, 1)
    })
  }
}

function getHeadingText(node: HeadingNode): string {
  if (!node.children) return ''

  return node.children
    .map((child) => {
      if (child.type === 'text') return (child as TextNode).value
      if (child.type === 'inlineCode') return (child as InlineCodeNode).value
      if ('children' in child) return getHeadingText(child as HeadingNode)
      return ''
    })
    .join('')
    .trim()
}

function isTocHeading(text: string): boolean {
  const normalized = text.toLowerCase()

  if (normalized.includes('table of contents')) return true
  if (normalized.includes('table-of-contents')) return true

  const tokens = normalized
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean)

  const tocTokens = new Set(['toc', 'contents', 'outline', 'index'])

  return tokens.some((token) => tocTokens.has(token))
}

function isTocHtmlOpen(node: HtmlNode): boolean {
  const value = node.value.toLowerCase()

  if (!value.includes('<details')) return false
  if (!value.includes('<summary')) return false

  return isTocHeading(normalizeHtmlText(value))
}

function isTocHtmlClose(node: HtmlNode): boolean {
  return node.value.trim().toLowerCase() === '</details>'
}

function normalizeHtmlText(value: string): string {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}
