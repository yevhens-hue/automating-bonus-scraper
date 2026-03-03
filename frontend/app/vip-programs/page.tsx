import React from 'react';
import bonusesData from '@/data/bonuses.json';
import { Bonus } from '@/lib/bonuses';
import VipBonusCard from '@/components/VipBonusCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function VipProgramsPage() {
    // Filter out inactive bonuses and keep ONLY vip types
    const bonuses = ((bonusesData.bonuses || []) as unknown as Bonus[]).filter(
        b => {
            const isActive = (b as any).is_active !== 0;
            const isVip = b.bonus_type === 'vip' || (b.extra_data && (b.extra_data.toLowerCase().includes('vip') || b.extra_data.toLowerCase().includes('tier') || b.extra_data.toLowerCase().includes('level')));
            return isActive && isVip;
        }
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
        <div className="min-h-screen bg-[#050505] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Premium Gold Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-yellow-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-16 text-center">
                    <span className="text-yellow-500 font-bold tracking-widest uppercase text-sm mb-4 inline-block border border-yellow-500/30 px-4 py-1.5 rounded-full bg-yellow-500/5">
                        High Roller Exclusives
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black mt-4 mb-6 tracking-tighter">
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 via-amber-400 to-yellow-600">
                            VIP Loyalty Clubs
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed">
                        Compare top-tier VIP programs, uncover hidden loyalty perks, and see exactly what it takes to reach Diamond status in 2026.
                    </p>
                </header>

                {geos.length === 0 && (
                    <div className="text-center py-20 border border-dashed border-yellow-500/20 rounded-3xl bg-yellow-500/5">
                        <p className="text-yellow-400/70 font-medium text-lg">👑 Premium data is being gathered by our automated systems. Check back soon.</p>
                    </div>
                )}

                {geos.map((geo) => (
                    <section key={geo} className="mb-20">
                        <div className="flex items-center gap-4 mb-10 pb-4 border-b border-white/5">
                            <span className="text-4xl drop-shadow-lg">{geoFlags[geo] || '🌐'}</span>
                            <div className="flex-1">
                                <h2 className="text-3xl font-black text-white tracking-tight">
                                    {geoNames[geo] || geo} <span className="text-gray-500 font-light">VIP Lounges</span>
                                </h2>
                            </div>
                            <span className="text-xs text-yellow-500 uppercase font-black tracking-widest bg-yellow-950/40 px-4 py-2 rounded-lg border border-yellow-500/30">
                                {geoGroups[geo].length} Programs
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {geoGroups[geo].map((bonus, idx) => (
                                <VipBonusCard key={`${bonus.brand_name}-${bonus.id}`} bonus={bonus} rank={idx + 1} />
                            ))}
                        </div>
                    </section>
                ))}

                <footer className="mt-24 border-t border-white/5 pt-12 flex flex-col items-center">
                    <div className="flex flex-wrap justify-center gap-8 mb-8 text-sm font-bold uppercase tracking-widest">
                        <Link href="/all-bonuses" className="text-gray-500 hover:text-white transition-colors">All Bonuses</Link>
                        <Link href="/casino-bonuses" className="text-gray-500 hover:text-white transition-colors">Casino</Link>
                        <Link href="/holiday-bonuses" className="text-gray-500 hover:text-white transition-colors">Holiday Events</Link>
                    </div>
                    <div className="text-gray-600 text-sm mb-6">
                        © 2026 games-income.com — Elite Gaming Data
                    </div>
                    <Link href="/" className="text-yellow-600 hover:text-yellow-500 transition-colors font-bold flex items-center gap-2">
                        <span>← Back to Main Lobby</span>
                    </Link>
                </footer>
            </div>
        </div>
    );
}
