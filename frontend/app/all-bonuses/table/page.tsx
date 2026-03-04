import React, { Suspense } from 'react';
import bonusesData from '@/data/bonuses.json';
import { Bonus } from '@/lib/bonuses';
import DetailedBonusTable from '@/components/DetailedBonusTable';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function AllBonusesTablePage() {
    const bonuses = bonusesData.bonuses as unknown as Bonus[];

    return (
        <div className="min-h-screen bg-[#050505] text-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <Link href="/all-bonuses" className="text-purple-400 hover:text-purple-300 font-bold mb-4 inline-block">
                        ← Back to Grid
                    </Link>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                        All Bonuses <span className="text-gray-500 text-2xl font-normal lowercase tracking-normal italic">Snapshot</span>
                    </h1>
                </header>

                <Suspense fallback={<div className="py-20 text-center text-gray-500 italic">Loading table...</div>}>
                    <DetailedBonusTable bonuses={bonuses} title="Master" />
                </Suspense>
            </div>
        </div>
    );
}
