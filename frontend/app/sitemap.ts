import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import bonusesData from '@/data/bonuses.json';
import oddsData from '@/data/odds.json';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://games-income.com';

    // 1. Static Routes
    const staticRoutes: MetadataRoute.Sitemap = [
        '',
        '/all-bonuses',
        '/all-bonuses/table',
        '/vip-bonuses',
        '/holiday-bonuses',
        '/bonuses-by-country',
        '/bonuses-rating',
        '/blog',
        '/top-odds'
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(bonusesData.updated_at || new Date()),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    // 2. Blog Posts
    const posts = await getAllPosts();
    const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // 3. Match Pages
    const matchRoutes: MetadataRoute.Sitemap = (oddsData.events || []).map((match: { slug: string }) => ({
        url: `${baseUrl}/match/${match.slug}`,
        lastModified: new Date(oddsData.updated_at || new Date()),
        changeFrequency: 'hourly' as const,
        priority: 0.9,
    }));

    return [...staticRoutes, ...blogRoutes, ...matchRoutes];
}
