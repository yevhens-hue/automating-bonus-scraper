import { describe, it, expect } from 'vitest';
import { groupByGeo, GEO_NAMES, GEO_FLAGS } from '../../lib/geo';
import { Bonus } from '../../lib/bonuses';

describe('Geo Utilities', () => {
    describe('GEO_NAMES', () => {
        it('should have India defined', () => {
            expect(GEO_NAMES['IN']).toBe('India');
        });

        it('should have Turkey defined', () => {
            expect(GEO_NAMES['TR']).toBe('Turkey');
        });

        it('should have Brazil defined', () => {
            expect(GEO_NAMES['BR']).toBe('Brazil');
        });
    });

    describe('GEO_FLAGS', () => {
        it('should have flag for India', () => {
            expect(GEO_FLAGS['IN']).toBeDefined();
        });

        it('should have flag for Turkey', () => {
            expect(GEO_FLAGS['TR']).toBeDefined();
        });

        it('should have flag for Brazil', () => {
            expect(GEO_FLAGS['BR']).toBeDefined();
        });
    });

    describe('groupByGeo', () => {
        const mockBonuses: Bonus[] = [
            {
                id: 1,
                geo: 'IN',
                type: 'casino',
                brand_id: 'brand1',
                brand_name: 'Brand 1',
                bonus_title: 'Bonus 1',
                bonus_amount: '$100',
                bonus_type: 'welcome',
                wagering: '30x',
                conditions: 'T&C',
                affiliate_url: 'http://test.com',
                logo_url: 'http://logo.com',
                rating: 4.5,
                scraped_at: '2026-03-01',
                is_active: 1
            },
            {
                id: 2,
                geo: 'TR',
                type: 'betting',
                brand_id: 'brand2',
                brand_name: 'Brand 2',
                bonus_title: 'Bonus 2',
                bonus_amount: '$200',
                bonus_type: 'welcome',
                wagering: '20x',
                conditions: 'T&C',
                affiliate_url: 'http://test.com',
                logo_url: 'http://logo.com',
                rating: 4.0,
                scraped_at: '2026-03-01',
                is_active: 1
            },
            {
                id: 3,
                geo: 'IN',
                type: 'casino',
                brand_id: 'brand3',
                brand_name: 'Brand 3',
                bonus_title: 'Bonus 3',
                bonus_amount: '$150',
                bonus_type: 'reload',
                wagering: '25x',
                conditions: 'T&C',
                affiliate_url: 'http://test.com',
                logo_url: 'http://logo.com',
                rating: 4.2,
                scraped_at: '2026-03-01',
                is_active: 1
            }
        ];

        it('should group bonuses by geo', () => {
            const result = groupByGeo(mockBonuses);

            expect(result.geoGroups['IN']).toHaveLength(2);
            expect(result.geoGroups['TR']).toHaveLength(1);
        });

        it('should return sorted geo list', () => {
            const result = groupByGeo(mockBonuses);

            expect(result.geos).toEqual(['IN', 'TR']);
        });

        it('should handle empty list', () => {
            const result = groupByGeo([]);

            expect(result.geos).toEqual([]);
            expect(result.geoGroups).toEqual({});
        });

        it('should handle bonuses with missing geo', () => {
            const bonusesWithMissingGeo = [
                {
                    ...mockBonuses[0],
                    geo: ''
                }
            ];

            const result = groupByGeo(bonusesWithMissingGeo);

            expect(result.geoGroups['Other']).toHaveLength(1);
        });
    });
});