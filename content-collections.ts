import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMarkdown } from '@content-collections/markdown'

import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkComment from 'remark-comment'
import remarkGithubAlerts from 'remark-github-alerts'
import rehypeKatex from 'rehype-katex'
// @ts-ignore
import remarkMermaid from 'remark-mermaid'
import remarkRemoveToc from './lib/remark-remove-toc'
import remarkRelativeLinks from './lib/remark-relative-links'
import rehypeRelativeImages from './lib/rehype-relative-images'
import rehypeUniqueIds from './lib/rehype-unique-ids'
import { normalizeLinkEntries } from './lib/link-entries'

const statusBadgeColor = (doc: { Status: string }) => {
  // Statuses may carry a parenthetical reason, e.g. 'Inactive (superseded by CIP-0121)'
  const status = doc.Status.replace(/\s*\(.*\)\s*$/, '').trim()
  switch (status) {
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
}

// Document numbers are usually plain integers but may be quoted strings
// (e.g. '0381') or '?' placeholders; fall back to the directory name
// (CIP-XXXX / CPS-XXXX), which always carries the assigned number.
const docNumber = (value: number | string, dirName: string) => {
  if (typeof value === 'number') return value
  const source = /^\d+$/.test(value.trim())
    ? value.trim()
    : dirName.split('-')[1]
  return parseInt(source, 10)
}

// Authors may be a 'Name <email>, Name <email>' string in older documents;
// non-string array entries are dropped rather than failing the document.
const normalizeAuthors = (authors: unknown) => {
  if (Array.isArray(authors)) {
    return authors.filter(
      (author): author is string => typeof author === 'string',
    )
  }
  return typeof authors === 'string' ? authors.split(', ') : []
}

// Define types for rehype plugin node parameters
type NodeType = {
  children: any[]
  properties: {
    className: string[]
  }
}

const cip = defineCollection({
  name: 'cip',
  directory: 'content/cip',
  include: '**/page.md',
  exclude: ['**/cip/CIPs/page.md'],
  schema: (z) => ({
    Title: z.string(),
    CIP: z.union([z.number(), z.string()]),
    Status: z.string(),
    Category: z.string().optional(),
    Authors: z.union([z.array(z.any()), z.string(), z.null()]).optional(),
    Implementors: z.union([z.array(z.any()), z.string(), z.null()]).optional(),
    Type: z.string().optional(),
    Requires: z.union([z.array(z.any()), z.string()]).optional(),
    'Comments-URI': z.union([z.array(z.string()), z.string()]).optional(),
    'Comments-Summary': z.string().optional(),
    'Post-History': z.string().optional(),
    'Discussions-To': z.string().optional(),
    Discussions: z.union([z.array(z.any()), z.string(), z.null()]).optional(),
    'Solution To': z.union([z.array(z.any()), z.string(), z.null()]).optional(),
    // Legacy spelling of 'Solution To', with bare CPS-NNNN references
    'Solution-To': z.union([z.array(z.any()), z.string(), z.null()]).optional(),
    Created: z.string(),
    Updated: z.string().optional(),
    License: z.string().optional(),
  }),
  transform: async (doc, context) => {
    // Extract CIP number from directory path
    const dirParts = doc._meta.directory.split('/')
    const dirName = dirParts[dirParts.length - 1]

    const authors = normalizeAuthors(doc.Authors)

    // Handle Implementors field transformation
    const implementors = Array.isArray(doc.Implementors)
      ? doc.Implementors
      : doc.Implementors
        ? [doc.Implementors]
        : null

    // Handle Comments-URI field transformation
    const commentsUri = doc['Comments-URI']

    const discussions = normalizeLinkEntries(doc.Discussions)
    const solutionTo = normalizeLinkEntries(
      doc['Solution To'] ?? doc['Solution-To'],
    )

    // Compile markdown to HTML
    const html = await compileMarkdown(context, doc, {
      remarkPlugins: [
        remarkMath,
        remarkGfm,
        remarkComment,
        remarkGithubAlerts,
        remarkRemoveToc,
        [
          remarkRelativeLinks,
          {
            basePath: `/cip/${dirName.toLowerCase()}`,
            docType: 'cip',
            docId: dirName.toLowerCase(),
          },
        ],
        [remarkMermaid, { simple: true }],
      ],
      rehypePlugins: [
        rehypeKatex,
        rehypeSlug,
        rehypeUniqueIds,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'append',
            properties: {
              className: ['subheading-anchor'],
              ariaLabel: 'Link to section',
              tabIndex: -1,
            },
          },
        ],
        [
          rehypeRelativeImages,
          {
            docType: 'cip',
            docId: dirName.toLowerCase(),
            isAnnexPage: false,
          },
        ],
        [
          rehypePrettyCode,
          {
            keepBackground: false,
            theme: {
              dark: 'github-dark',
              light: 'github-light',
            },
            defaultLang: {
              block: 'plaintext',
              inline: 'plaintext',
            },
            onVisitLine(node: NodeType) {
              if (node.children.length === 0) {
                node.children = [{ type: 'text', value: ' ' }]
              }
            },
            onVisitHighlightedLine(node: NodeType) {
              node.properties.className.push('line--highlighted')
            },
            onVisitHighlightedWord(node: NodeType) {
              node.properties.className = ['word--highlighted']
            },
          },
        ],
      ],
      allowDangerousHtml: true,
    })

    return {
      ...doc,
      CIP: docNumber(doc.CIP, dirName),
      Authors: authors,
      Implementors: implementors,
      'Comments-URI': commentsUri,
      Discussions: discussions,
      'Solution To': solutionTo,
      statusBadgeColor: statusBadgeColor(doc),
      slug: dirName,
      slugAsParams: doc._meta.path,
      html, // Add the compiled HTML
      content: doc.content, // Add raw markdown content for search

      // Add compatibility layer for _raw field
      _id: doc._meta.filePath,
      _raw: {
        sourceFilePath: doc._meta.filePath,
        sourceFileName: doc._meta.fileName,
        sourceFileDir: doc._meta.directory,
        flattenedPath: doc._meta.path,
        contentType: 'markdown',
      },
    }
  },
})

