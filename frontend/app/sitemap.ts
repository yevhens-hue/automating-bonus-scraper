import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import fs from 'fs';
import path from 'path';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://games-income.com';
  
  // Static routes
  const staticRoutes = [
    '',
    '/all-bonuses',
    '/all-bonuses/table',
    '/vip-bonuses',
    '/holiday-bonuses',
    '/top-odds',
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

  // Dynamic Match Pages
  let matchRoutes: { url: string; lastModified: Date; changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" | undefined; priority: number; }[] = [];
  try {
    const filePath = path.join(process.cwd(), 'data', 'odds.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const oddsData = JSON.parse(fileContents);
    
    if (oddsData && oddsData.events) {
      matchRoutes = oddsData.events.map((event: any) => ({
        url: `${baseUrl}/match/${event.slug}`,
        lastModified: new Date(oddsData.updated_at || new Date()),
        changeFrequency: 'hourly' as const, // Matches change odds frequently
        priority: 0.9,
      }));
    }
  } catch (error) {
    console.error("Error generating match routes for sitemap:", error);
  }

  return [...staticRoutes, ...blogRoutes, ...matchRoutes];
}
