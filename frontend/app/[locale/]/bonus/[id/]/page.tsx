import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import bonusesData from '@/data/bonuses.json';
import { Bonus } from '@/lib/bonuses';
import { Link } from '@/i18n/routing';
import { GEO_FLAGS, GEO_NAMES } from '@/lib/geo';

interface PageProps {
    params: Promise<{
        locale: string;
        id: string;
    }>;
}

const BONUS_TYPE_LABELS: Record<string, string> = {
    welcome: '🎁 Welcome Bonus',
    reload: '🔁 Reload Bonus',
    cashback: '💸 Cashback Offer',
    free_spins: '🎡 Free Spins',
    sports: '🏆 Sports Betting',
    vip: '👑 VIP Rewards',
    other: '🎯 Special Offer',
};

export default async function BonusPage({ params }: PageProps) {
    const { id } = await params;
    
    const bonus = (bonusesData.bonuses as unknown as Bonus[]).find(
        (b) => b.id.toString() === id
    );

    if (!bonus) {
        notFound();
    }

    const rating = bonus.rating || 0;
    const isNoWager = bonus.wagering === 'N/A' || bonus.wagering === '0x';

    return (
        <div className="min-h-screen bg-[#0a0d1a] py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 mb-12">
                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/all-bonuses" className="hover:text-white transition-colors">Bonuses</Link>
                    <span>/</span>
                    <span className="text-blue-400">{bonus.brand_name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Sidebar / Logo */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32">
                            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 aspect-square flex items-center justify-center mb-8 backdrop-blur-xl group overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <Image
                                    src={bonus.logo_url || '/logos/default.png'}
                                    alt={bonus.brand_name}
                                    width={160}
                                    height={160}
                                    className="w-40 h-40 object-contain relative z-10 transition-transform duration-500 group-hover:scale-110"
                                    unoptimized
                                    onError={(e) => { (e.target as HTMLImageElement).src = '/logos/default.png'; }}
                                />
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                                <div className="text-center mb-6">
                                    <div className="text-4xl font-black text-white mb-2">{rating.toFixed(1)}</div>
                                    <div className="flex justify-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`text-xl ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-700'}`}>★</span>
                                        ))}
                                    </div>
                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Expert Trust Score</div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-white/5">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500 font-bold uppercase tracking-wider">Region</span>
                                        <span className="text-white flex items-center gap-2">
                                            {GEO_FLAGS[bonus.geo] || '🌐'} {GEO_NAMES[bonus.geo]}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500 font-bold uppercase tracking-wider">Verified</span>
                                        <span className="text-green-400 font-bold">2026 Updated</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <header className="mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                                {BONUS_TYPE_LABELS[bonus.bonus_type] || '🎯 Special Bonus'}
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tighter leading-tight uppercase">
                                {bonus.brand_name} <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                                    {bonus.bonus_title}
                                </span>
                            </h1>
                            <div className="text-3xl md:text-4xl font-black text-white tracking-tight">
                                {bonus.bonus_amount}
                            </div>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Wagering Required</div>
                                <div className={`text-2xl font-black ${isNoWager ? 'text-green-400' : 'text-white'}`}>
                                    {bonus.wagering || 'N/A'}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    {isNoWager ? 'Zero wagering means you keep what you win instantly.' : 'Standard wagering calculated on bonus amount.'}
                                </p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Platform Category</div>
                                <div className="text-2xl font-black text-white uppercase italic">
                                    {bonus.type}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Optimized experience for {bonus.type === 'betting' ? 'sports betting enthusiasts' : 'premium casino players'}.
                                </p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/10 rounded-[2.5rem] p-8 mb-12">
                            <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-sm">ⓘ</span>
                                Important Terms
                            </h3>
                            <p className="text-gray-400 leading-relaxed mb-8">
                                {bonus.conditions || "Full terms and conditions are available on the brand's official website. Generally includes age verification (18+), geographic restrictions, and one bonus per household policy."}
                            </p>
                            
                            {bonus.featured_providers && (
                                <div className="mb-8">
                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Supported Providers</div>
                                    <div className="flex flex-wrap gap-3">
                                        {bonus.featured_providers.split(',').map(p => (
                                            <span key={p} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-gray-300">
                                                {p.trim()}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <a
                                href={bonus.affiliate_url}
                                target="_blank"
                                rel="nofollow sponsored noopener noreferrer"
                                className="inline-flex w-full items-center justify-center gap-4 bg-white text-black font-black py-6 px-10 rounded-2xl hover:bg-gray-100 transition-all transform hover:scale-[1.02] active:scale-95 shadow-2xl shadow-white/5 text-lg uppercase tracking-widest"
                            >
                                Claim Offer Now
                                <span className="text-2xl">→</span>
                            </a>
                            <p className="text-[10px] text-gray-600 text-center mt-6 uppercase font-bold tracking-widest">
                                18+ | Responsible Gaming Only | T&Cs Apply
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="border-l-2 border-green-500/30 pl-6">
                                <h4 className="text-white font-black uppercase text-sm mb-3 tracking-tighter">Why we like it</h4>
                                <ul className="text-gray-500 text-xs space-y-3">
                                    <li className="flex gap-2">
                                        <span className="text-green-500 font-bold">✓</span>
                                        Verified and active in {GEO_NAMES[bonus.geo]} market.
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-green-500 font-bold">✓</span>
                                        Transparent wagering policies: {bonus.wagering}.
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-green-500 font-bold">✓</span>
                                        Top-tier user interface and payout speeds.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
