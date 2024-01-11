import { allCIPs } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Badge from '@/components/Badge'
import Markdown from '@/components/Markdown'

async function getCipFromParams(slug) {
  slug = `CIP-${slug.split('-')[1].padStart(4, '0')}`

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
    openGraph: {
      title: `${params.slug} | ${cip.Title}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${params.slug} | ${cip.Title}`,
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

export default async function Cip({ params }) {
  const cip = await getCipFromParams(params.slug)

  return (
    <div className="pt-24 md:pt-40 flex justify-center pb-12">
      <div className="max-w-5xl w-full px-6 sm:px-8 lg:px-12">
        <article>
          <div className="mb-16 flex flex-col">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-cf-blue-50 text-3xl">#{cip.CIP}</span>
                <div>
                  <Badge className={`text-sm ${cip.statusBadgeColor}`} title={cip.Status} />
                  {cip.Category && <Badge className="text-sm bg-white/10 ring-slate-400 text-slate-200 ml-2" title={cip.Category} />}
                </div>
              </div>
              <h1 className="text-5xl font-medium leading-tight tracking-tight text-transparent sm:text-6xl bg-clip-text bg-gradient-to-br from-white via-cf-slate-50 to-cf-blue-50/90">
                {cip.Title}
              </h1>
            </div>
            <div className="mt-4 text-slate-400 flex flex-wrap">
              Created on&nbsp;
              <time dateTime={cip.Created}>
                {new Date(cip.Created).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              {cip.Authors && <>&nbsp;by&nbsp;</>}
              {cip.Authors && parseAuthors(cip.Authors).map((author ,index) => (
                <>
                  {cip.Authors.length !== 1 && index + 1 === cip.Authors.length && <>&nbsp;and&nbsp;</>}
                  <Link href={`mailto:${author.email}`} key={index} className="relative truncate hover:underline">
                    {author.name}{index + 1 < cip.Authors.length && ",\u00A0"}
                  </Link>
                </>
              ))}
            </div>
          </div>

          <div className="prose prose-invert lg:prose-xl mx-auto prose-code:px-2 prose-code:py-1 prose-code:rounded-md">
            <Markdown content={cip.body.html } />
          </div>
        </article>
      </div>
    </div>
  )
}
