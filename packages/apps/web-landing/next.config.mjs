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
        source: '/ingest/static/:path*',
        destination: 'https://eu-assets.i.posthog.com/static/:path*',
      },
      {
        source: '/ingest/:path*',
        destination: 'https://eu.i.posthog.com/:path*',
      },
    ];
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
