import { allCps } from 'content-collections'
import { notFound } from 'next/navigation'
import Markdown from '@/components/markdown'
import { JSDOM } from 'jsdom'
import { TableOfContents } from '@/components/table-of-contents'
import { OpenButton } from '@/components/open-button'
import { DocumentMetadata } from '@/components/document-metadata'

export async function generateStaticParams() {
  return allCps.map((cps) => ({ slug: cps.slug }))
}

// Removing repetitive $...$ katex spans
function removeAriaHiddenSpans(html: any) {
  const dom = new JSDOM(html)
  const document = dom.window.document

  const spans = document.querySelectorAll('span[aria-hidden="true"]')
  spans.forEach((span: any) => {
    span.classList.add('hidden')
  })

  return document.body.innerHTML
}

function getCpsFromParams(slug: any) {
  slug = `CPS-${slug.split('-')[1].padStart(4, '0')}`

  const cps = allCps.find((cps) => cps.slug === slug)

  if (!cps) {
    notFound()
  }

  return cps
}

export async function generateMetadata(props: any) {
  const params = await props.params
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
      card: 'summary_large_image',
      title: `${params.slug} | ${cps.Title}`,
      creator: '@Cardano_CF',
    },
  }
}

export default async function Cps(props: any) {
  const params = await props.params
  const cps = getCpsFromParams(params.slug)

  const cleanedHtml = cps.html ? removeAriaHiddenSpans(cps.html) : ''
  const githubUrl = `https://github.com/cardano-foundation/CIPs/blob/master/${cps.slug}`
  const siteUrl = `https://cips.cardano.org/cps/${params.slug}`

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
                          CPS-{String(cps.CPS).padStart(4, '0')}
                        </span>
                      </div>

                      <OpenButton
                        githubUrl={githubUrl}
                        siteUrl={siteUrl}
                        type="CPS"
                        className="flex"
                      />
                    </div>
                    <h1 className="text-3xl leading-tight font-bold tracking-tight break-words sm:text-4xl lg:text-5xl xl:text-6xl">
                      {cps.Title}
                    </h1>
                  </div>
                </div>

                <DocumentMetadata document={cps} type="CPS" />
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
