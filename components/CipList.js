import Filters from "@/components/Filters"
import ListGroup from "@/components/ListGroup"
import { allCIPs } from "contentlayer/generated"

const CipList = ({ className, searchParams, ...props }) => {
  // handle filters
  const filteredCIPs = allCIPs.filter((cip) => {
    if (searchParams.category && !searchParams.category.split(',').includes(cip.Category)) {
      return false
    }
    if (searchParams.status && !searchParams.status.split(',').includes(cip.Status)) {
      return false
    }
    if (searchParams.search) {
      const search = searchParams.search.toLowerCase()
      if (
        !cip.Title.toLowerCase().includes(search) &&
        cip.CIP != search &&
        !cip.Authors.join(',').toLowerCase().includes(search)
      ) {
        return false
      }
    }

    return true
  })

  // sort filtered cips
  filteredCIPs.sort((a, b) => {
    if (searchParams.sort === 'newest') {
      return new Date(b.Created) - new Date(a.Created)
    } else if (searchParams.sort === 'popular') {
      return b.Discussions?.length - a.Discussions?.length
    } else {
      return a.CIP - b.CIP
    }
  })

  return (
    <div className={`${className}`}>
      <Filters type="cip" />
      {!filteredCIPs.length && <p className="text-center text-slate-50 text-xl mt-4">No CIPs found.</p>}
      {!!filteredCIPs.length && <ListGroup items={filteredCIPs} type="cip"/>}
    </div>
  )
}

export default CipList
