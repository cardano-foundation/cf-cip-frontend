import { withContentlayer } from 'next-contentlayer'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  async rewrites() {
    return [
      {
        source: "/cips/cip:code([0-9]{1,4})",
        destination: "/cip/CIP-:code",
      },
    ];
  },
}

export default withContentlayer(nextConfig)
