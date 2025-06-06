import { allCpsAnnexes } from 'content-collections'
import { notFound } from 'next/navigation'
import Markdown from '@/components/Markdown'

export async function generateStaticParams() {
  return allCpsAnnexes.map((annex) => {
    const parts = annex.slug.split('-')
    const slugParam = parts.slice(0, 2).join('-')
    const annexParam = parts.slice(2).join('-')
    return { slug: slugParam, annex: annexParam }
  })
}

function getAnnexFromParams(slug, annexSlug) {
  slug = `CPS-${slug.split('-')[1].padStart(4, '0')}`

  const annex = allCpsAnnexes.find((annex) => annex.slug === `${slug}-${annexSlug}`)

  if (!annex) {
    notFound()
  }

  return annex
}

export async function generateMetadata(props) {
  const params = await props.params;
  const annex = await getAnnexFromParams(params.slug, params.annex)

  if (!annex) {
    return notFound()
  }

  return {
    title: `${params.slug} | ${params.annex.split('.')[0]}`,
    openGraph: {
      title: `${params.slug} | ${params.annex.split('.')[0]}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${params.slug} | ${params.annex.split('.')[0]}`,
      creator: "@Cardano_CF",
    },
  }
}

export default async function CpsAnnex(props) {
  const params = await props.params;
  const annex = getAnnexFromParams(params.slug, params.annex)

  return (
    <div className="pt-24 md:pt-40 flex justify-center pb-12">
      <div className="max-w-5xl w-full px-6 sm:px-8 lg:px-12">
        <article>
          <div className="mb-16 flex flex-col">
            <h1 className="text-5xl font-medium leading-tight tracking-tight text-transparent sm:text-6xl bg-clip-text bg-gradient-to-br from-white via-cf-slate-50 to-cf-blue-50/90">
              Annex of {params.slug} - {params.annex.split('.')[0]}
            </h1>
          </div>

          <div className="prose prose-invert lg:prose-xl mx-auto">
            <Markdown content={annex.html} />
          </div>
        </article>
      </div>
    </div>
  )
}
