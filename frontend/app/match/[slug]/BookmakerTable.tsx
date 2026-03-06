'use client';
import React, { useState, useMemo } from 'react';
import { BookmakerOdd } from '@/lib/odds';

interface BookmakerTableProps {
    bookmakers: BookmakerOdd[];
    teamHome: string;
    teamAway: string;
}

type SortField = 'brand_name' | '1' | 'X' | '2' | 'margin';
type SortDirection = 'asc' | 'desc';

export default function BookmakerTable({ bookmakers, teamHome, teamAway }: BookmakerTableProps) {
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState<SortField>('margin');
    const [sortDir, setSortDir] = useState<SortDirection>('asc');

    if (!bookmakers || bookmakers.length === 0) return null;

    // Calculate maximum odds to highlight them
    const max1 = Math.max(...bookmakers.map(b => b.odds["1"] || 0));
    const maxX = Math.max(...bookmakers.map(b => b.odds["X"] || 0));
    const max2 = Math.max(...bookmakers.map(b => b.odds["2"] || 0));

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('desc'); // Default to descending for odds/margin initially makes sense, but we handle it generally
        }
    };

    const sortedAndFiltered = useMemo(() => {
        let result = [...bookmakers];

        // Filter
        if (search.trim()) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(bm => bm.brand_name.toLowerCase().includes(lowerSearch));
        }

        // Sort
        result.sort((a, b) => {
            let valA: number | string = 0;
            let valB: number | string = 0;

            if (sortField === 'brand_name') {
                valA = a.brand_name.toLowerCase();
                valB = b.brand_name.toLowerCase();
            } else if (sortField === 'margin') {
                valA = a.implied_probability || 999;
                valB = b.implied_probability || 999;
            } else {
                valA = a.odds[sortField] || 0;
                valB = b.odds[sortField] || 0;
            }

            if (valA < valB) return sortDir === 'asc' ? -1 : 1;
            if (valA > valB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [bookmakers, search, sortField, sortDir]);

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <span className="opacity-20 ml-1 text-[8px]">↕</span>;
        return <span className="text-[#ffe100] ml-1 text-[8px]">{sortDir === 'asc' ? '▲' : '▼'}</span>;
    };

    return (
        <div className="w-full">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <div className="relative w-full sm:w-64 relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                    <input
                        type="text"
                        placeholder="Search bookmaker..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-[#ffe100]/50 transition-colors"
                    />
                </div>
                <div className="text-xs text-gray-500 font-bold">
                    Found {sortedAndFiltered.length} bookmakers
                </div>
            </div>

            <div className="overflow-x-auto w-full bg-black/20 rounded-xl border border-white/5">
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest bg-white/5 border-b border-white/10">
                        <tr>
                            <th scope="col" className="px-4 py-4 font-black rounded-tl-xl text-white cursor-pointer hover:bg-white/5 transition-colors" onClick={() => handleSort('brand_name')}>
                                Bookmaker <SortIcon field="brand_name" />
                            </th>
                            <th scope="col" className="px-4 py-4 font-black text-center cursor-pointer hover:bg-white/5 transition-colors" onClick={() => handleSort('1')}>
                                1 <SortIcon field="1" />
                                <br /> <span className="text-[8px] text-gray-600 truncate max-w-[80px] hidden sm:block">{teamHome}</span>
                            </th>
                            <th scope="col" className="px-4 py-4 font-black text-center text-gray-600 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => handleSort('X')}>
                                X <SortIcon field="X" />
                                <br /> <span className="text-[8px] hidden sm:block">Draw</span>
                            </th>
                            <th scope="col" className="px-4 py-4 font-black text-center cursor-pointer hover:bg-white/5 transition-colors" onClick={() => handleSort('2')}>
                                2 <SortIcon field="2" />
                                <br /> <span className="text-[8px] text-gray-600 truncate max-w-[80px] hidden sm:block">{teamAway}</span>
                            </th>
                            <th scope="col" className="px-4 py-4 font-black text-center hidden md:table-cell text-[#ffe100]/70 cursor-pointer hover:bg-white/5 transition-colors group/header" onClick={() => handleSort('margin')}>
                                <div className="relative inline-block cursor-help">
                                    Margin <SortIcon field="margin" />
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 border border-white/10 rounded text-[9px] text-gray-300 hidden group-hover/header:block normal-case tracking-normal z-50 text-center shadow-xl">
                                        The bookmaker's built-in profit margin. Lower is generally better for players.
                                    </div>
                                </div>
                            </th>
                            <th scope="col" className="px-4 py-4 rounded-tr-xl"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAndFiltered.map((bm, index) => {
                            const hasDraw = bm.odds["X"] !== undefined;
                            const margin = bm.implied_probability ? ((bm.implied_probability - 1) * 100).toFixed(1) : '-';

                            const isMax1 = bm.odds["1"] === max1 && max1 > 0;
                            const isMaxX = hasDraw && bm.odds["X"] === maxX && maxX > 0;
                            const isMax2 = bm.odds["2"] === max2 && max2 > 0;

                            return (
                                <tr
                                    key={index}
                                    className="border-b border-white/5 hover:bg-white/[0.05] transition-colors group"
                                >
                                    <td className="px-4 py-4 font-bold text-white text-xs sm:text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#ffe100] to-orange-500 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                            {bm.brand_name}
                                        </div>
                                    </td>

                                    <td className="px-4 py-4 text-center">
                                        <div className="relative inline-block group/cell cursor-default">
                                            <span className={`block px-3 py-1.5 rounded-lg font-black transition-all border ${isMax1 ? 'bg-[#ffe100]/10 text-[#ffe100] border-[#ffe100]/50 shadow-[0_0_10px_rgba(255,225,0,0.1)]' : 'bg-black/40 border-white/10 text-white group-hover:border-white/30'}`}>
                                                {bm.odds["1"] ? bm.odds["1"].toFixed(2) : '-'}
                                            </span>
                                            {isMax1 && (
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max p-1.5 px-3 bg-[#ffe100] text-black font-bold rounded-md text-[10px] hidden group-hover/cell:block z-50 shadow-xl whitespace-nowrap animate-in fade-in slide-in-from-bottom-1">
                                                    🔥 Highest Market Odds
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-4 py-4 text-center">
                                        <div className="relative inline-block group/cell cursor-default">
                                            <span className={`block px-3 py-1.5 rounded-lg font-black transition-all border ${isMaxX && hasDraw ? 'bg-[#00ff88]/10 text-[#00ff88] border-[#00ff88]/50 shadow-[0_0_10px_rgba(0,255,136,0.1)]' : (hasDraw ? 'bg-black/40 border-white/10 text-gray-400 group-hover:border-white/30' : 'bg-black/40 border-white/10 text-gray-800')}`}>
                                                {hasDraw ? bm.odds["X"].toFixed(2) : '-'}
                                            </span>
                                            {isMaxX && hasDraw && (
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max p-1.5 px-3 bg-[#00ff88] text-black font-bold rounded-md text-[10px] hidden group-hover/cell:block z-50 shadow-xl whitespace-nowrap animate-in fade-in slide-in-from-bottom-1">
                                                    🔥 Highest Market Odds
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-4 py-4 text-center">
                                        <div className="relative inline-block group/cell cursor-default">
                                            <span className={`block px-3 py-1.5 rounded-lg font-black transition-all border ${isMax2 ? 'bg-[#ffe100]/10 text-[#ffe100] border-[#ffe100]/50 shadow-[0_0_10px_rgba(255,225,0,0.1)]' : 'bg-black/40 border-white/10 text-white group-hover:border-white/30'}`}>
                                                {bm.odds["2"] ? bm.odds["2"].toFixed(2) : '-'}
                                            </span>
                                            {isMax2 && (
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max p-1.5 px-3 bg-[#ffe100] text-black font-bold rounded-md text-[10px] hidden group-hover/cell:block z-50 shadow-xl whitespace-nowrap animate-in fade-in slide-in-from-bottom-1">
                                                    🔥 Highest Market Odds
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-4 py-4 text-center hidden md:table-cell">
                                        <span className={`text-[11px] font-bold px-2 py-1 rounded transition-colors ${sortField === 'margin' ? 'bg-[#ffe100]/20 text-[#ffe100]' : 'bg-[#ffe100]/5 text-[#ffe100]/80 group-hover:bg-[#ffe100]/10'}`}>
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
                {sortedAndFiltered.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        No bookmakers found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
}