const cipAnnex = defineCollection({
  name: 'cipAnnex',
  directory: 'content/cip',
  include: '**/*.md',
  exclude: ['**/README.md', 'CIP-*/page.md'],
  schema: (z) => ({}),
  transform: async (doc, context) => {
    // Extract directory and file name
    const dirParts = doc._meta.directory.split('/')
    const cipDirName = dirParts.find((part) => part.startsWith('CIP-'))
    const fileName = doc._meta.fileName.replace('.md', '')

    // Handle subdirectory files (e.g., CPD/page.md)
    // Check if there are more than 2 parts (CIP-XXXX/subdirectory)
    const isSubdirectoryFile = dirParts.length > 1
    let slug = ''

    if (isSubdirectoryFile) {
      // For subdirectory files, create slug like: CIP-0021-CPD
      const subdirName = dirParts[dirParts.length - 1]
      slug = `${cipDirName}-${subdirName}`
    } else {
      // For regular annex files, keep existing behavior
      slug = `${cipDirName}-${fileName}`
    }

    // Compile markdown to HTML
    const html = await compileMarkdown(context, doc, {
      remarkPlugins: [
        remarkMath,
        remarkGfm,
        remarkComment,
        remarkRemoveToc,
        [
          remarkRelativeLinks,
          {
            basePath: `/cip/${cipDirName?.toLowerCase()}`,
            docType: 'cip',
            docId: cipDirName?.toLowerCase(),
          },
        ],
        [remarkMermaid, { simple: true }],
      ],
      rehypePlugins: [
        rehypeKatex,
        rehypeSlug,
        rehypeUniqueIds,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'append',
            properties: {
              className: ['subheading-anchor'],
              ariaLabel: 'Link to section',
              tabIndex: -1,
            },
          },
        ],
        [
          rehypeRelativeImages,
          {
            docType: 'cip',
            docId: cipDirName?.toLowerCase(),
            isAnnexPage: isSubdirectoryFile,
            annexName: isSubdirectoryFile
              ? dirParts[dirParts.length - 1]
              : undefined,
          },
        ],
        [
          rehypePrettyCode,
          {
            keepBackground: false,
            theme: {
              dark: 'github-dark',
              light: 'github-light',
            },
            defaultLang: {
              inline: 'plaintext',
            },
            onVisitLine(node: NodeType) {
              if (node.children.length === 0) {
                node.children = [{ type: 'text', value: ' ' }]
              }
            },
            onVisitHighlightedLine(node: NodeType) {
              node.properties.className.push('line--highlighted')
            },
            onVisitHighlightedWord(node: NodeType) {
              node.properties.className = ['word--highlighted']
            },
          },
        ],
      ],
      allowDangerousHtml: true,
    })

    return {
      ...doc,
      slug,
      slugAsParams: doc._meta.path,
      html, // Add the compiled HTML
      isSubdirectoryFile,
      cipDirName,
      subdirectoryName: isSubdirectoryFile
        ? dirParts[dirParts.length - 1]
        : null,

      // Add compatibility layer for _raw field
      _id: doc._meta.filePath,
      _raw: {
        sourceFilePath: doc._meta.filePath,
        sourceFileName: doc._meta.fileName,
        sourceFileDir: doc._meta.directory,
        flattenedPath: doc._meta.path,
        contentType: 'markdown',
      },
    }
  },
})

