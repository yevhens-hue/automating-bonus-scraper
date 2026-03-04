'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import type { OddsEvent } from '@/lib/odds';

export default function EventMatchCard({ event }: { event: OddsEvent }) {
    const isLive = event.is_live;
    const matchDate = new Date(event.start_time);
    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        if (isLive) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = matchDate.getTime() - now;

            if (distance < 0) {
                setTimeLeft('Started');
                clearInterval(interval);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

            if (days > 0) {
                setTimeLeft(`${days}d ${hours}h`);
            } else {
                setTimeLeft(`${hours}h ${minutes}m`);
            }
        }, 60000); // UI update every minute

        // initial call
        const now = new Date().getTime();
        const distance = matchDate.getTime() - now;
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            if (days > 0) setTimeLeft(`${days}d ${hours}h`);
            else setTimeLeft(`${hours}h ${Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))}m`);
        } else {
            setTimeLeft('Started');
        }

        return () => clearInterval(interval);
    }, [event.start_time, isLive, matchDate]);

    const formattedDate = matchDate.toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="relative group bg-white/[0.02] border border-white/10 hover:border-blue-500/30 rounded-3xl p-6 transition-all duration-300 shadow-2xl overflow-hidden flex flex-col h-full">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

            {/* Header: Tournament & Status */}
            <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-2">
                    <span className="bg-white/5 border border-white/10 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {event.sport}
                    </span>
                    <span className="text-xs text-blue-400 font-semibold truncate max-w-[150px]">
                        {event.tournament}
                    </span>
                </div>
                {isLive ? (
                    <span className="flex items-center gap-1.5 bg-red-500/10 text-red-500 border border-red-500/20 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> LIVE
                    </span>
                ) : (
                    <span className="text-[10px] font-bold text-gray-500 bg-black/40 px-2.5 py-1 rounded-full border border-white/5">
                        {timeLeft ? `Starts in ${timeLeft}` : formattedDate}
                    </span>
                )}
            </div>

            {/* Match Teams */}
            <div className="flex items-center justify-between mb-8 relative z-10 px-2">
                {/* Home Team */}
                <div className="flex flex-col items-center flex-1 w-1/3">
                    <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center p-2 mb-3 shadow-inner">
                        {event.team_home_logo ? (
                            <Image src={event.team_home_logo} alt={event.team_home} width={40} height={40} className="w-full h-full object-contain" unoptimized />
                        ) : (
                            <span className="text-xl font-black text-gray-600">A</span>
                        )}
                    </div>
                    <span className="text-sm font-bold text-white text-center leading-tight">
                        {event.team_home}
                    </span>
                </div>

                {/* VS */}
                <div className="flex flex-col items-center justify-center w-1/3">
                    <span className="text-[10px] font-black italic text-gray-600 uppercase mb-1">{formattedDate}</span>
                    <span className="text-xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-gray-500 to-gray-700">VS</span>
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center flex-1 w-1/3">
                    <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center p-2 mb-3 shadow-inner">
                        {event.team_away_logo ? (
                            <Image src={event.team_away_logo} alt={event.team_away} width={40} height={40} className="w-full h-full object-contain" unoptimized />
                        ) : (
                            <span className="text-xl font-black text-gray-600">B</span>
                        )}
                    </div>
                    <span className="text-sm font-bold text-white text-center leading-tight">
                        {event.team_away}
                    </span>
                </div>
            </div>

            <div className="mt-auto"></div>

            {/* Odds Markets */}
            {event.markets.map((market, marketIdx) => (
                <div key={marketIdx} className="border-t border-white/5 pt-5 relative z-10">
                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 text-center">
                        Highest Odds: {market.type}
                    </div>

                    <div className="flex justify-center gap-2 flex-wrap">
                        {market.outcomes.map((outcome, outcomeIdx) => (
                            <a
                                key={outcomeIdx}
                                href={outcome.affiliate_url}
                                target="_blank"
                                rel="nofollow sponsored noopener noreferrer"
                                className="flex-1 min-w-[30%] flex flex-col items-center justify-center bg-[#0a0f1a] border border-blue-900/30 hover:border-blue-500 hover:bg-blue-900/20 rounded-xl p-3 transition-all duration-300 group/odd active:scale-95"
                            >
                                <span className="text-[10px] text-gray-500 font-bold mb-1">{outcome.label}</span>
                                <span className="text-lg font-black text-white group-hover/odd:text-blue-400 leading-none mb-1">
                                    {outcome.best_odd.toFixed(2)}
                                </span>
                                <span className="text-[9px] uppercase tracking-wider font-bold text-blue-500/70 truncate max-w-full">
                                    {outcome.brand_name}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
