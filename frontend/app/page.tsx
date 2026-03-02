import Link from 'next/link';
import { STATIC_BONUSES } from '@/lib/bonuses';
import { getAllPosts } from '@/lib/posts';
import BonusCard from '@/components/BonusCard';

export const metadata = {
    title: 'Games Income — Best Casino & Betting Bonuses in India 2026',
    description: 'Compare the latest casino bonuses and sports betting offers for Indian players. Verified, up-to-date deals from top platforms.',
};

export default async function HomePage() {
    const posts = await getAllPosts();
    const topCasino = STATIC_BONUSES.filter(b => b.type === 'casino').slice(0, 3);
    const topBetting = STATIC_BONUSES.filter(b => b.type === 'betting').slice(0, 3);

    return (
        <main className="min-h-screen bg-[#0a0d1a]">
            {/* Hero */}
            <section className="relative overflow-hidden py-24 px-4 text-center border-b border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-[#0a0d1a] to-blue-900/20 pointer-events-none" />
                <div className="absolute top-10 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl opacity-50" />

                <div className="relative max-w-5xl mx-auto">
                    <div className="flex justify-center gap-3 mb-8">
                        <span className="bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full flex items-center gap-2">
                            Global Edition 2026
                        </span>
                        <div className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full hover:bg-blue-500/20 transition-all">
                            Latest Insights Below ↓
                        </div>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
                        SMART<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400">
                            iGAMING
                        </span>
                    </h1>

                    <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                        Data-driven tracking of 30+ top-tier brands across
                        <span className="text-white px-2">India</span>,
                        <span className="text-white px-2">Turkey</span>,
                        and <span className="text-white px-2">Brazil</span>.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                        <Link href="/all-bonuses"
                            className="bg-white text-black font-black px-10 py-5 rounded-2xl transition-all transform hover:scale-105 shadow-xl shadow-white/5 uppercase tracking-widest text-sm">
                            View All 30+ Bonuses
                        </Link>
                        <a href="#blog"
                            className="bg-white/5 hover:bg-white/10 border border-white/20 text-white font-black px-10 py-5 rounded-2xl transition-all transform hover:scale-105 uppercase tracking-widest text-sm backdrop-blur-md">
                            Read iGaming Blog
                        </a>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="bg-white/2 backdrop-blur-sm py-8 px-4 border-b border-white/5">
                <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { value: '30+', label: 'Tracked Brands' },
                        { value: '3 Markets', label: 'IN, TR, BR' },
                        { value: '6h', label: 'Refresh Rate' },
                        { value: 'AI', label: 'Insight Engine' },
                    ].map((stat) => (
                        <div key={stat.label}>
                            <div className="text-3xl font-black text-white tracking-tighter uppercase">{stat.value}</div>
                            <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Main Blog Section */}
            <section id="blog" className="py-24 px-4 bg-white/[0.02] border-b border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                        <div className="max-w-xl">
                            <h2 className="text-5xl font-black text-white mb-6 tracking-tighter uppercase">Latest iGaming<br />Inspiration</h2>
                            <p className="text-gray-400 text-lg">Daily market analysis and bonus strategy guides powered by AI.</p>
                        </div>
                    </div>

                    {posts.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-gray-800 rounded-3xl">
                            <p className="text-gray-500 italic">Our AI analysts are currently writing new insights. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
                                    className="block group h-full"
                                >
                                    <article className="bg-[#111] border border-gray-800 p-8 rounded-3xl hover:border-blue-500/50 transition-all duration-300 group-hover:bg-[#151515] h-full flex flex-col">
                                        <div className="flex justify-between items-start mb-6">
                                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                                                {post.date}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-black mb-4 group-hover:text-blue-400 transition-colors tracking-tight uppercase leading-tight">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-8 flex-grow">
                                            {post.excerpt || "Expert analysis of the latest iGaming trends and bonus opportunities in the global market..."}
                                        </p>
                                        <div className="flex items-center text-blue-400 font-bold uppercase tracking-widest text-[10px]">
                                            Read Article <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Market Sections Link Cards */}
            <section className="py-24 px-4 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <Link href="/casino-bonuses" className="group relative overflow-hidden bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 p-12 rounded-[2rem] hover:border-purple-500/50 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-8 text-6xl opacity-20 group-hover:scale-110 transition-transform duration-500">🎰</div>
                    <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">Casino<br />Bonuses</h2>
                    <p className="text-gray-500 max-w-xs mb-8">Direct access to welcome packages, free spins, and crypto deals.</p>
                    <span className="text-purple-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                        Explore Database <span className="group-hover:translate-x-2 transition-transform">→</span>
                    </span>
                </Link>

                <Link href="/betting-bonuses" className="group relative overflow-hidden bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/5 p-12 rounded-[2rem] hover:border-blue-500/50 transition-all duration-500">
                    <div className="absolute top-0 right-0 p-8 text-6xl opacity-20 group-hover:scale-110 transition-transform duration-500">🏏</div>
                    <h2 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">Sports<br />Betting</h2>
                    <p className="text-gray-500 max-w-xs mb-8">IPL, Cricket, and Football offers verified for Indian and global players.</p>
                    <span className="text-blue-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                        Explore Database <span className="group-hover:translate-x-2 transition-transform">→</span>
                    </span>
                </Link>
            </section>

            {/* Footer */}
            <footer className="py-16 px-4 border-t border-white/5 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="text-white font-black text-2xl mb-8 tracking-widest">GAMES INCOME</div>
                    <div className="flex justify-center gap-8 mb-12 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                        <Link href="/all-bonuses" className="hover:text-white transition-colors">Database</Link>
                        <a href="#blog" className="hover:text-white transition-colors">Blog</a>
                        <Link href="/casino-bonuses" className="hover:text-white transition-colors">Casino</Link>
                        <Link href="/betting-bonuses" className="hover:text-white transition-colors">Betting</Link>
                    </div>
                    <p className="text-gray-600 text-[10px] leading-loose max-w-2xl mx-auto">
                        © 2026 Games Income. For adults 18+ only. Gambling can be addictive — please play responsibly.
                        This site contains affiliate links. We may earn commission when you sign up via our links.
                    </p>
                </div>
            </footer>
        </main>
    );
}
