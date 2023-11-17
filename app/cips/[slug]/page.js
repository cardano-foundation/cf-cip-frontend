import { allCIPs } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { Metadata } from "next"
import { Mdx } from "@/components/mdx-components"

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
    return {}
  }

  return {
    number: cip.CIP,
    title: cip.Title,
  }
}


export default async function Cip({ params }) {
  const cip = await getCipFromParams(params.slug)

  return (
    <div className="pt-40 flex items-center justify-center overflow-hidden bg-transparent pb-12 pt-40">
      <div className="mx-auto flex flex-col w-full max-w-7xl items-center justify-center px-6 sm:px-8 lg:px-12">
        <article className="prose dark:prose-invert">
          <h1 className="mb-2">#{cip.CIP} {cip.Title}</h1>
          <hr className="my-4" />
          <Mdx code={cip.body.code} />
        </article>
      </div>
    </div>
  )
}
