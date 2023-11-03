import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-24 z-0 bg-[#001d3e] text-white">
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:bg-gradient-to-br before:from-transparent before:to-blue-700 before:opacity-10 after:from-sky-900 after:via-[#0141ff] after:opacity-40 before:lg:h-[360px] z-[-1]">
        <Image
          className="relative drop-shadow-[0_0_0.3rem_#ffffff70]"
          src="/cardano.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <h1 className="text-5xl font-bold mt-12">create-cf-app</h1>
      <p className="text-xl mt-4">A starting point for Cardano Foundation projects.</p>
      <Link href="#" className="text-blue-400 hover:text-blue-200 font-semibold underline text-lg mt-6">Docs →</Link>
    </main>
  )
}
