const Badge = ({ className, title }) => (
  <span className={`${className} inline-flex items-center rounded-md px-2 py-1 h-6 text-xs font-medium ring-1 ring-inset`}>
    {title}
  </span>
)

export default Badge
