import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkComment from 'remark-comment'

const computedFields = {
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.sourceFileDir,
  },
  slugAsParams: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.split('/').slice(0).join('/'),
  },
  statusBadgeColor: {
    type: 'string',
    resolve: (doc) => {
      switch (doc.Status) {
        case 'Proposed':
        case 'Draft':
          return 'bg-cf-blue-600/30 ring-cf-blue-600/30 text-blue-600'
        case 'Solved':
        case 'Active':
          return 'bg-cf-green-600/30 ring-cf-green-600/30 text-green-600'
        case 'Inactive':
          return 'bg-cf-red-600/20 ring-cf-red-600/20 text-red-600'
        case 'Open':
          return 'bg-cf-yellow-600/20 ring-cf-yellow-600/20 text-yellow-600'
        default:
          return 'bg-white/10 ring-gray-100/10 text-slate-300'
      }
    },
  }
}

export const Cip = defineDocumentType(() => ({
  name: 'CIP',
  filePathPattern: 'cip/**/page.mdx',
  contentType: 'mdx',
  fields: {
    "Title": {
      type: 'string',
      required: true,
    },
    "CIP": {
      type: 'number',
      required: true,
    },
    "Status": {
      type: 'string',
      required: true,
    },
    "Category": {
      type: 'string',
      required: true,
    },
    "Authors": {
      type: 'list',
      of: { type: 'string' },
    },
    "Implementors": {
      type: 'string',
    },
    "Discussions": {
      type: 'list',
      of: { type: 'string' },
    },
    "Created": {
      type: 'date',
      required: true,
    },
    "License": {
      type: 'string',
    }
  },
  computedFields,
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Cip],
  mdx: {
    remarkPlugins: [remarkGfm, remarkMath, remarkComment],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: 'nord',
          onVisitLine(node) {
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }]
            }
          },
          onVisitHighlightedLine(node) {
            node.properties.className.push('line--highlighted')
          },
          onVisitHighlightedWord(node) {
            node.properties.className = ('word--highlighted')
          }
        }
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['subheading-anchor'],
            ariaLabel: 'Link to section',
          }
        }
      ]
    ],
  },
})
