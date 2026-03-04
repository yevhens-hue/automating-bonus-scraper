'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import bonusesData from '@/data/bonuses.json';
import { Bonus } from '@/lib/bonuses';
import BonusCard from '@/components/BonusCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function AllBonusesContent() {
    const searchParams = useSearchParams();
    const typeParam = searchParams.get('type');
    const [activeTab, setActiveTab] = useState<'all' | 'casino' | 'betting' | 'holiday' | 'vip'>('all');

    useEffect(() => {
        if (['casino', 'betting', 'holiday', 'vip'].includes(typeParam as string)) {
            setActiveTab(typeParam as any);
        } else {
            setActiveTab('all');
        }
    }, [typeParam]);

    const bonuses = (bonusesData.bonuses as unknown as Bonus[]).filter(
        b => {
            const isActive = (b as any).is_active !== 0;
            if (!isActive) return false;

            if (activeTab === 'all') return true;
            if (activeTab === 'casino' || activeTab === 'betting') return b.type === activeTab;

            if (activeTab === 'holiday') {
                return b.bonus_type === 'holiday' || (b.extra_data && (b.extra_data.toLowerCase().includes('holiday') || b.extra_data.toLowerCase().includes('event') || b.extra_data.toLowerCase().includes('festival')));
            }

            if (activeTab === 'vip') {
                return b.bonus_type === 'vip' || (b.extra_data && b.extra_data.toLowerCase().includes('vip'));
            }

            return false;
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

                    <div className="flex flex-col items-center gap-6">
                        <div className="bg-white/5 border border-white/10 p-1.5 rounded-2xl flex flex-wrap justify-center gap-1 backdrop-blur-md">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'all' ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-gray-500 hover:text-white'}`}
                            >
                                🌐 All
                            </button>
                            <button
                                onClick={() => setActiveTab('casino')}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'casino' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40' : 'text-gray-500 hover:text-white'}`}
                            >
                                🎰 Casino
                            </button>
                            <button
                                onClick={() => setActiveTab('betting')}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'betting' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-gray-500 hover:text-white'}`}
                            >
                                🏏 Betting
                            </button>
                            <button
                                onClick={() => setActiveTab('holiday')}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'holiday' ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'text-gray-500 hover:text-white'}`}
                            >
                                🎁 Holiday
                            </button>
                            <button
                                onClick={() => setActiveTab('vip')}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'vip' ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-900/40' : 'text-gray-500 hover:text-white'}`}
                            >
                                👑 VIP
                            </button>
                        </div>

                        <div className="flex justify-center gap-4">
                            <Link href={`/all-bonuses/table${activeTab !== 'all' ? `?type=${activeTab}` : ''}`} className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/20 rounded-xl font-bold transition-all active:scale-95 text-xs uppercase tracking-widest">
                                📊 View Detailed Table
                            </Link>
                        </div>
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

export default function AllBonusesPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        }>
            <AllBonusesContent />
        </Suspense>
    );
}
