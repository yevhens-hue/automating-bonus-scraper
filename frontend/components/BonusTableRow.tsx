'use client';
import React from 'react';
import type { Bonus } from '@/lib/bonuses';

const BONUS_TYPE_LABELS: Record<string, string> = {
    welcome: '🎁 Welcome',
    reload: '🔁 Reload',
    cashback: '💸 Cashback',
    free_spins: '🎡 Free Spins',
    sports: '🏆 Sports',
    vip: '👑 VIP',
    other: '🎯 Special',
};

export default function BonusTableRow({ bonus, rank }: { bonus: Bonus; rank: number }) {
    const isNew = bonus.is_new;
    const isHot = bonus.rating >= 4.7;
    const isBest = rank <= 3;

    return (
        <tr className="group border-b border-white/5 hover:bg-white/[0.03] transition-colors">
            <td className="py-4 pl-4 text-center">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${isBest ? 'bg-gradient-to-br from-yellow-500 to-amber-600 text-white shadow-lg shadow-yellow-900/20' : 'bg-white/10 text-gray-400'
                    }`}>
                    {rank}
                </span>
            </td>
            <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/5 group-hover:border-purple-500/30 transition-colors">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={bonus.logo_url}
                            alt={bonus.brand_name}
                            className="w-7 h-7 object-contain"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/logos/default.png'; }}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-white font-bold group-hover:text-purple-400 transition-colors">{bonus.brand_name}</span>
                            {isNew && (
                                <span className="bg-green-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded leading-none">NEW</span>
                            )}
                            {isHot && (
                                <span className="bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded leading-none">HOT 🔥</span>
                            )}
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{bonus.geo} Market</div>
                    </div>
                </div>
            </td>
            <td className="py-4 px-4">
                <div>
                    <div className="text-purple-400 text-xs font-semibold mb-0.5">{bonus.bonus_title}</div>
                    <div className="text-white font-black text-lg leading-tight uppercase tracking-tight">{bonus.bonus_amount}</div>
                    <div className="text-[10px] text-gray-500 mt-1">
                        Wager: <span className={bonus.wagering === 'N/A' || bonus.wagering === '0x' ? 'text-green-400' : 'text-gray-400'}>{bonus.wagering || 'N/A'}</span>
                    </div>
                </div>
            </td>
            <td className="py-4 px-4 hidden md:table-cell">
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-sm ${i < Math.round(bonus.rating) ? 'text-yellow-400' : 'text-gray-700'}`}>★</span>
                        ))}
                    </div>
                    <span className="text-gray-400 font-bold text-xs mt-1">{bonus.rating.toFixed(1)}</span>
                </div>
            </td>
            <td className="py-4 px-4 pr-4 text-right">
                <a
                    href={bonus.affiliate_url}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="inline-flex items-center justify-center bg-white text-black hover:bg-purple-500 hover:text-white font-black px-6 py-2.5 rounded-xl transition-all text-xs uppercase tracking-tighter whitespace-nowrap active:scale-95"
                >
                    Claim Now →
                </a>
            </td>
        </tr>
    );
}
