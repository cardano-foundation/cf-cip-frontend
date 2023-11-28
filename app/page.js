import StatCard from '@/components/StatCard'
import CipList from '@/components/CipList'
import CpsList from '@/components/CpsList'
import Stats from '@/data/stats.json'
import TypeTabs from '@/components/TypeTabs'

export default function Home({searchParams}) {
  const statCardData = [
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 fill-current text-slate-100" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16.604 11.048a5.67 5.67 0 0 0 .751-3.44c-.179-1.784-1.175-3.361-2.803-4.44l-1.105 1.666c1.119.742 1.8 1.799 1.918 2.974a3.693 3.693 0 0 1-1.072 2.986l-1.192 1.192 1.618.475C18.951 13.701 19 17.957 19 18h2c0-1.789-.956-5.285-4.396-6.952z"></path><path d="M9.5 12c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4zm0-6c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2zm1.5 7H8c-3.309 0-6 2.691-6 6v1h2v-1c0-2.206 1.794-4 4-4h3c2.206 0 4 1.794 4 4v1h2v-1c0-3.309-2.691-6-6-6z"></path></svg>',
      tooltip: 'Number of people that have contributed to this project.'
    },
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 fill-current text-slate-100" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M9 20h6v2H9zm7.906-6.288C17.936 12.506 19 11.259 19 9c0-3.859-3.141-7-7-7S5 5.141 5 9c0 2.285 1.067 3.528 2.101 4.73.358.418.729.851 1.084 1.349.144.206.38.996.591 1.921H8v2h8v-2h-.774c.213-.927.45-1.719.593-1.925.352-.503.726-.94 1.087-1.363zm-2.724.213c-.434.617-.796 2.075-1.006 3.075h-2.351c-.209-1.002-.572-2.463-1.011-3.08a20.502 20.502 0 0 0-1.196-1.492C7.644 11.294 7 10.544 7 9c0-2.757 2.243-5 5-5s5 2.243 5 5c0 1.521-.643 2.274-1.615 3.413-.373.438-.796.933-1.203 1.512z"></path></svg>',
      tooltip: 'Total number of CIPs.'
    },
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 fill-current text-slate-100" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM12 20c-4.411 0-8-3.589-8-8s3.567-8 7.953-8C16.391 4 20 7.589 20 12s-3.589 8-8 8z"></path><path d="M11 7h2v7h-2zm0 8h2v2h-2z"></path></svg>',
      tooltip: 'Total number of CPSs.'
    },
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 fill-current text-slate-100" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M2.5 18.5C2.5 20.43 4.07 22 6 22s3.5-1.57 3.5-3.5c0-1.58-1.06-2.903-2.5-3.337v-3.488c.244.273.509.527.813.744 1.18.844 2.617 1.098 3.918 1.098.966 0 1.853-.14 2.506-.281a3.5 3.5 0 0 0 3.264 2.265c1.93 0 3.5-1.57 3.5-3.5s-1.57-3.5-3.5-3.5a3.5 3.5 0 0 0-3.404 2.718c-1.297.321-3.664.616-5.119-.426-.666-.477-1.09-1.239-1.306-2.236C8.755 7.96 9.5 6.821 9.5 5.5 9.5 3.57 7.93 2 6 2S2.5 3.57 2.5 5.5c0 1.58 1.06 2.903 2.5 3.337v6.326c-1.44.434-2.5 1.757-2.5 3.337zm15-8c.827 0 1.5.673 1.5 1.5s-.673 1.5-1.5 1.5S16 12.827 16 12s.673-1.5 1.5-1.5zm-10 8c0 .827-.673 1.5-1.5 1.5s-1.5-.673-1.5-1.5S5.173 17 6 17s1.5.673 1.5 1.5zm-3-13C4.5 4.673 5.173 4 6 4s1.5.673 1.5 1.5S6.827 7 6 7s-1.5-.673-1.5-1.5z"></path></svg>',
      tooltip: 'Number of merged pull requests in the past month.'
    },
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 fill-current text-slate-100" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.01 15.163V7.997C19.005 6.391 17.933 4 15 4V2l-4 3 4 3V6c1.829 0 2.001 1.539 2.01 2v7.163c-1.44.434-2.5 1.757-2.5 3.337 0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5c0-1.58-1.06-2.903-2.5-3.337zm-1 4.837c-.827 0-1.5-.673-1.5-1.5s.673-1.5 1.5-1.5 1.5.673 1.5 1.5-.673 1.5-1.5 1.5zM9.5 5.5C9.5 3.57 7.93 2 6 2S2.5 3.57 2.5 5.5c0 1.58 1.06 2.903 2.5 3.337v6.326c-1.44.434-2.5 1.757-2.5 3.337C2.5 20.43 4.07 22 6 22s3.5-1.57 3.5-3.5c0-1.58-1.06-2.903-2.5-3.337V8.837C8.44 8.403 9.5 7.08 9.5 5.5zm-5 0C4.5 4.673 5.173 4 6 4s1.5.673 1.5 1.5S6.827 7 6 7s-1.5-.673-1.5-1.5zm3 13c0 .827-.673 1.5-1.5 1.5s-1.5-.673-1.5-1.5S5.173 17 6 17s1.5.673 1.5 1.5z"></path></svg>',
      tooltip: 'Number of open pull requests.'
    },
  ]

  const type = searchParams.type || 'cip'

  return (
    <main className="relative isolate bg-cf-blue-900 min-h-screen">
      <div className="flex items-center justify-center bg-transparent pb-12 pt-24 md:pt-40">
        <div className="mx-auto flex flex-col w-full max-w-7xl items-center justify-center px-6 sm:px-8 lg:px-12">
          <h1 className="text-5xl font-medium leading-tight tracking-tight text-transparent sm:text-[5rem] text-center bg-clip-text bg-gradient-to-br from-white via-cf-slate-50 to-cf-blue-50/90">
            Cardano Improvement <br /> Proposals
          </h1>

          <div className="pt-12 md:mt-24 grid w-full grid-cols-1 gap-4 md:grid-cols-5">
            {Stats.stats.map((stat, index) => (
              Object.entries(stat).map(([key, value], subIndex) => (
                <StatCard
                  icon={statCardData[subIndex].icon}
                  tooltip={statCardData[subIndex].tooltip}
                  key={`${index}-${subIndex}`}
                  data={{[key]: value}}
                />
              ))
            ))}
          </div>
          <div className="mt-24 w-full">
            <TypeTabs className="w-full" />
            {type === 'cip' && <CipList className="w-full" searchParams={searchParams} />}
            {type === 'cps' && <CpsList className="w-full" searchParams={searchParams} />}
          </div>
        </div>
      </div>

      {/* Background gradient */}
      <div className="absolute top-0 left-0 w-full h-screen -z-10" style={{
        background: 'radial-gradient(ellipse 80% 70% at 50% -20%,rgba(248,250,252,0.15), hsla(0,0%,100%,0)'
      }} />
    </main>
  )
}
