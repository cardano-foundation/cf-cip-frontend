import { allCps } from 'content-collections'
import { notFound } from 'next/navigation'
import Link from "next/link"
import Badge from "@/components/Badge"
import Markdown from '@/components/Markdown'
import { JSDOM } from 'jsdom';
import { Fragment } from 'react'
import DocumentSidebar from '@/components/DocumentSidebar'

// Removing repetitive $...$ katex spans
function removeAriaHiddenSpans(html) {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const spans = document.querySelectorAll('span[aria-hidden="true"]');
  spans.forEach(span => {
    span.classList.add('hidden');
  });

  return document.body.innerHTML;
}

async function getCpsFromParams(slug) {
  slug = `CPS-${slug.split('-')[1].padStart(4, '0')}`

  const cps = allCps.find((cps) => cps.slug === slug)

  if (!cps) {
    notFound()
  }

  return cps
}

export async function generateMetadata(props) {
  const params = await props.params;
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

export default async function Cps(props) {
  const params = await props.params;
  const cps = await getCpsFromParams(params.slug)
  const cleanedHtml = cps.html ? removeAriaHiddenSpans(cps.html) : '';

  return (
    <div className="pt-24 md:pt-40 flex justify-center pb-12">
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          <DocumentSidebar />
          <div className="flex-1">
            <article>
              <div className="mb-8 lg:mb-16 flex flex-col">
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-2">
                    <span className="text-cf-blue-50 text-2xl sm:text-3xl">#{cps.CPS}</span>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={`text-sm ${cps.statusBadgeColor}`} title={cps.Status} />
                      {cps.Category && <Badge className="text-sm bg-white/10 ring-slate-400 text-slate-200" title={cps.Category} />}
                    </div>
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-cf-slate-50 to-cf-blue-50/90">
                    {cps.Title}
                  </h1>
                </div>
                <div className="mt-4 text-slate-400 flex flex-wrap text-sm sm:text-base">
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
                    <Fragment key={index}>
                      {cps.Authors.length !== 1 && index + 1 === cps.Authors.length && <>&nbsp;and&nbsp;</>}
                      <Link href={`mailto:${author.email}`} key={index} className="relative truncate hover:underline">
                        {author.name}{index + 1 < cps.Authors.length && ",\u00A0"}
                      </Link>
                    </Fragment>
                  ))}
                </div>
              </div>

              <div className="prose prose-invert lg:prose-xl mx-auto prose-code:px-2 prose-code:py-1 prose-code:rounded-md">
                <Markdown content={cleanedHtml} />
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}
