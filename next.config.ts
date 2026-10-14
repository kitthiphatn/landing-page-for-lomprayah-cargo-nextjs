import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// Where /tracking-api/* is forwarded (used in dev and previews, where the API's CORS blocks the browser)
const trackingUpstream = (
  process.env.TRACKING_API_UPSTREAM || 'https://api.lomprayahcargo.com/api'
).replace(/\/$/, '')

const nextConfig: NextConfig = {
  // Self-contained server (`.next/standalone/server.js`) that Plesk runs without `npm install`
  output: 'standalone',
  async rewrites() {
    return [{ source: '/tracking-api/:path*', destination: `${trackingUpstream}/:path*` }]
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
