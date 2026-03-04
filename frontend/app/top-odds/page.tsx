import React from 'react';
import oddsData from '@/data/odds.json';
import { OddsEvent, OddsData } from '@/lib/odds';
import EventMatchCard from '@/components/EventMatchCard';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Top Betting Odds 2026 — Track Best Match Winner Lines',
    description: 'Find the highest odds for upcoming sports and esports events. Compare bookmakers instantly for Champions League, IPL, NBA, and CS2 Majors.',
};

export default function TopOddsPage() {
    const data = oddsData as OddsData;
    const events: OddsEvent[] = data.events;

    // Separate Live and Upcoming events
    const liveEvents = events.filter(e => e.is_live);
    const upcomingEvents = events.filter(e => !e.is_live).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

    return (
        <div className="min-h-screen bg-[#050810] text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-16 text-center relative">
                    {/* Background glow for hero section */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30rem] h-32 bg-blue-600/10 blur-[100px] rounded-full -z-10"></div>

                    <div className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-6">
                        📈 Live Market Analysis
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight uppercase italic">
                        Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Odds</span> Radar
                    </h1>

                    <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium mb-8">
                        Stop leaving money on the table. We scan the market to find the highest odds across our verified bookmakers for the biggest matches.
                    </p>

                    <div className="flex justify-center flex-wrap gap-4">
                        <Link href="/all-bonuses" className="text-gray-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            ← Back to Bonuses
                        </Link>
                    </div>
                </header>

                {/* Live Events Section */}
                {liveEvents.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-8 border-b border-red-500/20 pb-4">
                            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]"></span>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Live Now</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {liveEvents.map((event) => (
                                <EventMatchCard key={event.id} event={event} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Upcoming Events Section */}
                {upcomingEvents.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                            <span className="text-2xl">🗓️</span>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Upcoming Highlights</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingEvents.map((event) => (
                                <EventMatchCard key={event.id} event={event} />
                            ))}
                        </div>
                    </section>
                )}

                {events.length === 0 && (
                    <div className="text-center py-20 border border-white/10 rounded-3xl bg-white/[0.02]">
                        <p className="text-gray-500 italic">No major events tracked right now. Check back before the weekend!</p>
                    </div>
                )}

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
