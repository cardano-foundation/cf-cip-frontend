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

export default function remarkRemoveToc() {
  return (tree: Node) => {
    const nodesToRemove: { node: Node; index: number; parent: Parent }[] = []
    let foundTocHeading = false
    let tocLevel = 0

    visit(
      tree,
      (node: Node, index: number | undefined, parent: Parent | null) => {
        if (node.type === 'heading') {
          const headingText = getHeadingText(node as HeadingNode).toLowerCase()

          if (isTocHeading(headingText)) {
            foundTocHeading = true
            tocLevel = (node as HeadingNode).depth
            if (parent && index !== undefined) {
              nodesToRemove.push({ node, index, parent })
            }
            return
          }

          if (foundTocHeading && (node as HeadingNode).depth <= tocLevel) {
            foundTocHeading = false
            tocLevel = 0
          }
        }

        if (foundTocHeading && parent && index !== undefined) {
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
  const tocPatterns = [
    'table of contents',
    'toc',
    'contents',
    'outline',
    'index',
  ]

  return tocPatterns.some((pattern) => text.includes(pattern))
}
