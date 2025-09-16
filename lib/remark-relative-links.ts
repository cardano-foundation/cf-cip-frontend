import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root } from 'mdast'

interface RemarkRelativeLinksOptions {
  basePath?: string
  docType?: 'cip' | 'cps'
  docId?: string
}

const remarkRelativeLinks: Plugin<[RemarkRelativeLinksOptions?], Root> = (
  options = {},
) => {
  return (tree) => {
    visit(tree, 'link', (node) => {
      if (typeof node.url === 'string' && node.url.startsWith('./')) {
        const { basePath = '', docType, docId } = options
        const relativePath = node.url.replace('./', '')

        // Extract anchor if present
        const [filePath, anchor] = relativePath.split('#')
        const anchorPart = anchor ? `#${anchor}` : ''

        if (filePath.includes('.md') || filePath.endsWith('README.md')) {
          // Handle markdown files - convert to annex URLs
          let annexPath = filePath.replace('.md', '')

          // Handle subdirectory files like CPD/README.md -> CPD
          if (annexPath.includes('/')) {
            const pathParts = annexPath
              .split('/')
              .filter((part) => part.length > 0)
            // For subdirectory README files, use just the directory name
            if (filePath.endsWith('/README.md')) {
              annexPath = pathParts.slice(0, -1).join('-') // Remove 'README' part
            } else {
              annexPath = pathParts.join('-')
            }
          }

          node.url = `${basePath}/annex/${annexPath}${anchorPart}`
        } else if (docType && docId) {
          // Handle non-markdown files - link to GitHub raw
          const githubPath =
            docType === 'cip'
              ? docId
                  .replace('cip-', 'CIP-')
                  .replace(/(\d+)/, (match) => match.padStart(4, '0'))
              : docId
                  .replace('cps-', 'CPS-')
                  .replace(/(\d+)/, (match) => match.padStart(4, '0'))

          node.url = `https://raw.githubusercontent.com/cardano-foundation/CIPs/master/${githubPath}/${relativePath}`
        }
      }
    })
  }
}

export default remarkRelativeLinks
