import Filters from "@/components/Filters"
import ListGroup from "@/components/ListGroup"
import { allCPs } from "contentlayer/generated"

const CpsList = ({ className, searchParams, ...props }) => {
  // handle filters
  const filteredCPs = allCPs.filter((cps) => {
    if (searchParams.category && !searchParams.category.split(',').includes(cps.Category)) {
      return false
    }
    if (searchParams.status && !searchParams.status.split(',').includes(cps.Status)) {
      return false
    }
    if (searchParams.search) {
      const search = searchParams.search.toLowerCase()
      if (
        !cps.Title.toLowerCase().includes(search) &&
        cps.CPS != search &&
        !cps.Authors.join(',').toLowerCase().includes(search)
      ) {
        return false
      }
    }

    return true
  })

  // sort filtered cpss
  filteredCPs.sort((a, b) => {
    if (searchParams.sort === 'newest') {
      return new Date(b.Created) - new Date(a.Created)
    } else if (searchParams.sort === 'popular') {
      return b.Discussions?.length - a.Discussions?.length
    } else {
      return a.CPS - b.CPS
    }
  })

  return (
    <div className={`${className}`}>
      <Filters type="cps" />
      {!filteredCPs.length && <p className="text-center text-slate-50 text-xl mt-4">No CPSs found.</p>}
      {!!filteredCPs.length && <ListGroup items={filteredCPs} type="cps"/>}
    </div>
  )
}

export default CpsList
