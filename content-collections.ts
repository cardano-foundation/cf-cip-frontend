import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMarkdown } from "@content-collections/markdown";

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

const statusBadgeColor = (doc: { Status: string }) => {
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
};

// Define types for rehype plugin node parameters
type NodeType = {
  children: any[];
  properties: {
    className: string[];
  };
};

const cip = defineCollection({
  name: "cip",
  directory: "content/cip",
  include: "**/page.md",
  exclude: ["**/cip/CIPs/page.md"],
  schema: (z) => ({
    Title: z.string(),
    CIP: z.number(),
    Status: z.string(),
    Category: z.string().optional(),
    Authors: z.union([z.array(z.string()), z.string()]),
    Implementors: z.union([z.array(z.string()), z.string()]).optional(),
    Type: z.string().optional(),
    Requires: z.string().optional(),
    "Comments-URI": z.union([z.array(z.string()), z.string()]).optional(),
    "Comments-Summary": z.string().optional(),
    "Post-History": z.string().optional(),
    "Discussions-To": z.string().optional(),
    Discussions: z.array(z.string()).optional(),
    Created: z.string(),
    Updated: z.string().optional(),
    License: z.string().optional(),
  }),
  transform: async (doc, context) => {
    // Extract CIP number from directory path
    const dirParts = doc._meta.directory.split('/');
    const dirName = dirParts[dirParts.length - 1];
    
    // Handle Authors field transformation similar to the original computedFields
    const authors = Array.isArray(doc.Authors) 
      ? doc.Authors 
      : doc.Authors.split(', ');
    
    // Handle Implementors field transformation
    const implementors = Array.isArray(doc.Implementors) 
      ? doc.Implementors 
      : doc.Implementors ? [doc.Implementors] : null;
    
    // Handle Comments-URI field transformation
    const commentsUri = doc["Comments-URI"];
    
    // Compile markdown to HTML
    const html = await compileMarkdown(context, doc, {
        remarkPlugins: [
          remarkMath,
          remarkGfm,
          remarkComment,
          remarkGithubAlerts,
          [remarkMermaid, { simple: true }],
        ],
        rehypePlugins: [
          rehypeKatex,
          rehypeSlug,
          [rehypeAutolinkHeadings, {
            properties: {
              className: ['subheading-anchor'],
              ariaLabel: 'Link to section',
            }
          }],
          [rehypePrettyCode, {
            theme: 'catppuccin-mocha',
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
          }],
        ],
        allowDangerousHtml: true,
      });
    
    return {
      ...doc,
      Authors: authors,
      Implementors: implementors,
      "Comments-URI": commentsUri,
      statusBadgeColor: statusBadgeColor(doc),
      slug: dirName,
      slugAsParams: doc._meta.path,
      html, // Add the compiled HTML
      
      // Add compatibility layer for _raw field
      _id: doc._meta.filePath,
      _raw: {
        sourceFilePath: doc._meta.filePath,
        sourceFileName: doc._meta.fileName,
        sourceFileDir: doc._meta.directory,
        flattenedPath: doc._meta.path,
        contentType: "markdown",
      }
    };
  }
});

const cipAnnex = defineCollection({
  name: "cipAnnex",
  directory: "content/cip",
  include: "**/*.md",
  exclude: ["**/README.md", "**/page.md"],
  schema: (z) => ({}),
  transform: async (doc, context) => {
    // Extract directory and file name
    const dirParts = doc._meta.directory.split('/');
    const dirName = dirParts[dirParts.length - 1];
    const fileName = doc._meta.fileName.replace('.md', '');
    
    // Compile markdown to HTML
    const html = await compileMarkdown(context, doc, {
        remarkPlugins: [
          remarkMath,
          remarkGfm,
          remarkComment,
          [remarkMermaid, { simple: true }],
        ],
        rehypePlugins: [
          rehypeKatex,
          rehypeSlug,
          [rehypeAutolinkHeadings, {
            properties: {
              className: ['subheading-anchor'],
              ariaLabel: 'Link to section',
            }
          }],
          [rehypePrettyCode, {
            theme: 'catppuccin-mocha',
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
          }],
        ],
        allowDangerousHtml: true,
      });
    
    return {
      ...doc,
      slug: `${dirName}-${fileName}`,
      slugAsParams: doc._meta.path,
      html, // Add the compiled HTML
      
      // Add compatibility layer for _raw field
      _id: doc._meta.filePath,
      _raw: {
        sourceFilePath: doc._meta.filePath,
        sourceFileName: doc._meta.fileName,
        sourceFileDir: doc._meta.directory,
        flattenedPath: doc._meta.path,
        contentType: "markdown",
      }
    };
  }
});

