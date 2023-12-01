import { allCPs } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import Link from "next/link"
import Badge from "@/components/Badge"

async function getCpsFromParams(slug) {
  const cps = allCPs.find((cps) => cps.slug === slug)

  if (!cps) {
    notFound()
  }

  return cps
}

export async function generateMetadata({params}) {
  const cps = await getCpsFromParams(params.slug)

  if (!cps) {
    return notFound()
  }

  return {
    title: `${params.slug} | ${cps.Title}`,
    openGraph: {
      title: `${params.slug} | ${cps.Title}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${params.slug} | ${cps.Title}`,
      creator: "@Cardano_CF",
    },
  }
}

function parseAuthors(authors) {
  return authors.map((author) => {
    const [name, email] = author.split("<");
    return {
      name: name.trim(),
      email: email ? email.replace(">", "").trim() : null,
    }
  })
}

export default async function Cps({ params }) {
  const cps = await getCpsFromParams(params.slug)

  return (
    <div className="pt-24 md:pt-40 flex justify-center pb-12">
      <div className="max-w-5xl w-full px-6 sm:px-8 lg:px-12">
        <article>
          <div className="mb-16 flex flex-col">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-cf-blue-50 text-3xl">#{cps.CPS}</span>
                <div>
                  <Badge className={`text-sm ${cps.statusBadgeColor}`} title={cps.Status} />
                  {cps.Category && <Badge className="text-sm bg-white/10 ring-slate-400 text-slate-200 ml-2" title={cps.Category} />}
                </div>
              </div>
              <h1 className="text-5xl font-medium leading-tight tracking-tight text-transparent sm:text-6xl bg-clip-text bg-gradient-to-br from-white via-cf-slate-50 to-cf-blue-50/90">
                {cps.Title}
              </h1>
            </div>
            <div className="mt-4 text-slate-400 flex flex-wrap">
              Created on&nbsp;
              <time dateTime={cps.Created}>
                {new Date(cps.Created).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              {cps.Authors && <>&nbsp;by&nbsp;</>}
              {cps.Authors && parseAuthors(cps.Authors).map((author ,index) => (
                <>
                  {cps.Authors.length !== 1 && index + 1 === cps.Authors.length && <>&nbsp;and&nbsp;</>}
                  <Link href={`mailto:${author.email}`} key={index} className="relative truncate hover:underline">
                    {author.name}{index + 1 < cps.Authors.length && ",\u00A0"}
                  </Link>
                </>
              ))}
            </div>
          </div>

          <div className="prose prose-invert lg:prose-xl mx-auto">
            <div dangerouslySetInnerHTML={{ __html: cps.body.html }} />
          </div>
        </article>
      </div>
    </div>
  )
}
