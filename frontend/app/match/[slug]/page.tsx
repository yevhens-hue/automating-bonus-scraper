import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { OddsData, OddsEvent, OddsMarket } from '@/lib/odds';
import path from 'path';
import fs from 'fs';
import Image from 'next/image';
import Script from 'next/script';
import BookmakerTable from './BookmakerTable';
import ClientCalculator from './ClientCalculator';
import Link from 'next/link';

// Helper to get odds data
async function getOddsData(): Promise<OddsData | null> {
    try {
        const filePath = path.join(process.cwd(), 'data', 'odds.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        console.error('Error reading odds.json:', error);
        return null;
    }
}

// Generate static params for build time
export async function generateStaticParams() {
    const oddsData = await getOddsData();
    if (!oddsData || !oddsData.events) return [];

    return oddsData.events.map((event) => ({
        slug: event.slug,
    }));
}

// Generate dynamic metadata for each match
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const oddsData = await getOddsData();
    const event = oddsData?.events.find(e => e.slug === resolvedParams.slug);

    if (!event) {
        return { title: 'Match Not Found' };
    }

    const title = `${event.team_home} vs ${event.team_away} Betting Odds & Predictions | Top Odds Radar`;
    const description = `Compare the best betting odds and predictions for the ${event.tournament} match between ${event.team_home} and ${event.team_away}. Find value bets and highest returns.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
        }
    };
}

export default async function MatchPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const oddsData = await getOddsData();
    const event = oddsData?.events.find(e => e.slug === resolvedParams.slug);

    if (!event) {
        notFound();
    }

    const matchDate = new Date(event.start_time);
    const formattedDate = matchDate.toLocaleDateString('en-GB', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const isLive = event.is_live;
    const mainMarket = event.markets?.[0];

    // Auto-generate some insight text based on implied probability
    let insightText = "Odds analysis is not available for this match.";
    if (mainMarket && mainMarket.bookmakers && mainMarket.bookmakers.length > 0) {
        const averageProb = mainMarket.bookmakers.reduce((acc, bm) => acc + (bm.implied_probability || 1), 0) / mainMarket.bookmakers.length;
        const margin = ((averageProb - 1) * 100).toFixed(1);

        insightText = `According to our comprehensive tracking across ${mainMarket.bookmakers.length} bookmakers, the average betting margin for this ${event.tournament} clash is approximately ${margin}%. Compare the odds below to find the best value for ${event.team_home} vs ${event.team_away}.`;
    }

    // JSON-LD SportsEvent Schema
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        "name": `${event.team_home} vs ${event.team_away}`,
        "description": `Betting odds comparison for ${event.team_home} vs ${event.team_away} in the ${event.tournament}.`,
        "startDate": event.start_time,
        "sport": event.sport,
        "competitor": [
            {
                "@type": "SportsTeam",
                "name": event.team_home,
                "image": event.team_home_logo
            },
            {
                "@type": "SportsTeam",
                "name": event.team_away,
                "image": event.team_away_logo
            }
        ],
        "offers": mainMarket?.outcomes.map(outcome => ({
            "@type": "Offer",
            "name": outcome.label,
            "price": outcome.best_odd,
            "priceCurrency": "USD",
            "seller": {
                "@type": "Organization",
                "name": outcome.brand_name
            }
        }))
    };

    return (
        <main className="min-h-screen bg-[#050811] text-white">
            <Script id={`schema-match-${event.id}`} type="application/ld+json">
                {JSON.stringify(jsonLd)}
            </Script>

            {/* Breadcrumbs */}
            <div className="container mx-auto px-4 py-6 text-xs text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2">
                <Link href="/" className="hover:text-[#ffe100] transition-colors">Home</Link>
                <span>/</span>
                <Link href="/top-odds" className="hover:text-[#ffe100] transition-colors">Top Odds Radar</Link>
                <span>/</span>
                <span className="text-[#ffe100] truncate">{event.team_home} vs {event.team_away}</span>
            </div>

            {/* Hero Section */}
            <div className="relative pt-10 pb-20 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1000px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] text-gray-300 mb-6">
                            <span>{event.sport}</span>
                            <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                            <span>{event.tournament}</span>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-center md:gap-16 gap-8 mb-8">
                            {/* Home Team */}
                            <div className="flex flex-col items-center flex-1 max-w-[250px]">
                                {event.team_home_logo ? (
                                    <div className="w-32 h-32 relative mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                        <Image src={event.team_home_logo} alt={event.team_home} fill className="object-contain" unoptimized />
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 bg-gradient-to-br from-white/10 to-transparent border border-white/20 rounded-3xl mb-6 flex items-center justify-center shadow-xl">
                                        <span className="text-5xl font-black text-gray-500 drop-shadow-md">
                                            {event.team_home.substring(0, 2).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <h2 className="text-2xl md:text-3xl font-black text-center">{event.team_home}</h2>
                            </div>

                            {/* VS & Time */}
                            <div className="flex flex-col items-center justify-center flex-shrink-0">
                                {isLive ? (
                                    <span className="flex items-center gap-2 bg-red-500/10 text-red-500 border border-red-500/30 px-4 py-2 rounded-full text-sm font-black uppercase tracking-[0.3em] animate-pulse mb-4">
                                        <span className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span> LIVE NOW
                                    </span>
                                ) : (
                                    <span className="text-[10px] md:text-xs font-bold text-[#ffe100] uppercase tracking-widest text-center mb-4 bg-[#ffe100]/10 border border-[#ffe100]/20 px-4 py-2 rounded-full shadow-inner">
                                        {formattedDate}
                                    </span>
                                )}
                                <span className="text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-gray-400 to-gray-700 opacity-30">
                                    VS
                                </span>
                            </div>

                            {/* Away Team */}
                            <div className="flex flex-col items-center flex-1 max-w-[250px]">
                                {event.team_away_logo ? (
                                    <div className="w-32 h-32 relative mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                        <Image src={event.team_away_logo} alt={event.team_away} fill className="object-contain" unoptimized />
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent border border-white/20 rounded-3xl mb-6 flex items-center justify-center shadow-xl">
                                        <span className="text-5xl font-black text-gray-500 drop-shadow-md">
                                            {event.team_away.substring(0, 2).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <h2 className="text-2xl md:text-3xl font-black text-center">{event.team_away}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        {/* AI Match Insight */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1/2 h-px bg-gradient-to-r from-transparent via-[#ffe100]/50 to-transparent"></div>
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#ffe100] mb-4 flex items-center gap-2">
                                <span>🤖</span> AI Match Insight
                            </h3>
                            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                                {insightText}
                            </p>
                            <p className="text-xs text-gray-600 mt-4 italic font-bold">
                                Note: Odds and margins are dynamic and subject to continuous change.
                            </p>
                        </div>

                        {/* Full Bookmaker Comparison */}
                        {mainMarket && (
                            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 lg:p-8">
                                <h3 className="text-xl font-black mb-6 uppercase tracking-widest text-white border-b border-white/10 pb-4">
                                    Full Market Comparison: <span className="text-[#ffe100]">{mainMarket.type}</span>
                                </h3>

                                {mainMarket.bookmakers && mainMarket.bookmakers.length > 0 ? (
                                    <BookmakerTable bookmakers={mainMarket.bookmakers} teamHome={event.team_home} teamAway={event.team_away} />
                                ) : (
                                    <div className="text-center py-10 text-gray-500">
                                        No deep market data available for this event yet.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar Area */}
                    <div className="flex flex-col gap-6">
                        {/* Market Summary Card */}
                        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 shadow-2xl sticky top-8">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 text-center">
                                Highest Market Odds
                            </h3>

                            {mainMarket && mainMarket.outcomes.map((outcome, idx) => (
                                <div key={idx} className="relative mb-4 last:mb-0 group">
                                    <a
                                        href={outcome.affiliate_url}
                                        target="_blank"
                                        rel="nofollow sponsored noopener noreferrer"
                                        className="flex items-center justify-between bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-[#ffe100]/50 rounded-2xl p-4 transition-all hover:bg-white/10 hover:shadow-[0_10px_20px_-10px_rgba(255,225,0,0.3)]"
                                    >
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-400 font-bold mb-1">{outcome.label}</span>
                                            <span className="text-[10px] text-gray-600 uppercase tracking-wider font-black">{outcome.brand_name}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-2xl font-black text-white group-hover:text-[#ffe100] transition-colors">
                                                {outcome.best_odd.toFixed(2)}
                                            </span>
                                            <span className="bg-white/10 w-8 h-8 rounded-full flex items-center justify-center text-xs group-hover:bg-[#ffe100]/20 group-hover:text-[#ffe100] transition-all">
                                                ↗
                                            </span>
                                        </div>
                                    </a>
                                </div>
                            ))}

                            <div className="mt-8 border-t border-white/10 pt-6">
                                <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest text-center mb-4">
                                    Try The Profit Calculator
                                </h4>
                                {mainMarket && mainMarket.outcomes[0] && (
                                    <ClientCalculator
                                        outcomeLabel={mainMarket.outcomes[0].label}
                                        odds={mainMarket.outcomes[0].best_odd}
                                        brandName={mainMarket.outcomes[0].brand_name}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
