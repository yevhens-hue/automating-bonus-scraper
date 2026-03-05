import React from 'react';
import oddsData from '@/data/odds.json';
import { OddsEvent, OddsData } from '@/lib/odds';
import TopOddsClient from './TopOddsClient';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Top Betting Odds 2026 — Track Best Match Winner Lines',
    description: 'Find the highest odds for upcoming sports and esports events. Compare bookmakers instantly for Champions League, IPL, NBA, and CS2 Majors.',
};

export default function TopOddsPage() {
    const data = oddsData as OddsData;
    const events: OddsEvent[] = data.events;

    return (
        <div className="min-h-screen bg-[#050810] text-white py-12 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <TopOddsClient events={events} />

                <footer className="mt-20 border-t border-white/5 pt-12 flex flex-col items-center">
                    <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm font-bold uppercase tracking-widest">
                        <Link href="/all-bonuses?type=betting" className="text-gray-400 hover:text-blue-400 transition-colors">Betting Bonuses</Link>
                        <Link href="/bonuses-rating" className="text-gray-400 hover:text-white transition-colors">Top Rated Sportsbooks</Link>
                    </div>
                    <div className="text-gray-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        Data from {data.updated_at ? new Date(data.updated_at).toLocaleDateString() : 'recently'}
                    </div>
                    <Link href="/" className="text-blue-500 hover:text-blue-400 transition-colors font-bold flex items-center gap-2 text-sm uppercase tracking-widest">
                        <span>←</span> Return Home
                    </Link>
                </footer>
            </div>
        </div>
    );
}
