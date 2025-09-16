'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useMounted } from '@/lib/useMounted'
import mermaid from 'mermaid'

import 'remark-github-alerts/styles/github-colors-dark-class.css'
import 'remark-github-alerts/styles/github-base.css'

const Markdown = ({ content }: { content: string }) => {
  const pathname = usePathname()
  const mounted = useMounted()

  // update images with relative paths if mounted
  useEffect(() => {
    if (mounted) {
      // handle images with relative paths (both ./path and path patterns)
      const allImages = document.querySelectorAll('img')
      const relativePathImages = Array.from(allImages).filter((img) => {
        const src = img.getAttribute('src') || img.src
        // Check if it's a relative path (not starting with http, https, //, or /)
        return src && !src.match(/^(https?:\/\/|\/\/|\/|data:)/)
      })
      Array.from(relativePathImages).forEach((image) => {
        const imgElement = image as HTMLImageElement
        const pathSegments = pathname.split('/')
        const docType = pathSegments[1] // 'cip' or 'cps'
        const docId = pathSegments[2] // e.g., 'cip-0003'

        // Convert to proper GitHub path format
        const githubPath =
          docType === 'cip'
            ? docId
                .replace('cip-', 'CIP-')
                .replace(/(\d+)/, (match) => match.padStart(4, '0'))
            : docId
                .replace('cps-', 'CPS-')
                .replace(/(\d+)/, (match) => match.padStart(4, '0'))

        // Extract the relative path from the src attribute
        const originalSrc = imgElement.getAttribute('src') || imgElement.src
        const imageRelativePath = originalSrc.startsWith('./')
          ? originalSrc.replace('./', '')
          : originalSrc

        // Check if we're in a subdirectory (annex page)
        const isAnnexPage = pathSegments[3] === 'annex'
        let fullImagePath = ''

        if (isAnnexPage) {
          // For annex pages, images are relative to the subdirectory
          const annexName = pathSegments[4] // e.g., 'CPD'
          fullImagePath = `${githubPath}/${annexName}/${imageRelativePath}`
        } else {
          // For main pages, images are relative to the document root
          fullImagePath = `${githubPath}/${imageRelativePath}`
        }

        imgElement.src = `https://raw.githubusercontent.com/cardano-foundation/CIPs/master/${fullImagePath}`
      })

      // handle links with relative paths
      const links = document.querySelectorAll('a[href^="./"]')
      Array.from(links).forEach((link) => {
        const linkElement = link as HTMLAnchorElement
        const href = linkElement.href

        const fileRelativePath = href.split('/').slice(4).join('/')

        // Extract anchor if present (e.g., #section-name)
        const [filePath, anchor] = fileRelativePath.split('#')
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

          const newUrl = `${pathname}/annex/${annexPath}${anchorPart}`
          linkElement.href = newUrl
        } else {
          // Handle non-markdown files - link to GitHub raw
          const pathSegments = pathname.split('/')
          const docType = pathSegments[1] // 'cip' or 'cps'
          const docId = pathSegments[2] // e.g., 'cip-0003'

          // Convert to proper GitHub path format
          const githubPath =
            docType === 'cip'
              ? docId
                  .replace('cip-', 'CIP-')
                  .replace(/(\d+)/, (match) => match.padStart(4, '0'))
              : docId
                  .replace('cps-', 'CPS-')
                  .replace(/(\d+)/, (match) => match.padStart(4, '0'))

          const newUrl = `https://raw.githubusercontent.com/cardano-foundation/CIPs/master/${githubPath}/${fileRelativePath}`
          linkElement.href = newUrl
        }
      })
    }
  }, [mounted, pathname])

  useEffect(() => {
    if (mounted) {
      mermaid.init(undefined, document.querySelectorAll('.mermaid'))
    }
  }, [mounted])

  return <div dangerouslySetInnerHTML={{ __html: content }} />
}

export default Markdown
