import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://games-income.com';
  
  // Static routes
  const staticRoutes = [
    '',
    '/all-bonuses',
    '/all-bonuses/table',
    '/vip-bonuses',
    '/holiday-bonuses',
    '/bonuses-by-country',
    '/bonuses-rating',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' || route === '/all-bonuses' ? 1.0 : 0.9,
  }));

  // Blog posts
  const posts = await getAllPosts();
  const blogRoutes = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...blogRoutes];
}
