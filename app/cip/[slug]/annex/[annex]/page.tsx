import { allCipAnnexes } from 'content-collections'
import { notFound } from 'next/navigation'
import Markdown from '@/components/markdown'
import { TableOfContents } from '@/components/table-of-contents'

export async function generateStaticParams() {
  return allCipAnnexes.map((annex) => {
    const parts = annex.slug.split('-')
    const slugParam = parts.slice(0, 2).join('-')
    const annexParam = parts.slice(2).join('-')
    return { slug: slugParam, annex: annexParam }
  })
}

function getAnnexFromParams(slug: any, annexSlug: any) {
  slug = `CIP-${slug.split('-')[1].padStart(4, '0')}`

  const annex = allCipAnnexes.find(
    (annex) => annex.slug === `${slug}-${annexSlug}`,
  )

  if (!annex) {
    notFound()
  }

  return annex
}

export async function generateMetadata(props: any) {
  const params = await props.params
  const annex = await getAnnexFromParams(params.slug, params.annex)

  if (!annex) {
    return notFound()
  }

  return {
    title: `${params.slug.toUpperCase()} | ${params.annex.split('.')[0]}`,
    openGraph: {
      title: `${params.slug.toUpperCase()} | ${params.annex.split('.')[0]}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${params.slug.toUpperCase()} | ${params.annex.split('.')[0]}`,
      creator: '@Cardano_CF',
    },
  }
}

export default async function CipAnnex(props: any) {
  const params = await props.params
  const annex = getAnnexFromParams(params.slug, params.annex)

  return (
    <div className="flex w-full max-w-7xl min-w-0 justify-center pt-16 pb-8">
      <div className="w-full max-w-7xl min-w-full px-4 sm:px-6 lg:px-12">
        <div className="relative flex flex-col xl:flex-row xl:gap-12">
          <div className="w-full min-w-0 overflow-hidden xl:max-w-4xl xl:flex-1">
            <article className="min-w-0 space-y-8">
              <header className="space-y-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-muted-foreground font-mono text-2xl font-semibold sm:text-3xl">
                          <span className="uppercase">{params.slug}</span> -
                          Annex
                        </span>
                      </div>
                    </div>
                    <h1 className="text-3xl leading-tight font-bold tracking-tight break-words sm:text-4xl lg:text-5xl xl:text-6xl">
                      {params.annex.split('.')[0]}
                    </h1>
                  </div>
                </div>
              </header>

              <div className="typography min-w-full overflow-x-auto break-words">
                <Markdown content={annex.html} />
              </div>
            </article>
          </div>

          <aside className="relative mt-8 space-y-6 xl:mt-0 xl:w-80 xl:shrink-0">
            <div className="sticky top-4 hidden xl:block">
              <TableOfContents />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
