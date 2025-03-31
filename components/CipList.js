'use client'

import Filters from "@/components/Filters"
import ListGroup from "@/components/ListGroup"
import { allCips } from "content-collections"
import { useMemo, useState, useEffect, useRef, useCallback } from "react"

const INITIAL_ITEMS = 15
const ITEMS_PER_LOAD = 10

const initialCips = allCips.slice(0, INITIAL_ITEMS).map(cip => ({
  ...cip
}))

function getProcessedCips() {
  return allCips.map(cip => ({
    ...cip,
    _lowerTitle: cip.Title.toLowerCase(),
    _lowerStatus: cip.Status.split(' ')[0].toLowerCase(),
    _lowerAuthors: cip.Authors.join(',').toLowerCase(),
    _cipString: cip.CIP.toString()
  }))
}

const CipList = ({ className, searchParams, ...props }) => {
  const [isInitialRender, setIsInitialRender] = useState(true)
  const [processedCips, setProcessedCips] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleItems, setVisibleItems] = useState(INITIAL_ITEMS)
  
  const loaderRef = useRef(null)
  
  useEffect(() => {
    setIsInitialRender(false)
    
    const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 1))
    
    const processDataInChunks = () => {
      idleCallback(() => {
        const processed = getProcessedCips()
        setProcessedCips(processed)
        setLoading(false)
      })
    }
    
    processDataInChunks()
    
    return () => {
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(idleCallback)
      }
    }
  }, [])

  const filteredItems = useMemo(() => {
    if (isInitialRender || (loading && processedCips.length === 0)) {
      return initialCips
    }
    
    const categories = searchParams.category ? new Set(searchParams.category.split(',')) : null
    const statuses = searchParams.status ? new Set(searchParams.status.split(',').map(s => s.toLowerCase())) : null
    const searchTerm = searchParams.search?.toLowerCase() || null
    
    return processedCips.filter((cip) => {
      if (categories && !categories.has(cip.Category)) {
        return false
      }
      
      if (statuses && !statuses.has(cip._lowerStatus)) {
        return false
      }
      
      if (searchTerm &&
          cip._lowerTitle.indexOf(searchTerm) === -1 &&
          cip._cipString.indexOf(searchTerm) === -1 &&
          cip._lowerAuthors.indexOf(searchTerm) === -1) {
        return false
      }

      return true
    })
  }, [isInitialRender, processedCips, loading, searchParams.category, searchParams.status, searchParams.search])

  const sortedItems = useMemo(() => {
    if (filteredItems.length === 0) return []
    
    return [...filteredItems].sort((a, b) => {
      if (searchParams.sort === 'newest') {
        const dateA = new Date(a.Created)
        const dateB = new Date(b.Created)
        return dateB - dateA
      } else if (searchParams.sort === 'popular') {
        const discussionsA = a.Discussions?.length || 0
        const discussionsB = b.Discussions?.length || 0
        return discussionsB - discussionsA
      } else {
        return a.CIP - b.CIP
      }
    })
  }, [filteredItems, searchParams.sort])

  useEffect(() => {
    if (!isInitialRender) {
      setVisibleItems(INITIAL_ITEMS)
    }
  }, [isInitialRender, searchParams])

  const currentItems = useMemo(() => {
    return sortedItems.slice(0, visibleItems)
  }, [sortedItems, visibleItems])

  const handleObserver = useCallback(
    (entries) => {
      const [entry] = entries
      if (entry.isIntersecting && !loading) {
        setVisibleItems(prev => Math.min(prev + ITEMS_PER_LOAD, sortedItems.length))
      }
    },
    [loading, sortedItems.length]
  )

  useEffect(() => {
    if (!loaderRef.current) return
    
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    })
    
    observer.observe(loaderRef.current)
    
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current)
      }
    }
  }, [handleObserver])

  const hasMore = visibleItems < sortedItems.length

  return (
    <div className={`${className}`}>
      <Filters type="cip" />
      
      {!isInitialRender && loading && (searchParams.category || searchParams.status || searchParams.search) && (
        <div className="space-y-4 mt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-slate-800 animate-pulse h-24 rounded-lg"></div>
          ))}
        </div>
      )}
      
      {!loading && !filteredItems.length && (
        <p className="text-center text-slate-50 text-xl mt-4">No CIPs found.</p>
      )}
      
      {!!currentItems.length && (
        <>
          <ListGroup items={currentItems} type="cip"/>
          
          {hasMore && (
            <div 
              ref={loaderRef} 
              className="h-4"
            />
          )}
        </>
      )}
    </div>
  )
}

export default CipList
