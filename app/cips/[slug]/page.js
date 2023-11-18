import { allCIPs } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { Mdx } from "@/components/mdx-components"
import Link from "next/link"
import Badge from "@/components/Badge"

async function getCipFromParams(slug) {
  const cip = allCIPs.find((cip) => cip.slug === slug)

  if (!cip) {
    notFound()
  }

  return cip
}

export async function generateMetadata({params}) {
  const cip = await getCipFromParams(params.slug)

  if (!cip) {
    return notFound()
  }

  return {
    title: `${params.slug} | ${cip.Title}`,
  }
}

// parse authors from the CIP's authors field from string array like "Frederic Johnson <frederic@advanceweb3.com>" into { name, email } objects array
function parseAuthors(authors) {
  return authors.map((author) => {
    const [name, email] = author.split("<")
    return {
      name: name.trim(),
      email: email.replace(">", "").trim(),
    }
  })
}


export default async function Cip({ params }) {
  const cip = await getCipFromParams(params.slug)

  return (
    <div className="pt-40 flex justify-center pb-12">
      <div className="max-w-5xl w-full px-6 sm:px-8 lg:px-12">
        <article>
          <div className="mb-16 flex flex-col">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-cf-blue-50 text-3xl">#{cip.CIP}</span>
                <div>
                  <Badge className={`text-sm`} title={cip.Status} />
                  {cip.Category && <Badge className="text-sm bg-cf-blue-50/70 ring-cf-blue-50/70 text-cf-blue-600 ml-2" title={cip.Category} />}
                </div>
              </div>
              <h1 className="text-5xl font-medium leading-tight tracking-tight text-transparent sm:text-6xl bg-clip-text bg-gradient-to-br from-white via-cf-slate-50 to-cf-blue-50/90">
                {cip.Title}
              </h1>
            </div>
            <div className="mt-4 text-slate-400">
              {cip.Authors && parseAuthors(cip.Authors).map((author ,index) => (
                <Link href={`mailto:${author.email}`} key={index} className="relative truncate hover:underline">
                  {author.name}{index + 1 < cip.Authors.length && ",\u00A0"}
                </Link>
              ))}
            </div>
          </div>

          <div className="prose prose-invert lg:prose-xl mx-auto">
            <Mdx code={cip.body.code} />
          </div>
        </article>
      </div>
    </div>
  )
}