const cps = defineCollection({
  name: 'cps',
  directory: 'content/cps',
  include: '**/page.md',
  schema: (z) => ({
    Title: z.string(),
    CPS: z.union([z.number(), z.string()]),
    Status: z.string(),
    Category: z.string().optional(),
    Authors: z.union([z.array(z.any()), z.string(), z.null()]).optional(),
    'Proposed Solutions': z
      .union([z.array(z.any()), z.string(), z.null()])
      .optional(),
    Discussions: z.union([z.array(z.any()), z.string(), z.null()]).optional(),
    Created: z.string(),
    License: z.string().optional(),
  }),
  transform: async (doc, context) => {
    // Extract CPS number from directory path
    const dirParts = doc._meta.directory.split('/')
    const dirName = dirParts[dirParts.length - 1]

    const authors = normalizeAuthors(doc.Authors)
    const discussions = normalizeLinkEntries(doc.Discussions)
    const proposedSolutions = normalizeLinkEntries(doc['Proposed Solutions'])

    // Compile markdown to HTML
    const html = await compileMarkdown(context, doc, {
      remarkPlugins: [
        remarkMath,
        remarkGfm,
        remarkComment,
        remarkRemoveToc,
        [
          remarkRelativeLinks,
          {
            basePath: `/cps/${dirName.toLowerCase()}`,
            docType: 'cps',
            docId: dirName.toLowerCase(),
          },
        ],
        [remarkMermaid, { simple: true }],
      ],
      rehypePlugins: [
        rehypeKatex,
        rehypeSlug,
        rehypeUniqueIds,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'append',
            properties: {
              className: ['subheading-anchor'],
              ariaLabel: 'Link to section',
              tabIndex: -1,
            },
          },
        ],
        [
          rehypePrettyCode,
          {
            keepBackground: false,
            theme: {
              dark: 'github-dark',
              light: 'github-light',
            },
            defaultLang: {
              inline: 'plaintext',
            },
            onVisitLine(node: NodeType) {
              if (node.children.length === 0) {
                node.children = [{ type: 'text', value: ' ' }]
              }
            },
            onVisitHighlightedLine(node: NodeType) {
              node.properties.className.push('line--highlighted')
            },
            onVisitHighlightedWord(node: NodeType) {
              node.properties.className = ['word--highlighted']
            },
          },
        ],
        [
          rehypeRelativeImages,
          {
            docType: 'cps',
            docId: dirName.toLowerCase(),
            isAnnexPage: false,
          },
        ],
      ],
      allowDangerousHtml: true,
    })

    return {
      ...doc,
      CPS: docNumber(doc.CPS, dirName),
      Authors: authors,
      Discussions: discussions,
      'Proposed Solutions': proposedSolutions,
      statusBadgeColor: statusBadgeColor(doc),
      slug: dirName,
      slugAsParams: doc._meta.path,
      html, // Add the compiled HTML
      content: doc.content, // Add raw markdown content for search

      // Add compatibility layer for _raw field
      _id: doc._meta.filePath,
      _raw: {
        sourceFilePath: doc._meta.filePath,
        sourceFileName: doc._meta.fileName,
        sourceFileDir: doc._meta.directory,
        flattenedPath: doc._meta.path,
        contentType: 'markdown',
      },
    }
  },
})

