'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useMounted} from '@/lib/useMounted'
import mermaid from 'mermaid'

import "remark-github-alerts/styles/github-colors-dark-class.css"
import "remark-github-alerts/styles/github-base.css";

const Markdown = ({ content }) => {
  const pathname = usePathname()
  const mounted = useMounted()

  // update images with relative paths if mounted
  useEffect(() => {
    if (mounted) {
      // handle images with relative paths
      const relativePathImages = document.querySelectorAll('img[src^="./"]')
      Array.from(relativePathImages).forEach(image => {
        const cip = pathname.split('/')[2]
        const imageRelativePath = image.src.split('/').slice(4).join('/')

        image.src = `https://raw.githubusercontent.com/cardano-foundation/CIPs/master/${cip}/${imageRelativePath}`
      })

      // handle links with relative paths
      const links = document.querySelectorAll('a[href^="./"]')
      Array.from(links).forEach(link => {
        const href = link.href

        const fileRelativePath = href.split('/').slice(4).join('/')

        let newUrl = `${pathname}/annex/${fileRelativePath.split('.')[0]}`

        if (!fileRelativePath.includes('.md')) {
          const cip = pathname.split('/')[2]
          newUrl = `https://raw.githubusercontent.com/cardano-foundation/CIPs/master/${cip}/${fileRelativePath}`
        }

        link.href = newUrl
      })
    }
  }, [mounted])

  useEffect(() => {
    if (mounted) {
      mermaid.init(undefined, document.querySelectorAll('.mermaid'))
    }
  }, [mounted])

  return (
    <div dangerouslySetInnerHTML={{ __html: content }} />
  )
}

export default Markdown
