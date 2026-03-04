import React from 'react';
import bonusesData from '@/data/bonuses.json';
import { Bonus } from '@/lib/bonuses';
import DetailedBonusTable from '@/components/DetailedBonusTable';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function VipProgramsTablePage() {
    const bonuses = (bonusesData.bonuses as unknown as Bonus[])
        .filter(b => b.bonus_type === 'vip' || (b.extra_data && b.extra_data.toLowerCase().includes('vip')));

    return (
        <div className="min-h-screen bg-[#050505] text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <Link href="/vip-programs" className="text-amber-400 hover:text-amber-300 font-bold mb-4 inline-block">
                        ← Back to Grid
                    </Link>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                        Loyalty Programs <span className="text-gray-500 text-2xl font-normal lowercase tracking-normal italic">Registry</span>
                    </h1>
                </header>

                <DetailedBonusTable bonuses={bonuses} title="VIP" />
            </div>
        </div>
    );
}
