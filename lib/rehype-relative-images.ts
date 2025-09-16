import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, Element } from 'hast'

interface RehypeRelativeImagesOptions {
  docType?: 'cip' | 'cps'
  docId?: string
  isAnnexPage?: boolean
  annexName?: string
}

const rehypeRelativeImages: Plugin<[RehypeRelativeImagesOptions?], Root> = (
  options = {},
) => {
  return (tree) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'img' && node.properties && node.properties.src) {
        const src = node.properties.src as string

        if (
          typeof src === 'string' &&
          !src.match(/^(https?:\/\/|\/\/|\/|data:)/)
        ) {
          const { docType, docId, isAnnexPage, annexName } = options

          if (!docType || !docId) return

          // Convert to proper GitHub path format
          const githubPath =
            docType === 'cip'
              ? docId
                  .replace('cip-', 'CIP-')
                  .replace(/(\d+)/, (match) => match.padStart(4, '0'))
              : docId
                  .replace('cps-', 'CPS-')
                  .replace(/(\d+)/, (match) => match.padStart(4, '0'))

          // Extract the relative path
          const imageRelativePath = src.startsWith('./')
            ? src.replace('./', '')
            : src

          // Build the full image path
          let fullImagePath = ''

          if (isAnnexPage && annexName) {
            // For annex pages, images are relative to the subdirectory
            fullImagePath = `${githubPath}/${annexName}/${imageRelativePath}`
          } else {
            // For main pages, images are relative to the document root
            fullImagePath = `${githubPath}/${imageRelativePath}`
          }

          node.properties.src = `https://raw.githubusercontent.com/cardano-foundation/CIPs/master/${fullImagePath}`
        }
      }
    })
  }
}

export default rehypeRelativeImages
