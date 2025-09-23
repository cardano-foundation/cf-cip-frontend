import { allCips } from 'content-collections'
import { notFound } from 'next/navigation'
import Markdown from '@/components/markdown'
import { JSDOM } from 'jsdom'
import { TableOfContents } from '@/components/table-of-contents'
import { OpenButton } from '@/components/open-button'
import { DocumentMetadata } from '@/components/document-metadata'

export async function generateStaticParams() {
  return allCips.map((cip) => ({ slug: cip.slug }))
}

// Removing repetitive $...$ katex spans
function removeAriaHiddenSpans(html: string) {
  const dom = new JSDOM(html)
  const document = dom.window.document

  const spans = document.querySelectorAll('span[aria-hidden="true"]')
  spans.forEach((span) => {
    span.classList.add('hidden')
  })

  return document.body.innerHTML
}

function getCipFromParams(slug: string) {
  slug = `CIP-${slug.split('-')[1].padStart(4, '0')}`

  const cip = allCips.find((cip) => cip.slug === slug)

  if (!cip) {
    notFound()
  }

  return cip
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
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
      card: 'summary_large_image',
      title: `${params.slug} | ${cip.Title}`,
      creator: '@Cardano_CF',
    },
  }
}

export default async function Cip(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const cip = getCipFromParams(params.slug)

  const cleanedHtml = cip.html ? removeAriaHiddenSpans(cip.html) : ''
  const githubUrl = `https://github.com/cardano-foundation/CIPs/blob/master/${cip.slug}`
  const siteUrl = `https://cips.cardano.org/cip/${params.slug}`

  return (
    <div className="flex w-full max-w-7xl min-w-0 justify-center pt-16 pb-8">
      <div className="w-full max-w-7xl min-w-0 px-4 sm:px-6 lg:px-12">
        <div className="relative flex flex-col xl:flex-row xl:gap-12">
          <div className="w-full min-w-0 overflow-hidden xl:max-w-4xl xl:flex-1">
            <article className="min-w-0 space-y-8">
              <header className="space-y-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-muted-foreground font-mono text-2xl font-semibold sm:text-3xl">
                          CIP-{String(cip.CIP).padStart(4, '0')}
                        </span>
                      </div>

                      <OpenButton
                        githubUrl={githubUrl}
                        siteUrl={siteUrl}
                        type="CIP"
                        className="flex"
                      />
                    </div>
                    <h1 className="text-3xl leading-tight font-bold tracking-tight break-words sm:text-4xl lg:text-5xl xl:text-6xl">
                      {cip.Title}
                    </h1>
                  </div>
                </div>

                <DocumentMetadata document={cip} type="CIP" />
              </header>

              <div className="typography min-w-0 overflow-x-auto break-words">
                <Markdown content={cleanedHtml} />
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
