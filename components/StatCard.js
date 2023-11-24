const StatCard = ({ className, data, ...props }) => (
  <div className={`${className} relative flex flex-col items-center justify-center p-2 md:p-8 rounded-[3rem] border border-gray-50/10 bg-clip-padding bg-gradient-to-t from-white/[7%] via-white/[4%] to-transparent`}>
    {Object.entries(data).map(([key, value], index) => (
      <div key={index} className="flex flex-col items-center">
        <div
          className="fill-current text-cf-blue-50"
          dangerouslySetInnerHTML={{ __html: props.icon }}
        />
        <span className="mt-1 lg:mt-3 text-4xl lg:text-5xl text-slate-50 font-medium">{value}</span>
        <span className="text-sm lg:text-lg text-slate-200 mt-1 lg:mt-2">{key}</span>
      </div>
    ))}
  </div>
)

export default StatCard
