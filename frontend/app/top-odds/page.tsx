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
        <div className="bg-[#050810] text-white py-12 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <TopOddsClient events={events} />

                <div className="mt-20 border-t border-white/5 pt-12 flex flex-col items-center">
                    <Link href="/" className="text-blue-500 hover:text-blue-400 transition-colors font-bold flex items-center gap-2 text-sm uppercase tracking-widest">
                        <span>←</span> Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
