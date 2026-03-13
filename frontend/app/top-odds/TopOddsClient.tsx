'use client';
import React, { useState, useMemo } from 'react';
import { OddsEvent } from '@/lib/odds';
import EventMatchCard from '@/components/EventMatchCard';
import Link from 'next/link';

export default function TopOddsClient({ events }: { events: OddsEvent[] }) {
    const [selectedSport, setSelectedSport] = useState<string>('All');

    // Extract unique sports for the filter bar
    const sports = useMemo(() => {
        const unique = Array.from(new Set(events.map(e => e.sport)));
        return ['All', ...unique.sort()];
    }, [events]);

    const filteredEvents = useMemo(() => {
        if (selectedSport === 'All') return events;
        return events.filter(e => e.sport === selectedSport);
    }, [events, selectedSport]);

    // Separate Live and Upcoming events
    const { liveEvents, upcomingEvents } = useMemo(() => {
        const now = new Date();
        const live: OddsEvent[] = [];
        const upcoming: OddsEvent[] = [];

        filteredEvents.forEach(e => {
            const startTime = new Date(e.start_time);
            
            // If it's explicitly marked as live by the scraper OR it started recently (last 4 hours)
            // The Odds API usually stops returning odds for finished games.
            if (e.is_live || (startTime <= now && (now.getTime() - startTime.getTime()) < 4 * 60 * 60 * 1000)) {
                live.push(e);
            } else if (startTime > now) {
                upcoming.push(e);
            }
        });

        return {
            liveEvents: live,
            upcomingEvents: upcoming.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
        };
    }, [filteredEvents]);

    return (
        <>
            <header className="mb-12 text-center relative pt-12">
                {/* Background glow for hero section */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[40rem] h-48 bg-gradient-to-r from-blue-600/20 via-cyan-500/10 to-purple-600/20 blur-[120px] rounded-full -z-10 animate-pulse"></div>

                <div className="inline-block bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] px-5 py-2 rounded-full mb-8 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    <span className="inline-block animate-bounce mr-2">🎯</span>Live Market Analysis
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase italic drop-shadow-2xl">
                    Top <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-400 via-cyan-300 to-indigo-500">Odds</span> Radar
                </h1>

                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-medium mb-12 leading-relaxed">
                    Stop leaving money on the table. We scan the market to find the <span className="text-white">highest odds</span> across our verified bookmakers for the biggest matches.
                </p>

                {/* Filters */}
                {sports.length > 1 && (
                    <div className="flex justify-center flex-wrap gap-3 mb-12 border-y border-white/5 py-6 bg-white/[0.01]">
                        {sports.map(sport => (
                            <button
                                key={sport}
                                onClick={() => setSelectedSport(sport)}
                                className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${selectedSport === sport
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-transparent scale-105'
                                    : 'bg-white/5 text-gray-500 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20'
                                    }`}
                            >
                                {sport}
                            </button>
                        ))}
                    </div>
                )}
            </header>

            {/* Live Events Section */}
            {liveEvents.length > 0 && (
                <section className="mb-20">
                    <div className="flex items-center gap-4 mb-10 border-b border-red-500/20 pb-4 relative">
                        <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-gradient-to-r from-red-500 to-transparent"></div>
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]"></span>
                        </span>
                        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 uppercase tracking-tighter">Live Now</h2>
                        <span className="text-xs font-bold text-red-500 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 ml-2 tracking-widest">{liveEvents.length} MATCHES</span>
                    </div>
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        style={{ contentVisibility: 'auto' } as any}
                    >
                        {liveEvents.map((event) => (
                            <div key={event.id} className="transform transition-all duration-500 hover:-translate-y-2">
                                <EventMatchCard event={event} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Upcoming Events Section */}
            {upcomingEvents.length > 0 && (
                <section className="mb-20">
                    <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-4 relative">
                        <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-gradient-to-r from-blue-500 to-transparent"></div>
                        <span className="text-3xl">🗓️</span>
                        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 uppercase tracking-tighter">Upcoming Highlights</h2>
                        <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 ml-2 tracking-widest">{upcomingEvents.length} MATCHES</span>
                    </div>
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        style={{ contentVisibility: 'auto' } as any}
                    >
                        {upcomingEvents.map((event) => (
                            <div key={event.id} className="transform transition-all duration-500 hover:-translate-y-2">
                                <EventMatchCard event={event} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {filteredEvents.length === 0 && (
                <div className="text-center py-32 border border-white/5 rounded-[3rem] bg-gradient-to-b from-white/[0.02] to-transparent shadow-inner">
                    <span className="text-6xl mb-6 block opacity-50 grayscale">📡</span>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">No active signals</h3>
                    <p className="text-gray-500 italic max-w-md mx-auto leading-relaxed">
                        The radar is clear for <strong className="text-gray-300">{selectedSport}</strong> right now. Check back later or clear your filters to explore other events.
                    </p>
                    {selectedSport !== 'All' && (
                        <button
                            onClick={() => setSelectedSport('All')}
                            className="mt-8 px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest rounded-full border border-white/10 transition-all text-xs"
                        >
                            View All Sports
                        </button>
                    )}
                </div>
            )}
        </>
    );
}
