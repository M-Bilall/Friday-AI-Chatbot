import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['/', '/features', '/pricing', '/about', '/contact', '/login', '/signup', '/forgot-password', '/dashboard', '/chat', '/history', '/profile', '/settings'];

  return routes.map((route) => ({
    url: `https://friday.local${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.8
  }));
}