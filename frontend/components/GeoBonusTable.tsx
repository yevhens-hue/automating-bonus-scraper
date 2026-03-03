'use client';
import React from 'react';
import type { Bonus } from '@/lib/bonuses';

export default function GeoBonusTable({ geo, geoName, bonuses }: { geo: string; geoName: string; bonuses: Bonus[] }) {
    if (bonuses.length === 0) return null;

    return (
        <section className="mb-16">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-lg shadow-lg">
                        {geo}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                        {geoName} Bonuses
                    </h2>
                </div>
                <span className="hidden sm:inline-flex px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-gray-400">
                    {bonuses.length} Active Offers
                </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/[0.05] border-b border-white/10">
                            <th className="py-4 pl-6 text-[10px] font-black uppercase tracking-widest text-gray-400 w-16">Brand</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Title</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hidden sm:table-cell">Amount</th>
                            <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-400 hidden md:table-cell">Wagering</th>
                            <th className="py-4 pr-6 pl-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {bonuses.map((bonus) => (
                            <tr key={`${bonus.brand_id}-${bonus.id}`} className="hover:bg-white/[0.03] transition-colors group">
                                <td className="py-4 pl-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={bonus.logo_url}
                                                alt={bonus.brand_name}
                                                className="w-5 h-5 object-contain"
                                                onError={(e) => { (e.target as HTMLImageElement).src = '/logos/default.png'; }}
                                            />
                                        </div>
                                        <span className="text-white font-bold text-sm hidden sm:block whitespace-nowrap">{bonus.brand_name}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="text-purple-400 font-semibold text-xs sm:text-sm">{bonus.bonus_title}</div>
                                    <div className="text-white font-bold text-sm sm:hidden mt-0.5">{bonus.bonus_amount}</div>
                                </td>
                                <td className="py-4 px-4 hidden sm:table-cell">
                                    <div className="text-white font-bold whitespace-nowrap">{bonus.bonus_amount}</div>
                                </td>
                                <td className="py-4 px-4 hidden md:table-cell">
                                    <span className={`text-xs px-2 py-1 rounded bg-white/5 ${bonus.wagering === 'N/A' || bonus.wagering === '0x' ? 'text-green-400' : 'text-gray-300'}`}>
                                        {bonus.wagering || 'N/A'}
                                    </span>
                                </td>
                                <td className="py-4 pr-6 pl-4 text-right">
                                    <a
                                        href={bonus.affiliate_url}
                                        target="_blank"
                                        rel="nofollow sponsored noopener noreferrer"
                                        className="inline-flex px-4 py-2 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap"
                                    >
                                        Visit
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
