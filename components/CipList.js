import Filters from "@/components/Filters"
import ListGroup from "@/components/ListGroup"
import table from "@/CIPs/table.json"

const CipList = ({ className, ...props }) => (
  <div className={`${className}`}>
    <Filters />
    <ListGroup items={table} />
  </div>
)

export default CipList
