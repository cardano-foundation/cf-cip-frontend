const StatCard = ({ className, ...props }) => (
  <div className={`${className} relative flex flex-col items-center justify-center p-8 rounded-[3rem] border border-gray-50/10 bg-clip-padding bg-gradient-to-t from-white/[7%] via-white/[4%] to-transparent`}>
    <div
      className="fill-current text-cf-blue-50"
      dangerouslySetInnerHTML={{ __html: props.icon }}
    />
    <span className="mt-3 text-5xl text-slate-50 font-medium">{props.stat}</span>
    <span className="text-lg text-slate-200 mt-3">{props.description}</span>
  </div>
)

export default StatCard