const cpsAnnex = defineCollection({
  name: 'cpsAnnex',
  directory: 'content/cps',
  include: '**/*.md',
  exclude: ['**/README.md', 'CPS-*/page.md'],
  schema: (z) => ({}),
  transform: async (doc, context) => {
    // Extract directory and file name
    const dirParts = doc._meta.directory.split('/')
    const cpsDirName = dirParts.find((part) => part.startsWith('CPS-'))
    const fileName = doc._meta.fileName.replace('.md', '')

    // Handle subdirectory files (e.g., CPD/page.md)
    // Check if there are more than 2 parts (CPS-XXXX/subdirectory)
    const isSubdirectoryFile = dirParts.length > 1
    let slug = ''

    if (isSubdirectoryFile) {
      // For subdirectory files, create slug like: CPS-0021-CPD
      const subdirName = dirParts[dirParts.length - 1]
      slug = `${cpsDirName}-${subdirName}`
    } else {
      // For regular annex files, keep existing behavior
      slug = `${cpsDirName}-${fileName}`
    }

    // Compile markdown to HTML
    const html = await compileMarkdown(context, doc, {
      remarkPlugins: [
        remarkMath,
        remarkGfm,
        remarkComment,
        remarkRemoveToc,
        [
          remarkRelativeLinks,
          {
            basePath: `/cps/${cpsDirName?.toLowerCase()}`,
            docType: 'cps',
            docId: cpsDirName?.toLowerCase(),
          },
        ],
        [remarkMermaid, { simple: true }],
      ],
      rehypePlugins: [
        rehypeKatex,
        rehypeSlug,
        rehypeUniqueIds,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'append',
            properties: {
              className: ['subheading-anchor'],
              ariaLabel: 'Link to section',
              tabIndex: -1,
            },
          },
        ],
        [
          rehypeRelativeImages,
          {
            docType: 'cps',
            docId: cpsDirName?.toLowerCase(),
            isAnnexPage: isSubdirectoryFile,
            annexName: isSubdirectoryFile
              ? dirParts[dirParts.length - 1]
              : undefined,
          },
        ],
        [
          rehypePrettyCode,
          {
            keepBackground: false,
            theme: {
              dark: 'github-dark',
              light: 'github-light',
            },
            defaultLang: {
              inline: 'plaintext',
            },
            onVisitLine(node: NodeType) {
              if (node.children.length === 0) {
                node.children = [{ type: 'text', value: ' ' }]
              }
            },
            onVisitHighlightedLine(node: NodeType) {
              node.properties.className.push('line--highlighted')
            },
            onVisitHighlightedWord(node: NodeType) {
              node.properties.className = ['word--highlighted']
            },
          },
        ],
      ],
      allowDangerousHtml: true,
    })

    return {
      ...doc,
      slug,
      slugAsParams: doc._meta.path,
      html, // Add the compiled HTML
      isSubdirectoryFile,
      cpsDirName,
      subdirectoryName: isSubdirectoryFile
        ? dirParts[dirParts.length - 1]
        : null,

      // Add compatibility layer for _raw field
      _id: doc._meta.filePath,
      _raw: {
        sourceFilePath: doc._meta.filePath,
        sourceFileName: doc._meta.fileName,
        sourceFileDir: doc._meta.directory,
        flattenedPath: doc._meta.path,
        contentType: 'markdown',
      },
    }
  },
})

export default defineConfig({
  collections: [cip, cipAnnex, cps, cpsAnnex],
})
