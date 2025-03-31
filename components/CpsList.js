'use client'

import Filters from "@/components/Filters"
import ListGroup from "@/components/ListGroup"
import { allCps } from "content-collections"
import { useMemo, useState, useEffect, useRef, useCallback } from "react"

const INITIAL_ITEMS = 15
const ITEMS_PER_LOAD = 10

const initialCps = allCps.slice(0, INITIAL_ITEMS).map(cps => ({
  ...cps
}))

function getProcessedCps() {
  return allCps.map(cps => ({
    ...cps,
    _lowerTitle: cps.Title.toLowerCase(),
    _lowerStatus: cps.Status.toLowerCase(),
    _lowerAuthors: cps.Authors.join(',').toLowerCase(),
    _cpsString: cps.CPS.toString()
  }))
}

const CpsList = ({ className, searchParams, ...props }) => {
  const [isInitialRender, setIsInitialRender] = useState(true)
  const [processedCps, setProcessedCps] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleItems, setVisibleItems] = useState(INITIAL_ITEMS)
  
  const loaderRef = useRef(null)
  
  useEffect(() => {
    setIsInitialRender(false)
    
    const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 1))
    
    const processDataInChunks = () => {
      idleCallback(() => {
        const processed = getProcessedCps()
        setProcessedCps(processed)
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
    if (isInitialRender || (loading && processedCps.length === 0)) {
      return initialCps
    }
    
    const categories = searchParams.category ? new Set(searchParams.category.split(',')) : null
    const statuses = searchParams.status ? new Set(searchParams.status.split(',').map(s => s.toLowerCase())) : null
    const searchTerm = searchParams.search?.toLowerCase() || null
    
    return processedCps.filter((cps) => {
      if (categories && !categories.has(cps.Category)) {
        return false
      }
      
      if (statuses && !statuses.has(cps._lowerStatus)) {
        return false
      }
      
      if (searchTerm &&
          cps._lowerTitle.indexOf(searchTerm) === -1 &&
          cps._cpsString.indexOf(searchTerm) === -1 &&
          cps._lowerAuthors.indexOf(searchTerm) === -1) {
        return false
      }

      return true
    })
  }, [isInitialRender, processedCps, loading, searchParams.category, searchParams.status, searchParams.search])

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
        return a.CPS - b.CPS
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
      <Filters type="cps" />
      
      {!isInitialRender && loading && (searchParams.category || searchParams.status || searchParams.search) && (
        <div className="space-y-4 mt-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-slate-800 animate-pulse h-24 rounded-lg"></div>
          ))}
        </div>
      )}
      
      {!loading && !filteredItems.length && (
        <p className="text-center text-slate-50 text-xl mt-4">No CPSs found.</p>
      )}
      
      {!!currentItems.length && (
        <>
          <ListGroup items={currentItems} type="cps"/>
          
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

export default CpsList
