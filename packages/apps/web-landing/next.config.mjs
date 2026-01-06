/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configure Turbopack to handle sql.js properly
  turbopack: {
    resolveAlias: {
      fs: { browser: 'browserify-fs' },
      '@contractspec/lib.ui-link': 'next/link',
    },
  },
  // Configure webpack as fallback
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // On client, provide empty polyfills for Node.js modules
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };

      // Ignore node built-ins in sql.js for browser builds
      config.plugins = config.plugins || [];
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^fs$/,
          contextRegExp: /sql\.js/,
        }),
        new webpack.IgnorePlugin({
          resourceRegExp: /^path$/,
          contextRegExp: /sql\.js/,
        })
      );
    }
    return config;
  },
  // Mark sql.js as external to prevent server bundling
  outputFileTracingExcludes: {
    '/templates': ['**/*'],
    '/sandbox': ['**/*'],
  },
  async rewrites() {
    return [
      {
        source: '/docs/studio',
        destination: 'https://www.contractspec.studio/docs',
      },
      {
        source: '/docs/studio/:path*',
        destination: 'https://www.contractspec.studio/docs/:path*',
      },
      {
        source: '/studio',
        destination: 'https://www.contractspec.studio',
      },
      {
        source: '/studio/:path*',
        destination: 'https://www.contractspec.studio/:path*',
      },
      // LLM guide file (static, no auth)
      {
        source: '/llms',
        destination: '/llms.txt',
      },
      {
        source: '/llms.md',
        destination: '/llms.txt',
      },
      {
        source: '/llms.mdx',
        destination: '/llms.txt',
      },
      // Subdomain form: llms.<app-domain> → /llms.txt
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'llms.contractspec.io' }],
        destination: '/llms.txt',
      },
      {
        source: '/ingest/static/:path*',
        destination: 'https://eu-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://eu.i.posthog.com/:path*',
      },
    ];
  },
  async redirects() {
    // const apiUrl = process.env.API_CONTRACTSPEC_URL || 'https://api.contractspec.tech';
    const apiLlmsUrl =
      process.env.API_CONTRACTSPEC_URL || `https://llms.contractspec.io`;
    return [
      // Redirect studio pages to dedicated app
      {
        source: '/studio',
        destination: 'https://www.contractspec.studio',
        permanent: true,
      },
      {
        source: '/studio/:path*',
        destination: 'https://www.contractspec.studio/:path*',
        permanent: true,
      },
      // Ensure local llms guide is served from /public even when generic .md redirects exist.
      {
        source: '/llms.md',
        destination: '/llms.txt',
        permanent: false,
      },
      {
        source: '/llms.mdx',
        destination: '/llms.txt',
        permanent: false,
      },
      {
        source: '/:path*.md',
        destination: `${apiLlmsUrl}/mdx/:path*`,
        permanent: false,
      },
      {
        source: '/:path*.mdx',
        destination: `${apiLlmsUrl}/mdx/:path*`,
        permanent: false,
      },
    ];
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
