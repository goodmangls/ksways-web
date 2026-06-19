import type { MetadataRoute } from 'next';
import { servicePages } from '@/lib/service-pages';
import { siteUrl } from '@/lib/seo';

const staticRoutes = ['/', '/kr', '/quote'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const serviceRoutes = servicePages.map((page) => (page.slug === 'korea-agent-network' ? `/network/${page.slug}` : `/services/${page.slug}`));

  return [...staticRoutes, ...serviceRoutes].map((route) => ({
    url: `${siteUrl}${route === '/' ? '' : route}`,
    lastModified: now,
    changeFrequency: route === '/' || route === '/kr' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : route === '/kr' ? 0.9 : 0.8,
  }));
}
