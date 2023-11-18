import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

const computedFields = {
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.sourceFileDir,
  },
  slugAsParams: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.split('/').slice(0).join('/'),
  }
}

export const Cip = defineDocumentType(() => ({
  name: 'CIP',
  filePathPattern: '**/page.mdx',
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
  contentDirPath: 'CIPs',
  documentTypes: [Cip],
  mdx: {
    remarkPlugins: [remarkGfm],
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
