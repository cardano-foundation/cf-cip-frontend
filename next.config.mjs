import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
}

// const withMDX = createMDX({
//   options: {
//     remarkPlugins: [remarkGfm, remarkStringify, remarkFrontmatter, remarkToc],
//     rehypePlugins: [],
//   },
// })

export default nextConfig
