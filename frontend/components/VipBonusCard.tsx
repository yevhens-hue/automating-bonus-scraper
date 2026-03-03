'use client';
import type { Bonus } from '@/lib/bonuses';

export default function VipBonusCard({ bonus, rank }: { bonus: Bonus; rank?: number }) {
    const isExpired = bonus.is_expired;
    const isNew = bonus.is_new;

    let parsedTiers: string[] | null = null;
    let eventDetails: string | null = null;

    // Try to parse the extra_data JSON securely
    if (bonus.extra_data) {
        try {
            const data = JSON.parse(bonus.extra_data);
            if (data.tiers && Array.isArray(data.tiers)) {
                parsedTiers = data.tiers;
            }
            if (data.event) {
                eventDetails = `${data.event} (Ends: ${data.deadline || 'Soon'})`;
            }
        } catch (e) {
            // Not a valid JSON, or simple string
            eventDetails = bonus.extra_data;
        }
    }

    return (
        <div className={`group relative bg-white/5 hover:bg-white/10 border border-white/10 ${isExpired ? 'opacity-60 grayscale-[0.5]' : 'hover:border-yellow-500/50'} rounded-3xl p-5 md:p-6 transition-all duration-300 ${!isExpired && 'hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-900/40 relative overflow-hidden'}`}>

            {/* VIP Premium Background Effects */}
            {!isExpired && (
                <>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -z-10 group-hover:bg-yellow-400/10 transition-colors" />
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-yellow-600 via-amber-300 to-yellow-600 opacity-50" />
                </>
            )}

            {/* Header section */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-amber-500/20 p-2 flex items-center justify-center flex-shrink-0 shadow-inner">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={bonus.logo_url}
                            alt={bonus.brand_name}
                            className="w-full h-full object-contain drop-shadow-md"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/logos/default.png'; }}
                        />
                    </div>
                    <div>
                        <h3 className="text-white font-black text-lg tracking-tight flex items-center gap-2">
                            {bonus.brand_name}
                            {isNew && <span className="bg-amber-500 text-black text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider">New</span>}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-sm ${i < Math.round(bonus.rating) ? 'text-yellow-400 drop-shadow-[0_0_2px_rgba(250,204,21,0.5)]' : 'text-gray-700'}`}>★</span>
                            ))}
                        </div>
                    </div>
                </div>
                {rank && rank <= 3 && !isExpired && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 text-yellow-900 flex items-center justify-center font-black shadow-lg shadow-yellow-500/20">
                        #{rank}
                    </div>
                )}
            </div>

            {/* Highlight Box */}
            <div className={`bg-gradient-to-br ${isExpired ? 'from-gray-800 to-gray-900' : 'from-yellow-900/30 to-amber-900/10'} border ${isExpired ? 'border-white/5' : 'border-yellow-500/20'} rounded-2xl text-center p-5 mb-6`}>
                <div className={`text-xs ${isExpired ? 'text-gray-500' : 'text-amber-400'} font-bold uppercase tracking-widest mb-2 flex justify-center items-center gap-2`}>
                    <span className="w-4 h-px bg-amber-500/50" />
                    {bonus.bonus_title}
                    <span className="w-4 h-px bg-amber-500/50" />
                </div>
                <div className="text-2xl font-black text-white text-balance">{bonus.bonus_amount}</div>
                {eventDetails && (
                    <div className="mt-2 text-xs font-semibold text-orange-300 bg-orange-500/10 inline-block px-3 py-1 rounded-full border border-orange-500/20">
                        ⚡ {eventDetails}
                    </div>
                )}
            </div>

            {/* VIP Tiers Display */}
            {parsedTiers && parsedTiers.length > 0 && (
                <div className="mb-6 space-y-2">
                    <h4 className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3">💎 Exclusive Loyalty Perks</h4>
                    <ul className="space-y-2">
                        {parsedTiers.slice(0, 4).map((tier, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-300 bg-white/5 rounded-lg p-2 border border-white/5">
                                <span className={`flex-shrink-0 mt-0.5 ${idx === 0 ? 'text-amber-700' :
                                        idx === 1 ? 'text-gray-300' :
                                            idx === 2 ? 'text-yellow-400' :
                                                'text-blue-300'
                                    }`}>◆</span>
                                <span className="leading-snug">{tier}</span>
                            </li>
                        ))}
                        {parsedTiers.length > 4 && (
                            <li className="text-xs text-amber-500/70 text-center italic mt-1">+ specific higher roller tiers available</li>
                        )}
                    </ul>
                </div>
            )}

            {/* CTA */}
            {isExpired ? (
                <div className="w-full text-center bg-gray-800 text-gray-500 font-bold py-4 rounded-xl cursor-not-allowed">
                    Program Closed
                </div>
            ) : (
                <a
                    href={bonus.affiliate_url}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="block w-full text-center bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-500 hover:from-yellow-400 hover:to-amber-300 text-yellow-950 font-black tracking-wide py-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(250,204,21,0.3)]"
                >
                    JOIN VIP CLUB NOW
                </a>
            )}
        </div>
    );
}
