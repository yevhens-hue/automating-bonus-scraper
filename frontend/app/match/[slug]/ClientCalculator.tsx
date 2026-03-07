'use client';

import React, { useState } from 'react';
import ProfitCalculator from '@/components/ProfitCalculator';

interface ClientCalculatorProps {
    outcomeLabel: string;
    odds: number;
    brandName: string;
}

export default function ClientCalculator({ outcomeLabel, odds, brandName }: ClientCalculatorProps) {
    const [isOpen, setIsOpen] = useState(true);

    if (!isOpen) return (
        <button
            onClick={() => setIsOpen(true)}
            className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-colors"
        >
            Open Calculator
        </button>
    );

    return (
        <ProfitCalculator
            outcomeLabel={outcomeLabel}
            odds={odds}
            brandName={brandName}
            onClose={() => setIsOpen(false)}
        />
    );
}
