'use client';
import React from 'react';
import { BookmakerOdd } from '@/lib/odds';

interface BookmakerTableProps {
    bookmakers: BookmakerOdd[];
    teamHome: string;
    teamAway: string;
}

export default function BookmakerTable({ bookmakers, teamHome, teamAway }: BookmakerTableProps) {
    if (!bookmakers || bookmakers.length === 0) return null;

    // Helper to format probabilities
    const formatProb = (prob?: number) => {
        if (!prob) return '-';
        return ((1 / prob) * 100).toFixed(1) + '%';
    };

    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm text-gray-300">
                <thead className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest bg-white/5 border-b border-white/10">
                    <tr>
                        <th scope="col" className="px-4 py-4 font-black rounded-tl-xl text-white">Bookmaker</th>
                        <th scope="col" className="px-4 py-4 font-black text-center">
                            1 <br /> <span className="text-[8px] text-gray-600 truncate max-w-[80px] hidden sm:block">{teamHome}</span>
                        </th>
                        <th scope="col" className="px-4 py-4 font-black text-center text-gray-600">
                            X <br /> <span className="text-[8px] hidden sm:block">Draw</span>
                        </th>
                        <th scope="col" className="px-4 py-4 font-black text-center">
                            2 <br /> <span className="text-[8px] text-gray-600 truncate max-w-[80px] hidden sm:block">{teamAway}</span>
                        </th>
                        <th scope="col" className="px-4 py-4 font-black text-center hidden md:table-cell text-[#ffe100]/70">
                            Margin
                        </th>
                        <th scope="col" className="px-4 py-4 rounded-tr-xl"></th>
                    </tr>
                </thead>
                <tbody>
                    {bookmakers.map((bm, index) => {
                        const hasDraw = bm.odds["X"] !== undefined;
                        const margin = bm.implied_probability ? ((bm.implied_probability - 1) * 100).toFixed(1) : '-';

                        return (
                            <tr
                                key={index}
                                className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group"
                            >
                                <td className="px-4 py-4 font-bold text-white text-xs sm:text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ffe100] to-orange-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                        {bm.brand_name}
                                    </div>
                                </td>

                                <td className="px-4 py-4 text-center">
                                    <span className="bg-black/40 border border-white/10 group-hover:border-white/30 px-3 py-1.5 rounded-lg font-black text-white block transition-colors">
                                        {bm.odds["1"] ? bm.odds["1"].toFixed(2) : '-'}
                                    </span>
                                </td>

                                <td className="px-4 py-4 text-center">
                                    <span className={`bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg font-black block ${hasDraw ? 'text-gray-400 group-hover:border-white/30 transition-colors' : 'text-gray-800'}`}>
                                        {hasDraw ? bm.odds["X"].toFixed(2) : '-'}
                                    </span>
                                </td>

                                <td className="px-4 py-4 text-center">
                                    <span className="bg-black/40 border border-white/10 group-hover:border-white/30 px-3 py-1.5 rounded-lg font-black text-white block transition-colors">
                                        {bm.odds["2"] ? bm.odds["2"].toFixed(2) : '-'}
                                    </span>
                                </td>

                                <td className="px-4 py-4 text-center hidden md:table-cell">
                                    <span className="text-[11px] font-bold text-[#ffe100]/80 bg-[#ffe100]/5 px-2 py-1 rounded">
                                        {margin}%
                                    </span>
                                </td>

                                <td className="px-4 py-4 text-right">
                                    <a
                                        href={bm.affiliate_url}
                                        target="_blank"
                                        rel="nofollow sponsored noopener noreferrer"
                                        className="inline-flex items-center justify-center bg-[#ffe100] hover:bg-yellow-400 text-black font-black text-[10px] sm:text-xs px-4 py-2 rounded-full uppercase tracking-wider transition-transform hover:scale-105 shadow-[0_0_15px_rgba(255,225,0,0.3)]"
                                    >
                                        Bet Now
                                    </a>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
