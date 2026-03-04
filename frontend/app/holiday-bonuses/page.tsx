import React from 'react';
import bonusesData from '@/data/bonuses.json';
import { Bonus } from '@/lib/bonuses';
import BonusCard from '@/components/BonusCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function HolidayBonusesPage() {
    // Filter out inactive bonuses and keep ONLY holiday types
    const bonuses = ((bonusesData.bonuses || []) as unknown as Bonus[]).filter(
        b => {
            const isActive = (b as any).is_active !== 0;
            const isHoliday = b.bonus_type === 'holiday' || (b.extra_data && (b.extra_data.toLowerCase().includes('holiday') || b.extra_data.toLowerCase().includes('event') || b.extra_data.toLowerCase().includes('festival')));
            return isActive && isHoliday;
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
        <div className="min-h-screen bg-[#0a0d1a] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Festive Background Elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-12 text-center">
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-green-500">
                            🎁 Holiday Offers 2026
                        </span>
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-medium leading-relaxed">
                        Exclusive, time-sensitive promotions for major festivals and holidays. Don't miss these limited-time casino and betting rewards!
                    </p>

                    <div className="flex justify-center">
                        <Link href="/holiday-bonuses/table" className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-900/20 active:scale-95">
                            📊 Switch to Table View
                        </Link>
                    </div>
                </header>

                {geos.length === 0 && (
                    <div className="text-center py-20 border border-dashed border-red-500/30 rounded-3xl bg-red-500/5">
                        <p className="text-red-400 font-medium text-lg">🎄 No active holiday bonuses right now. Check back closer to the next big festival!</p>
                    </div>
                )}

                {geos.map((geo) => (
                    <section key={geo} className="mb-16">
                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-3xl">{geoFlags[geo] || '🌐'}</span>
                            <h2 className="text-2xl font-bold text-white border-l-4 border-red-500 pl-4">
                                {geoNames[geo] || geo} Specials
                            </h2>
                            <span className="text-xs text-red-200 uppercase font-bold tracking-widest bg-red-900/50 border border-red-500/20 px-3 py-1 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                {geoGroups[geo].length} Offers Live
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
                        <Link href="/all-bonuses" className="text-gray-400 flex items-center gap-2 hover:text-white transition-colors"><span>📊 All</span></Link>
                        <Link href="/casino-bonuses" className="text-gray-400 flex items-center gap-2 hover:text-white transition-colors"><span>🎰 Casino</span></Link>
                        <Link href="/betting-bonuses" className="text-gray-400 flex items-center gap-2 hover:text-white transition-colors"><span>🏏 Betting</span></Link>
                    </div>
                    <div className="text-gray-500 text-sm mb-4">
                        © 2026 games-income.com — Celebrating Big Wins
                    </div>
                    <Link href="/" className="text-red-400 hover:text-red-300 transition-colors font-bold">
                        ← Back to Home
                    </Link>
                </footer>
            </div>
        </div>
    );
}
