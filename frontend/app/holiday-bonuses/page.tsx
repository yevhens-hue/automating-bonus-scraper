import React from 'react';
import bonusesData from '@/data/bonuses.json';
import { Bonus } from '@/lib/bonuses';
import BonusCard from '@/components/BonusCard';
import Link from 'next/link';

export const metadata = {
    title: 'Holiday & Seasonal Bonuses 2026 — Games Income',
    description: 'Special festive offers, limited-time events, and seasonal promotions from top iGaming brands. Verified holiday deals updated every 6 hours.',
};

export default function HolidayBonusesPage() {
    const bonuses = (bonusesData.bonuses as unknown as Bonus[]).filter(
        b => {
            const isActive = (b as any).is_active !== 0;
            if (!isActive) return false;
            return b.bonus_type === 'holiday' || (b.extra_data && (b.extra_data.toLowerCase().includes('holiday') || b.extra_data.toLowerCase().includes('event') || b.extra_data.toLowerCase().includes('festival')));
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
        <div className="min-h-screen bg-[#0a0d1a] text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 text-center">
                    <div className="inline-block bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6">
                        🎁 Limited Edition
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-red-600 mb-6 uppercase tracking-tighter italic">
                        Holiday Specials
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8 font-medium">
                        Seasonal festivals and global events captured in real-time.
                        Don't miss these time-limited opportunities.
                    </p>

                    <div className="flex justify-center gap-4">
                        <Link href="/all-bonuses" className="text-gray-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            ← All Bonuses
                        </Link>
                    </div>
                </header>

                {geos.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-gray-800 rounded-3xl bg-white/5">
                        <p className="text-gray-500 italic">No seasonal offers active right now. Check back during the next festival!</p>
                    </div>
                ) : (
                    geos.map((geo) => (
                        <section key={geo} className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-3xl">{geoFlags[geo] || '🌐'}</span>
                                <h2 className="text-2xl font-bold text-white border-l-4 border-red-500 pl-4 uppercase tracking-tight">
                                    {geoNames[geo] || geo} <span className="text-gray-500 font-normal">Festivals</span>
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {geoGroups[geo].map((bonus) => (
                                    <BonusCard key={`${bonus.brand_name}-${bonus.id}`} bonus={bonus} />
                                ))}
                            </div>
                        </section>
                    ))
                )}

                <footer className="mt-20 border-t border-white/5 pt-12 text-center">
                    <p className="text-gray-500 text-sm mb-6 uppercase tracking-widest font-bold">
                        Gaming is for entertainment. Please gamble responsibly.
                    </p>
                    <Link href="/" className="text-red-500 hover:text-red-400 transition-colors font-black uppercase tracking-widest text-sm">
                        ← Return to Command Center
                    </Link>
                </footer>
            </div>
        </div>
    );
}