const cps = defineCollection({
  name: "cps",
  directory: "content/cps",
  include: "**/page.md",
  schema: (z) => ({
    Title: z.string(),
    CPS: z.number(),
    Status: z.string(),
    Category: z.string().optional(),
    Authors: z.array(z.string()).optional(),
    "Proposed Solutions": z.array(z.any()).optional(),
    Discussions: z.union([z.array(z.string()), z.null()]).optional(),
    Created: z.string(),
  }),
  transform: async (doc, context) => {
    // Extract CPS number from directory path
    const dirParts = doc._meta.directory.split('/');
    const dirName = dirParts[dirParts.length - 1];
    
    // Compile markdown to HTML
    const html = await compileMarkdown(context, doc, {
        remarkPlugins: [
          remarkMath,
          remarkGfm,
          remarkComment,
          [remarkMermaid, { simple: true }],
        ],
        rehypePlugins: [
          rehypeKatex,
          rehypeSlug,
          [rehypeAutolinkHeadings, {
            properties: {
              className: ['subheading-anchor'],
              ariaLabel: 'Link to section',
            }
          }],
          [rehypePrettyCode, {
            theme: 'catppuccin-mocha',
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
          }],
        ],
        allowDangerousHtml: true,
      });
    
    return {
      ...doc,
      statusBadgeColor: statusBadgeColor(doc),
      slug: dirName,
      slugAsParams: doc._meta.path,
      html, // Add the compiled HTML
      
      // Add compatibility layer for _raw field
      _id: doc._meta.filePath,
      _raw: {
        sourceFilePath: doc._meta.filePath,
        sourceFileName: doc._meta.fileName,
        sourceFileDir: doc._meta.directory,
        flattenedPath: doc._meta.path,
        contentType: "markdown",
      }
    };
  }
});

const cpsAnnex = defineCollection({
  name: "cpsAnnex",
  directory: "content/cps",
  include: "**/*.md",
  exclude: ["**/README.md", "**/page.md"],
  schema: (z) => ({}),
  transform: async (doc, context) => {
    // Extract directory and file name
    const dirParts = doc._meta.directory.split('/');
    const dirName = dirParts[dirParts.length - 1];
    const fileName = doc._meta.fileName.replace('.md', '');
    
    // Compile markdown to HTML
    const html = await compileMarkdown(context, doc, {
      remarkPlugins: [
        remarkMath,
        remarkGfm,
        remarkComment,
        [remarkMermaid, { simple: true }],
      ],
      rehypePlugins: [
        rehypeKatex,
        rehypeSlug,
        [rehypeAutolinkHeadings, {
          properties: {
            className: ['subheading-anchor'],
            ariaLabel: 'Link to section',
          }
        }],
        [rehypePrettyCode, {
          theme: 'catppuccin-mocha',
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
        }],
      ],
      allowDangerousHtml: true,
    });
    
    return {
      ...doc,
      slug: `${dirName}-${fileName}`,
      slugAsParams: doc._meta.path,
      html, // Add the compiled HTML
      
      // Add compatibility layer for _raw field
      _id: doc._meta.filePath,
      _raw: {
        sourceFilePath: doc._meta.filePath,
        sourceFileName: doc._meta.fileName,
        sourceFileDir: doc._meta.directory,
        flattenedPath: doc._meta.path,
        contentType: "markdown",
      }
    };
  }
});

export default defineConfig({
  collections: [cip, cipAnnex, cps, cpsAnnex],
}); 