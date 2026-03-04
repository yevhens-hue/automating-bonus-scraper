import React from 'react';
import bonusesData from '@/data/bonuses.json';
import { Bonus } from '@/lib/bonuses';
import BonusCard from '@/components/BonusCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function AllBonusesPage() {
    const bonuses = (bonusesData.bonuses as unknown as Bonus[]).filter(
        b => (b as any).is_active !== 0
    );

    // Group by GEO
    const geoGroups: Record<string, Bonus[]> = bonuses.reduce((acc: Record<string, Bonus[]>, bonus) => {
        const geo = bonus.geo || 'Other';
        if (!acc[geo]) acc[geo] = [];
        acc[geo].push(bonus);
        return acc;
    }, {});

    const geos = Object.keys(geoGroups).sort();
    const geoNames: Record<string, string> = { IN: 'India', TR: 'Turkey', BR: 'Brazil' };
    const geoFlags: Record<string, string> = { IN: '🇮🇳', TR: '🇹🇷', BR: '🇧🇷' };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-4 uppercase tracking-tighter">
                        Live Bonus Database 2026
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                        Real-time tracking of 30+ brands across India, Turkey, and Brazil.
                        Updated every 6 hours with verified wagering requirements and bonus amounts.
                    </p>

                    <div className="flex justify-center gap-4">
                        <Link href="/all-bonuses/table" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-900/20 active:scale-95">
                            📊 Switch to Table View
                        </Link>
                    </div>
                </header>

                {geos.length === 0 && (
                    <div className="text-center py-20 border border-dashed border-gray-800 rounded-3xl">
                        <p className="text-gray-500 italic">No bonus data available yet. The scraper will populate this soon!</p>
                    </div>
                )}

                {geos.map((geo) => (
                    <section key={geo} className="mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-3xl">{geoFlags[geo] || '🌐'}</span>
                            <h2 className="text-2xl font-bold text-white border-l-4 border-blue-500 pl-4">
                                {geoNames[geo] || geo} Market
                            </h2>
                            <span className="text-xs text-gray-500 uppercase tracking-widest bg-gray-900 px-3 py-1 rounded-full">
                                {geoGroups[geo].length} Brands Tracked
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {geoGroups[geo].map((bonus) => (
                                <BonusCard key={`${bonus.brand_name}-${bonus.id}`} bonus={bonus} />
                            ))}
                        </div>
                    </section>
                ))}

                <footer className="mt-20 border-t border-gray-800 pt-12 flex flex-col items-center">
                    <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm font-bold uppercase tracking-widest">
                        <Link href="/bonuses-rating" className="text-gray-400 hover:text-white transition-colors">Top Rated</Link>
                        <Link href="/bonuses-by-country" className="text-gray-400 hover:text-white transition-colors">By Country</Link>
                        <Link href="/casino-bonuses" className="text-gray-400 hover:text-white transition-colors">Casino</Link>
                        <Link href="/betting-bonuses" className="text-gray-400 hover:text-white transition-colors">Betting</Link>
                    </div>
                    <div className="text-gray-500 text-sm mb-4">
                        © 2026 games-income.com — Data-Driven iGaming Insights
                    </div>
                    <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors font-bold">
                        ← Back to Home
                    </Link>
                </footer>
            </div>
        </div>
    );
}
