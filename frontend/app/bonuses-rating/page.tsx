import React from 'react';
import bonusesData from '@/data/bonuses.json';
import { Bonus } from '@/lib/bonuses';
import BonusTableRow from '@/components/BonusTableRow';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function BonusesRatingPage() {
    // Filter active bonuses and sort by rating (descending)
    const bonuses = (bonusesData.bonuses as unknown as Bonus[])
        .filter(b => (b as any).is_active !== 0)
        .sort((a, b) => b.rating - a.rating);

    return (
        <div className="min-h-screen bg-[#050505] text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="mb-16 text-center relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/10 blur-[120px] rounded-full -z-10"></div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Live Rating System 2026</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter leading-none italic">
                        Top Rated <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400">Bonuses</span>
                    </h1>

                    <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                        Our algorithm ranks bonuses based on wagering requirements, maximum cashout, and player feedback.
                        Updated in real-time from over 50+ verified brands.
                    </p>
                </header>

                <div className="relative border border-white/10 rounded-[32px] overflow-hidden bg-white/[0.02] backdrop-blur-3xl shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.03]">
                                    <th className="py-6 pl-4 text-center text-[10px] font-black uppercase tracking-widest text-gray-500 w-16">Rank</th>
                                    <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Brand</th>
                                    <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Bonus Offer</th>
                                    <th className="py-6 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hidden md:table-cell text-center">Rating</th>
                                    <th className="py-6 px-4 pr-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-500">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bonuses.length > 0 ? (
                                    bonuses.map((bonus, index) => (
                                        <BonusTableRow
                                            key={`${bonus.brand_id}-${bonus.id}-${index}`}
                                            bonus={bonus}
                                            rank={index + 1}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center text-gray-500 italic">
                                            No bonuses found. Check back later!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-[24px] bg-white/[0.03] border border-white/5">
                        <div className="text-3xl mb-4">🛡️</div>
                        <h4 className="text-white font-bold mb-2">Verified Brands</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">Every brand in our table undergoes a strict background check for license and security.</p>
                    </div>
                    <div className="p-8 rounded-[24px] bg-white/[0.03] border border-white/5">
                        <div className="text-3xl mb-4">⚡</div>
                        <h4 className="text-white font-bold mb-2">Live Updates</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">Our scraper checks for new bonuses every hour to ensure you never miss a deal.</p>
                    </div>
                    <div className="p-8 rounded-[24px] bg-white/[0.03] border border-white/5">
                        <div className="text-3xl mb-4">📊</div>
                        <h4 className="text-white font-bold mb-2">Data-Driven Rating</h4>
                        <p className="text-gray-500 text-sm leading-relaxed">Ratings are calculated using over 15+ data points including RTP and payout speed.</p>
                    </div>
                </div>

                <footer className="mt-20 border-t border-white/5 pt-12 flex flex-col items-center">
                    <div className="flex gap-8 mb-8">
                        <Link href="/all-bonuses" className="text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">Grid View</Link>
                        <Link href="/bonuses-by-country" className="text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">By Country</Link>
                        <Link href="/casino-bonuses" className="text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">Casino</Link>
                        <Link href="/betting-bonuses" className="text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">Betting</Link>
                    </div>
                    <div className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        © 2026 games-income.com — All Rights Reserved
                    </div>
                    <Link href="/" className="text-purple-500 hover:text-purple-400 transition-colors font-bold flex items-center gap-2">
                        <span className="text-lg">←</span> Back to Home
                    </Link>
                </footer>
            </div>
        </div>
    );
}
