'use client';
import React, { useState } from 'react';

interface ProfitCalculatorProps {
    outcomeLabel: string;
    odds: number;
    brandName: string;
    onClose: () => void;
}

export default function ProfitCalculator({ outcomeLabel, odds, brandName, onClose }: ProfitCalculatorProps) {
    const [stake, setStake] = useState<string>('100');

    const handleStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        // Only allow numbers and one decimal point
        val = val.replace(/[^0-9.]/g, '');
        const parts = val.split('.');
        if (parts.length > 2) val = parts[0] + '.' + parts[1];
        setStake(val);
    };

    const numStake = parseFloat(stake) || 0;
    const totalReturn = numStake * odds;
    const profit = totalReturn - numStake;

    return (
        <div className="bg-[#0a0f1a] border border-[#ffe100]/30 rounded-xl p-4 mt-3 relative overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Background Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#ffe100]/5 rounded-full blur-3xl pointer-events-none"></div>

            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 w-6 h-6 rounded-full flex items-center justify-center transition-colors text-xs"
            >
                ✕
            </button>

            <div className="flex flex-col gap-1 mb-4">
                <span className="text-[10px] font-black text-[#ffe100] uppercase tracking-[0.2em]">
                    Calculator: {brandName}
                </span>
                <span className="text-sm font-bold text-white leading-tight">
                    {outcomeLabel} @ <span className="text-[#ffe100]">{odds.toFixed(2)}</span>
                </span>
            </div>

            <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                    <input
                        type="text"
                        value={stake}
                        onChange={handleStakeChange}
                        placeholder="Stake amount"
                        className="w-full bg-black/50 border border-white/10 rounded-lg py-2 pl-7 pr-3 text-white font-bold focus:outline-none focus:border-[#ffe100]/50 focus:ring-1 focus:ring-[#ffe100]/50 transition-all placeholder:text-gray-600"
                    />
                </div>
                <div className="flex gap-1.5">
                    {[10, 50, 100].map(amount => (
                        <button
                            key={amount}
                            onClick={() => setStake(amount.toString())}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#ffe100]/30 text-gray-300 hover:text-white px-3 py-2 rounded-lg text-xs font-bold transition-all"
                        >
                            +${amount}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between bg-black/30 rounded-lg p-3 border border-white/5">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-gray-500 font-black tracking-widest mb-0.5">Pure Profit</span>
                    <span className="text-lg font-black text-[#00ff88]">
                        +${profit.toFixed(2)}
                    </span>
                </div>
                <div className="w-[1px] h-8 bg-white/10"></div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase text-gray-500 font-black tracking-widest mb-0.5">Total Return</span>
                    <span className="text-xl font-black text-white">
                        ${totalReturn.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}
