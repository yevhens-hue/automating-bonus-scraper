'use client';
import React, { useState, useMemo } from 'react';
import type { Bonus } from '@/lib/bonuses';

const GEO_FLAGS: Record<string, string> = {
    IN: '🇮🇳',
    TR: '🇹🇷',
    BR: '🇧🇷',
    ALL: '🌍',
};

type SortField = 'scraped_at' | 'id' | 'brand_name' | 'rating' | 'bonus_amount';
type SortOrder = 'asc' | 'desc';

export default function DetailedBonusTable({ bonuses, title }: { bonuses: Bonus[]; title: string }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGeo, setFilterGeo] = useState<string>('all');
    const [filterType, setFilterType] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [sortField, setSortField] = useState<SortField>('scraped_at');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    // Extract unique values for filters
    const availableGeos = useMemo(() => Array.from(new Set(bonuses.map(b => b.geo))).sort(), [bonuses]);
    const availableTypes = useMemo(() => Array.from(new Set(bonuses.map(b => b.type))).sort(), [bonuses]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const filteredAndSortedBonuses = useMemo(() => {
        return bonuses
            .filter(b => {
                const searchLower = searchTerm.toLowerCase();
                const matchesSearch =
                    b.brand_name.toLowerCase().includes(searchLower) ||
                    b.bonus_title.toLowerCase().includes(searchLower) ||
                    b.bonus_amount.toLowerCase().includes(searchLower) ||
                    (b.extra_data && b.extra_data.toLowerCase().includes(searchLower));

                const matchesGeo = filterGeo === 'all' || b.geo === filterGeo;
                const matchesType = filterType === 'all' || b.type === filterType;
                const matchesStatus = filterStatus === 'all' ||
                    (filterStatus === 'live' ? b.is_active !== 0 : b.is_active === 0);

                return matchesSearch && matchesGeo && matchesType && matchesStatus;
            })
            .sort((a, b) => {
                let comparison = 0;
                if (sortField === 'scraped_at') {
                    comparison = new Date(a.scraped_at).getTime() - new Date(b.scraped_at).getTime();
                } else if (sortField === 'rating') {
                    comparison = (a.rating || 0) - (b.rating || 0);
                } else if (sortField === 'id') {
                    comparison = a.id - b.id;
                } else if (sortField === 'bonus_amount') {
                    comparison = a.bonus_amount.localeCompare(b.bonus_amount);
                } else {
                    comparison = String(a[sortField]).localeCompare(String(b[sortField]));
                }
                return sortOrder === 'asc' ? comparison : -comparison;
            });
    }, [bonuses, searchTerm, filterGeo, filterType, filterStatus, sortField, sortOrder]);

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <span className="ml-1 opacity-20 group-hover:opacity-100 transition-opacity">⇅</span>;
        return <span className="ml-1 text-purple-400">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
    };

    return (
        <div className="w-full">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8">
                <div className="flex-1">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-2">
                        {title} <span className="text-purple-500">Database</span>
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-none">
                            {filteredAndSortedBonuses.length} of {bonuses.length} Records Shown
                        </span>
                    </div>
                </div>

                {/* Controls Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white/[0.03] p-4 rounded-2xl border border-white/5 backdrop-blur-3xl w-full xl:w-auto">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-gray-600 tracking-tighter ml-1">Search</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Find Brand or Offer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs">✕</button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-gray-600 tracking-tighter ml-1">Market (GEO)</label>
                        <select
                            value={filterGeo}
                            onChange={(e) => setFilterGeo(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400 transition-colors cursor-pointer appearance-none"
                        >
                            <option value="all">All Markets</option>
                            {availableGeos.map(geo => (
                                <option key={geo} value={geo}>{GEO_FLAGS[geo] || '🏳️'} {geo}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-gray-600 tracking-tighter ml-1">Bonus Type</label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400 transition-colors cursor-pointer appearance-none"
                        >
                            <option value="all">All Types</option>
                            {availableTypes.map(type => (
                                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-gray-600 tracking-tighter ml-1">Live Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-green-400 transition-colors cursor-pointer appearance-none"
                        >
                            <option value="all">Any Status</option>
                            <option value="live">🟢 Live Only</option>
                            <option value="hidden">🔴 Hidden Only</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="relative border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02] backdrop-blur-3xl shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1200px]">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/[0.05]">
                                <th onClick={() => handleSort('scraped_at')} className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500 cursor-pointer hover:text-white transition-colors group">
                                    Scraped At <SortIcon field="scraped_at" />
                                </th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                                <th onClick={() => handleSort('id')} className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500 cursor-pointer hover:text-white transition-colors text-center w-20 group">
                                    ID <SortIcon field="id" />
                                </th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500">GEO</th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Type</th>
                                <th onClick={() => handleSort('brand_name')} className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500 cursor-pointer hover:text-white transition-colors group">
                                    Brand <SortIcon field="brand_name" />
                                </th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Bonus Title</th>
                                <th onClick={() => handleSort('bonus_amount')} className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500 cursor-pointer hover:text-white transition-colors group">
                                    Amount <SortIcon field="bonus_amount" />
                                </th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Wager</th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Providers</th>
                                <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Link</th>
                                <th onClick={() => handleSort('rating')} className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center cursor-pointer hover:text-white transition-colors group">
                                    Rating <SortIcon field="rating" />
                                </th>
                                <th className="py-4 px-4 pr-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Extra Data</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredAndSortedBonuses.length > 0 ? (
                                filteredAndSortedBonuses.map((bonus, index) => (
                                    <tr key={`${bonus.brand_id}-${bonus.id}-${index}`} className="hover:bg-white/[0.03] transition-colors group">
                                        <td className="py-4 px-4 text-[11px] text-gray-500 whitespace-nowrap">
                                            {bonus.scraped_at ? new Date(bonus.scraped_at).toLocaleDateString() : 'N/A'} <br />
                                            <span className="opacity-50">{bonus.scraped_at ? new Date(bonus.scraped_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                        </td>
                                        <td className="py-4 px-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase ${bonus.is_active !== 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {bonus.is_active !== 0 ? 'Live' : 'Hidden'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-[11px] font-mono text-gray-600 text-center">#{bonus.id}</td>
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
                                                <div className="w-6 h-6 rounded bg-white/10 p-1 flex items-center justify-center overflow-hidden border border-white/5 shadow-inner">
                                                    <img src={bonus.logo_url} alt="" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = '/logos/default.png'; }} />
                                                </div>
                                                <span className="text-white font-bold text-xs group-hover:text-purple-400 transition-colors uppercase tracking-tight">{bonus.brand_name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-[11px] font-semibold text-purple-400 max-w-[150px] truncate" title={bonus.bonus_title}>
                                            {bonus.bonus_title}
                                        </td>
                                        <td className="py-4 px-4 text-xs font-black text-white whitespace-nowrap">{bonus.bonus_amount}</td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border border-white/5 ${bonus.wagering === 'N/A' || bonus.wagering === '0x' ? 'bg-green-500/10 text-green-400 font-bold' : 'bg-white/5 text-gray-400'}`}>
                                                {bonus.wagering || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-[9px] text-gray-500 uppercase tracking-tighter max-w-[100px] truncate">
                                            {bonus.featured_providers || '-'}
                                        </td>
                                        <td className="py-4 px-4">
                                            <a href={bonus.affiliate_url} target="_blank" rel="nofollow sponsored" className="text-[10px] text-blue-400 hover:text-white hover:underline truncate block max-w-[100px] transition-colors">
                                                {bonus.affiliate_url}
                                            </a>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="flex items-center gap-0.5 text-yellow-500 text-[10px]">
                                                    {Math.round(bonus.rating || 0)} <span className="text-yellow-600">★</span>
                                                </div>
                                                <span className="text-[9px] text-gray-600 font-bold">{(bonus.rating || 0).toFixed(1)}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 pr-6 text-[10px] text-gray-600 italic max-w-[200px] truncate font-mono" title={bonus.extra_data}>
                                            {bonus.extra_data || '-'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={13} className="py-32 text-center text-gray-500">
                                        <div className="text-4xl mb-4 opacity-20">🔎</div>
                                        <p className="font-bold text-gray-400">No records match your search criteria.</p>
                                        <button onClick={() => { setSearchTerm(''); setFilterGeo('all'); setFilterType('all'); setFilterStatus('all'); }} className="mt-4 text-purple-500 text-xs font-black uppercase tracking-widest hover:underline">Clear all filters</button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
