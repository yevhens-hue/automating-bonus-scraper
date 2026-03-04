import React from 'react';
import bonusesData from '@/data/bonuses.json';
import { Bonus } from '@/lib/bonuses';
import { groupByGeo, GEO_NAMES, GEO_FLAGS } from '@/lib/geo';
import VipBonusCard from '@/components/VipBonusCard';
import Link from 'next/link';

export const metadata = {
    title: 'VIP Bonuses & Elite Rewards 2026 — Games Income',
    description: 'Exclusive VIP programs, loyalty rewards, and high-roller bonuses from top iGaming brands. Verified elite offers updated every 6 hours.',
};

export default function VipBonusesPage() {
    const bonuses = (bonusesData.bonuses as unknown as Bonus[]).filter(
        (b) => {
            const isActive = (b as any).is_active !== 0;
            if (!isActive) return false;
            return b.bonus_type === 'vip' || (b.extra_data && b.extra_data.toLowerCase().includes('vip'));
        }
    );

    const { geos, geoGroups } = groupByGeo(bonuses);

    return (
        <div className="min-h-screen bg-[#0a0d1a] text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 text-center">
                    <div className="inline-block bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6">
                        👑 Elite Rewards
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 mb-6 uppercase tracking-tighter italic">
                        VIP Database
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8 font-medium">
                        Exclusive loyalty programs and high-roller rewards for our most dedicated players.
                        Updated in real-time with verified verification steps.
                    </p>

                    <div className="flex justify-center gap-4">
                        <Link href="/all-bonuses" className="text-gray-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            ← All Bonuses
                        </Link>
                    </div>
                </header>

                {geos.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-gray-800 rounded-3xl bg-white/5">
                        <p className="text-gray-500 italic">No VIP offers tracked at the moment. Check back soon!</p>
                    </div>
                ) : (
                    geos.map((geo) => (
                        <section key={geo} className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-3xl">{GEO_FLAGS[geo] || '🌐'}</span>
                                <h2 className="text-2xl font-bold text-white border-l-4 border-yellow-500 pl-4 uppercase tracking-tight">
                                    {GEO_NAMES[geo] || geo} <span className="text-gray-500 font-normal">VIP Sector</span>
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {geoGroups[geo].map((bonus, index) => (
                                    <VipBonusCard key={`${bonus.brand_name}-${bonus.id}`} bonus={bonus} rank={index + 1} />
                                ))}
                            </div>
                        </section>
                    ))
                )}

                <footer className="mt-20 border-t border-white/5 pt-12 text-center">
                    <p className="text-gray-500 text-sm mb-6 uppercase tracking-widest font-bold">
                        Gaming is for entertainment. Please gamble responsibly.
                    </p>
                    <Link href="/" className="text-yellow-500 hover:text-yellow-400 transition-colors font-black uppercase tracking-widest text-sm">
                        ← Return to Command Center
                    </Link>
                </footer>
            </div>
        </div>
    );
}
