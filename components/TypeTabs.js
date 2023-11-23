'use client'

import qs from 'query-string'
import { useSearchParams, useRouter } from "next/navigation"

const TypeTabs = ({ className }) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const type = searchParams.get('type') || 'cip'

  const handleTypeChange = (type) => {
    const query = {
      type,
    }

    const url = qs.stringifyUrl({
      url: window.location.href.split('?')[0],
      query,
    }, { skipNull: true })

    router.replace(url, { scroll: false })
  }

  return (
    <div className={`${className} grid grid-cols-2 text-white border border-gray-100/10 rounded-3xl overflow-hidden`}>
      <button
        className={`${type === 'cip' && 'bg-gradient-to-tl from-white/10 via-35% via-white/[5%] to-transparent'} bg-clip-padding hover:bg-white/[7%] text-xl font-medium border-r border-gray-100/10 py-3 text-slate-50`}
        onClick={() => handleTypeChange('cip')}
      >
        CIP
      </button>
      <button
        className={`${type === 'cps' && 'bg-gradient-to-tr from-white/10 via-35% via-white/[5%] to-transparent'} bg-clip-padding hover:bg-white/[7%] text-xl font-medium border-gray-100/10 py-3 text-slate-50`}
        onClick={() => handleTypeChange('cps')}
      >
        CPS
      </button>
    </div>
  )
}

export default TypeTabs
