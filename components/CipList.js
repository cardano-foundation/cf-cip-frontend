import Filters from "@/components/Filters"
import ListGroup from "@/components/ListGroup"

const CipList = ({ className, ...props }) => (
  <div className={`${className}`}>
    <Filters />

    <ListGroup />
  </div>
)

export default CipList
