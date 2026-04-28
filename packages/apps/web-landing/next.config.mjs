/** @type {import('next').NextConfig} */
const nextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		unoptimized: true,
	},
	transpilePackages: [
		'@contractspec/bundle.library',
		'@contractspec/bundle.marketing',
		'@contractspec/module.examples',
		'@contractspec/lib.example-shared-ui',
		'@contractspec/example.agent-console',
		'@contractspec/example.ai-chat-assistant',
		'@contractspec/example.analytics-dashboard',
		'@contractspec/example.crm-pipeline',
		'@contractspec/example.data-grid-showcase',
		'@contractspec/example.finance-ops-ai-workflows',
		'@contractspec/example.in-app-docs',
		'@contractspec/example.integration-hub',
		'@contractspec/example.learning-journey-registry',
		'@contractspec/example.marketplace',
		'@contractspec/example.policy-safe-knowledge-assistant',
		'@contractspec/example.saas-boilerplate',
		'@contractspec/example.visualization-showcase',
		'@contractspec/example.workflow-system',
	],

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
			// LLM full guide (all packages aggregated)
			{
				source: '/llms-full',
				destination: '/llms-full.txt',
			},
			{
				source: '/llms/:slug',
				destination: '/llms-packages/:slug.txt',
			},
			// Docs subpath discovery (Agent-Friendly Documentation Spec)
			{
				source: '/docs/llms.txt',
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
		// const apiUrl = process.env.API_CONTRACTSPEC_URL || 'https://api.contractspec.io';
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
