import type { Bonus } from './bonuses';

export const GEO_NAMES: Record<string, string> = { IN: 'India', TR: 'Turkey', BR: 'Brazil' };
export const GEO_FLAGS: Record<string, string> = { IN: '🇮🇳', TR: '🇹🇷', BR: '🇧🇷' };

/** Group a list of bonuses by their GEO code, sorted alphabetically. */
export function groupByGeo(bonuses: Bonus[]): {
    geos: string[];
    geoGroups: Record<string, Bonus[]>;
} {
    const geoGroups: Record<string, Bonus[]> = bonuses.reduce(
        (acc: Record<string, Bonus[]>, bonus) => {
            const geo = bonus.geo || 'Other';
            if (!acc[geo]) acc[geo] = [];
            acc[geo].push(bonus);
            return acc;
        },
        {}
    );
    return { geos: Object.keys(geoGroups).sort(), geoGroups };
}
