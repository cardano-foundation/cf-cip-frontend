import Filters from "@/components/Filters"
import ListGroup from "@/components/ListGroup"
import { allCIPs } from "contentlayer/generated"

const CipList = ({ className, ...props }) => (
  <div className={`${className}`}>
    <Filters />
    <ListGroup items={allCIPs} type="cips" />
  </div>
)

export default CipList
