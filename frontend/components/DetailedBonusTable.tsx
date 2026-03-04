'use client';
import React from 'react';
import type { Bonus } from '@/lib/bonuses';

const GEO_FLAGS: Record<string, string> = {
    IN: '🇮🇳',
    TR: '🇹🇷',
    BR: '🇧🇷',
    ALL: '🌍',
};

export default function DetailedBonusTable({ bonuses, title }: { bonuses: Bonus[]; title: string }) {
    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                    {title} <span className="text-purple-500">Database</span>
                </h2>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{bonuses.length} Records Found</span>
                </div>
            </div>

            <div className="relative border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02] backdrop-blur-3xl shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1200px]">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/[0.05]">
                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Scraped At</th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500">ID</th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500">GEO</th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Type</th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Brand</th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Bonus Title</th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Amount</th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Wager</th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Providers</th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Affiliate Link</th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Rating</th>
                                <th className="py-4 px-4 pr-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Extra Data</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {bonuses.length > 0 ? (
                                bonuses.map((bonus, index) => (
                                    <tr key={`${bonus.brand_id}-${bonus.id}-${index}`} className="hover:bg-white/[0.03] transition-colors group">
                                        <td className="py-4 px-4 text-[11px] text-gray-500 whitespace-nowrap">
                                            {new Date(bonus.scraped_at).toLocaleDateString()} <br />
                                            <span className="opacity-50">{new Date(bonus.scraped_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase ${bonus.is_active !== 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {bonus.is_active !== 0 ? 'Live' : 'Hidden'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-[11px] font-mono text-gray-600">#{bonus.id}</td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <span className="text-sm mr-1">{GEO_FLAGS[bonus.geo] || '🏳️'}</span>
                                            <span className="text-[11px] font-bold text-gray-400">{bonus.geo}</span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`text-[10px] font-bold uppercase tracking-tighter ${bonus.type === 'casino' ? 'text-blue-400' : 'text-orange-400'}`}>
                                                {bonus.type}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded bg-white/10 p-1 flex items-center justify-center overflow-hidden">
                                                    <img src={bonus.logo_url} alt="" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = '/logos/default.png'; }} />
                                                </div>
                                                <span className="text-white font-bold text-xs">{bonus.brand_name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-[11px] font-semibold text-purple-400 max-w-[150px] truncate" title={bonus.bonus_title}>
                                            {bonus.bonus_title}
                                        </td>
                                        <td className="py-4 px-4 text-xs font-black text-white whitespace-nowrap">{bonus.bonus_amount}</td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border border-white/5 ${bonus.wagering === 'N/A' || bonus.wagering === '0x' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-gray-400'}`}>
                                                {bonus.wagering || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-[9px] text-gray-500 uppercase tracking-tighter max-w-[100px] truncate">
                                            {bonus.featured_providers || '-'}
                                        </td>
                                        <td className="py-4 px-4">
                                            <a href={bonus.affiliate_url} target="_blank" rel="nofollow sponsored" className="text-[10px] text-blue-400 hover:underline truncate block max-w-[120px]">
                                                {bonus.affiliate_url}
                                            </a>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <div className="flex items-center justify-center gap-0.5 text-yellow-500 text-[10px]">
                                                {Math.round(bonus.rating || 0)} <span className="text-yellow-600">★</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 pr-6 text-[10px] text-gray-600 italic max-w-[200px] truncate" title={bonus.extra_data}>
                                            {bonus.extra_data || '-'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={13} className="py-20 text-center text-gray-500 italic">No data archived yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
