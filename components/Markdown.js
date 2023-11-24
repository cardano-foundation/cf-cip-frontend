'use client'

import { useRouter, usePathname } from 'next/navigation'
import {useEffect} from "react";

const Markdown = ({ content }) => {
  const router = useRouter()
  const pathname = usePathname()

  const handleClick = (e) => {
    e.preventDefault()

    const href = e.currentTarget.getAttribute('href')

    const newUrl = `${pathname}/annex/${href.split('./')[1]}`

    router.push(newUrl)
  }

  useEffect(() => {
    const links = document.querySelectorAll('a[href^="./"]')

    Array.from(links).forEach(link => {
      link.addEventListener('click', handleClick)
    })

    return () => {
      Array.from(links).forEach(link => {
        link.removeEventListener('click', handleClick);
      });
    }
  }, [ ])

  return (
    <div dangerouslySetInnerHTML={{__html: content}}/>
  )
}

export default Markdown
