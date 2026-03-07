'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { OddsEvent } from '@/lib/odds';
import ProfitCalculator from './ProfitCalculator';

function getSportColor(sport: string) {
    const s = sport.toLowerCase();
    if (s.includes('soccer') || s.includes('football')) return 'bg-green-500/20';
    if (s.includes('basketball')) return 'bg-orange-500/20';
    if (s.includes('esport') || s.includes('cs2') || s.includes('dota') || s.includes('league')) return 'bg-indigo-500/20';
    if (s.includes('tennis')) return 'bg-lime-500/20';
    if (s.includes('cricket')) return 'bg-cyan-500/20';
    return 'bg-blue-500/20';
}

function getSportBorderHover(sport: string) {
    const s = sport.toLowerCase();
    if (s.includes('soccer') || s.includes('football')) return 'hover:border-green-500/50';
    if (s.includes('basketball')) return 'hover:border-orange-500/50';
    if (s.includes('esport') || s.includes('cs2') || s.includes('dota') || s.includes('league')) return 'hover:border-indigo-500/50';
    if (s.includes('tennis')) return 'hover:border-lime-500/50';
    if (s.includes('cricket')) return 'hover:border-cyan-500/50';
    return 'hover:border-blue-500/50';
}

export default React.memo(function EventMatchCard({ event }: { event: OddsEvent }) {
    const isLive = event.is_live;
    const matchDate = new Date(event.start_time);
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [activeCalc, setActiveCalc] = useState<{ outcomeLabel: string, odds: number, brandName: string } | null>(null);
    const sportGlow = getSportColor(event.sport);
    const borderHover = getSportBorderHover(event.sport);

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
        <div className={`relative group bg-white/[0.02] border border-white/10 ${borderHover} rounded-3xl p-6 transition-all duration-500 shadow-2xl overflow-hidden flex flex-col h-full`}>
            {/* Dynamic Background Glow */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 ${sportGlow} rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}></div>

            <Link href={`/match/${event.slug}`} className="absolute inset-0 z-0"></Link>

            {/* Header: Tournament & Status */}
            <div className="flex justify-between items-center mb-6 relative z-10 pointer-events-none">
                <div className="flex items-center gap-2">
                    <span className="bg-white/10 border border-white/20 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest text-gray-300 shadow-sm">
                        {event.sport}
                    </span>
                    <span className="text-xs text-gray-400 font-bold truncate max-w-[140px] group-hover:text-white transition-colors duration-300">
                        {event.tournament}
                    </span>
                </div>
                {isLive ? (
                    <span className="flex items-center gap-2 bg-red-500/10 text-red-500 border border-red-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                        <span className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.8)]"></span> LIVE
                    </span>
                ) : (
                    <span className="text-[10px] font-bold text-gray-400 bg-black/50 px-3 py-1 rounded-full border border-white/10 shadow-inner">
                        {timeLeft ? `Starts in ${timeLeft}` : formattedDate}
                    </span>
                )}
            </div>

            {/* Match Teams */}
            <div className="flex items-center justify-between mb-8 relative z-10 px-1">
                {/* Home Team */}
                <div className="flex flex-col items-center flex-1 w-[40%]">
                    <div className="w-16 h-16 bg-gradient-to-br from-white/10 to-transparent border border-white/20 rounded-2xl flex items-center justify-center p-2 mb-4 shadow-xl group-hover:scale-110 transition-transform duration-500 ease-out">
                        {event.team_home_logo ? (
                            <Image src={event.team_home_logo} alt={event.team_home} width={48} height={48} className="w-full h-full object-contain drop-shadow-lg" unoptimized />
                        ) : (
                            <span className="text-2xl font-black text-gray-500 drop-shadow-md">
                                {event.team_home.substring(0, 2).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <span className="text-sm font-black text-white text-center leading-tight line-clamp-2">
                        {event.team_home}
                    </span>
                </div>

                {/* VS */}
                <div className="flex flex-col items-center justify-center w-[20%]">
                    <span className="text-[9px] font-black italic text-gray-500 uppercase mb-2 tracking-widest text-center leading-tight hidden sm:block">
                        {formattedDate.split(',')[0]}<br />{formattedDate.split(',')[1]}
                    </span>
                    <span className="text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-gray-400 to-gray-700 opacity-50 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg">
                        VS
                    </span>
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center flex-1 w-[40%]">
                    <div className="w-16 h-16 bg-gradient-to-bl from-white/10 to-transparent border border-white/20 rounded-2xl flex items-center justify-center p-2 mb-4 shadow-xl group-hover:scale-110 transition-transform duration-500 ease-out">
                        {event.team_away_logo ? (
                            <Image src={event.team_away_logo} alt={event.team_away} width={48} height={48} className="w-full h-full object-contain drop-shadow-lg" unoptimized />
                        ) : (
                            <span className="text-2xl font-black text-gray-500 drop-shadow-md">
                                {event.team_away.substring(0, 2).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <span className="text-sm font-black text-white text-center leading-tight line-clamp-2">
                        {event.team_away}
                    </span>
                </div>
            </div>

            <div className="mt-auto"></div>

            {/* Odds Markets */}
            {event.markets.map((market, marketIdx) => {
                const impliedProb = market.outcomes.reduce((acc, curr) => acc + (1 / curr.best_odd), 0);
                const isSurebet = impliedProb > 0 && impliedProb < 1;
                const profitMargin = isSurebet ? ((1 / impliedProb) - 1) * 100 : 0;

                return (
                    <div key={marketIdx} className="border-t border-white/10 pt-6 relative z-10">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="text-[#ffe100]">⚡</span> Highest Market Odds
                                </span>
                                <span className="text-[8px] text-[#ffe100]/70 font-bold uppercase tracking-widest pl-5">
                                    Maximum Player Return
                                </span>
                            </div>
                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest bg-white/5 px-2 py-1 rounded border border-white/5 flex flex-col items-end gap-1">
                                <span>{market.type}</span>
                                {isSurebet && (
                                    <span className="text-[#00ff88] animate-pulse whitespace-nowrap shadow-[0_0_10px_rgba(0,255,136,0.3)] bg-[#00ff88]/10 px-1.5 rounded">🔥 SUREBET: +{profitMargin.toFixed(2)}%</span>
                                )}
                            </span>
                        </div>

                        <div className="flex justify-center gap-3">
                            {market.outcomes.map((outcome, outcomeIdx) => (
                                <div key={outcomeIdx} className="relative flex-1 group/odd">
                                    <a
                                        href={outcome.affiliate_url}
                                        target="_blank"
                                        rel="nofollow sponsored noopener noreferrer"
                                        className="flex flex-col items-center justify-center bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-[#ffe100]/50 hover:from-[#ffe100]/10 hover:to-transparent rounded-2xl p-3 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_-10px_rgba(255,225,0,0.3)] active:scale-95"
                                    >
                                        <span className="text-xs text-gray-400 font-bold mb-1 truncate w-full text-center pr-3">
                                            {outcome.label}
                                        </span>
                                        <span className="text-xl font-black text-white group-hover/odd:text-[#ffe100] leading-none mb-1.5 drop-shadow-md group-hover/odd:scale-110 transition-transform duration-300">
                                            {outcome.best_odd.toFixed(2)}
                                        </span>
                                        <span className="text-[9px] uppercase tracking-widest font-black text-gray-500 group-hover/odd:text-[#ffe100]/80 truncate w-full text-center transition-colors">
                                            {outcome.brand_name}
                                        </span>
                                    </a>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveCalc({
                                                outcomeLabel: outcome.label,
                                                odds: outcome.best_odd,
                                                brandName: outcome.brand_name
                                            });
                                        }}
                                        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-black/40 hover:bg-[#ffe100]/20 border border-white/10 hover:border-[#ffe100]/50 rounded-full text-gray-400 hover:text-[#ffe100] transition-colors shadow-md z-20"
                                        title="Open Profit Calculator"
                                    >
                                        <span className="text-[9px]">💵</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            {/* Active Calculator Overlay */}
            {activeCalc && (
                <ProfitCalculator
                    outcomeLabel={activeCalc.outcomeLabel}
                    odds={activeCalc.odds}
                    brandName={activeCalc.brandName}
                    onClose={() => setActiveCalc(null)}
                />
            )}
        </div>
    );
});
