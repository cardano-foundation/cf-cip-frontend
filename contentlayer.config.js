import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkComment from 'remark-comment'
import rehypeKatex from 'rehype-katex'

const statusBadgeColor = {
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

const cpsComputedFields = {
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.sourceFileDir.split('/')[1],
  },
  slugAsParams: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.split('/').slice(0).join('/'),
  },
  statusBadgeColor,
}

export const Cps = defineDocumentType(() => ({
  name: 'CPS',
  filePathPattern: 'cps/**/page.md',
  contentType: 'markdown',
  fields: {
    "Title": {
      type: 'string',
      required: true,
    },
    "CPS": {
      type: 'number',
      required: true,
    },
    "Status": {
      type: 'string',
      required: true,
    },
    "Category": {
      type: 'string',
      required: false,
    },
    "Authors": {
      type: 'list',
      of: { type: 'string' },
    },
    "Proposed Solutions": {
      type: 'list',
      of: { type: 'string' },
    },
    "Discussions": {
      type: 'list',
      of: { type: 'string' },
    },
    "Created": {
      type: 'date',
      required: true,
    },
  },
  computedFields: cpsComputedFields,
}))

const cipComputedFields = {
  "Authors": {
    type:'json',
    resolve: (doc) => {
      if (Array.isArray(doc.Authors)) {
        return doc.Authors
      } else {
        return doc.Authors.split(', ')
      }
    }
  },
  "Implementors": {
    type: 'json',
    required: false,
    resolve: (doc) => {
      if (Array.isArray(doc.Implementors)) {
        return doc.Implementors
      } else {
        return null
      }
    },
  },
  "Comments-URI": {
    type: 'json',
    required: false,
    resolve: (doc) => {
      if (Array.isArray(doc['Comments-URI'])) {
        return doc['Comments-URI']
      } else {
        return doc['Comments-URI']
      }
    },
  },
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.sourceFileDir.split('/')[1],
  },
  slugAsParams: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.split('/').slice(0).join('/'),
  },
  statusBadgeColor,
}

export const Cip = defineDocumentType(() => ({
  name: 'CIP',
  filePathPattern: 'cip/**/page.md',
  contentType: 'markdown',
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
      required: false,
    },
    "Authors": {
      type:'json',
      required: true,
    },
    "Implementors": {
      type: 'json',
      required: false,
    },
    "Type": {
      type: 'string',
      required: false,
    },
    "Requires": {
      type: 'string',
      required: false,
    },
    "Comments-URI": {
      type: 'json',
      required: false,
    },
    "Comments-Summary": {
      type: 'string',
      required: false,
    },
    "Post-History": {
      type: 'string',
      required: false,
    },
    "Discussions-To": {
      type: 'string',
      required: false,
    },
    "Discussions": {
      type: 'list',
      of: { type: 'string' },
    },
    "Created": {
      type: 'date',
      required: true,
    },
    "Updated": {
      type: 'string',
      required: false,
    },
    "License": {
      type: 'string',
    },
  },
  computedFields: cipComputedFields,
}))

const cipAnnexComputedFields = {
  slug: {
    type: 'string',
    resolve: (doc) => `${doc._raw.sourceFileDir.split('/')[1]}-${doc._raw.sourceFileName}`,
  },
  slugAsParams: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.split('/').slice(0).join('/'),
  },
}

export const CipAnnex = defineDocumentType(() => ({
  name: 'CIPAnnex',
  filePathPattern: 'cip/**/!(*README*|page).md',
  contentType: 'markdown',
  computedFields: cipAnnexComputedFields,
}))

const cpsAnnexComputedFields = {
  slug: {
    type: 'string',
    resolve: (doc) => `${doc._raw.sourceFileDir.split('/')[1]}-${doc._raw.sourceFileName}`,
  },
  slugAsParams: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath.split('/').slice(0).join('/'),
  },
}

export const CpsAnnex = defineDocumentType(() => ({
  name: 'CPSAnnex',
  filePathPattern: 'cps/**/!(*README*|page).md',
  contentType: 'markdown',
  computedFields: cpsAnnexComputedFields,
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Cip, Cps, CipAnnex, CpsAnnex],
  markdown: {
    remarkPlugins: [remarkGfm, remarkComment, remarkMath],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: 'github-dark',
          defaultLang: {
            inline: 'plaintext',
          },
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
          },
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
      ],
      rehypeKatex
    ],
  },
})
