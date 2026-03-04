import React from 'react';
import bonusesData from '@/data/bonuses.json';
import { Bonus } from '@/lib/bonuses';
import { groupByGeo, GEO_NAMES } from '@/lib/geo';
import GeoBonusTable from '@/components/GeoBonusTable';
import Link from 'next/link';

export const metadata = {
    title: 'Casino & Betting Bonuses by Country 2026 — Games Income',
    description:
        'Explore the best casino and betting offers tailored for India, Turkey, and Brazil. Filter top-rated bonuses by your region and claim verified promotions.',
};

export default function BonusesByCountryPage() {
    const activeBonuses = (bonusesData.bonuses as unknown as Bonus[]).filter(
        (b) => (b as any).is_active !== 0
    );

    const { geos, geoGroups } = groupByGeo(activeBonuses);

    return (
        <div className="min-h-screen bg-[#050505] text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="mb-16 text-center relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30rem] h-32 bg-indigo-600/10 blur-[100px] rounded-full -z-10"></div>

                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                        Bonuses By <span className="text-indigo-400">Country</span>
                    </h1>

                    <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
                        Explore the best casino and betting offers tailored specifically for your region.
                        Select your market below to view all available promotions.
                    </p>
                </header>

                {geos.length === 0 && (
                    <div className="text-center py-20 border border-white/10 rounded-3xl bg-white/[0.02]">
                        <p className="text-gray-500 italic">No bonus data available yet. The scraper will populate this soon!</p>
                    </div>
                )}

                <div className="space-y-4">
                    {geos.map((geo) => (
                        <GeoBonusTable
                            key={geo}
                            geo={geo}
                            geoName={GEO_NAMES[geo] || geo}
                            bonuses={geoGroups[geo]}
                        />
                    ))}
                </div>

                <footer className="mt-20 border-t border-white/5 pt-12 flex flex-col items-center">
                    <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm font-bold uppercase tracking-widest">
                        <Link href="/all-bonuses" className="text-gray-400 hover:text-white transition-colors">Grid View</Link>
                        <Link href="/bonuses-rating" className="text-gray-400 hover:text-white transition-colors">Top Rated</Link>
                        <Link href="/all-bonuses?type=casino" className="text-gray-400 hover:text-white transition-colors">Casino</Link>
                        <Link href="/all-bonuses?type=betting" className="text-gray-400 hover:text-white transition-colors">Betting</Link>
                    </div>
                    <div className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        © 2026 games-income.com — All Rights Reserved
                    </div>
                    <Link href="/" className="text-indigo-500 hover:text-indigo-400 transition-colors font-bold flex items-center gap-2">
                        <span className="text-lg">←</span> Back to Home
                    </Link>
                </footer>
            </div>
        </div>
    );
}
