import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/sandbox/'],
      },
    ],
    sitemap: 'https://contractspec.io/sitemap.xml',
  };
}
