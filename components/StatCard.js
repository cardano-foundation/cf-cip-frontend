const StatCard = ({ className, data }) => (
  <div className={`${className} relative flex flex-col items-center justify-center p-8 rounded-[3rem] border border-gray-50/10 bg-clip-padding bg-gradient-to-t from-white/[7%] via-white/[4%] to-transparent`}>
    {Object.entries(data).map(([key, value], index) => (
      <div key={index} className="flex flex-col items-center">
        <span className="mt-3 text-5xl text-slate-50 font-medium">{value}</span>
        <span className="text-lg text-slate-200 mt-3">{key}</span>
      </div>
    ))}
  </div>
)

export default StatCard
