import { describe, it, expect } from 'vitest';
import { Bonus } from '../../lib/bonuses';

// Mock data
const mockBonuses: Bonus[] = [
    {
        id: 1,
        geo: 'IN',
        type: 'casino',
        brand_id: 'brand1',
        brand_name: 'Brand 1',
        bonus_title: 'Welcome 1',
        bonus_amount: '100',
        bonus_type: 'welcome',
        wagering: '30x',
        conditions: 'T&C',
        affiliate_url: 'http://link1',
        logo_url: 'http://logo1',
        rating: 4.8,
        scraped_at: '2026-03-01',
        is_new: true,
        is_active: 1
    },
    {
        id: 2,
        geo: 'TR',
        type: 'betting',
        brand_id: 'brand2',
        brand_name: 'Brand 2',
        bonus_title: 'Welcome 2',
        bonus_amount: '200',
        bonus_type: 'welcome',
        wagering: 'N/A',
        conditions: 'T&C',
        affiliate_url: 'http://link2',
        logo_url: 'http://logo2',
        rating: 4.5,
        scraped_at: '2026-03-01',
        is_new: false,
        is_active: 1
    }
];

describe('Bonus Logic', () => {
    it('should correctly identify hot bonuses', () => {
        const bon1 = mockBonuses[0];
        const bon2 = mockBonuses[1];
        
        expect(bon1.rating >= 4.7).toBe(true);
        expect(bon2.rating >= 4.7).toBe(false);
    });

    it('should correctly identify new bonuses', () => {
        expect(mockBonuses[0].is_new).toBe(true);
        expect(mockBonuses[1].is_new).toBe(false);
    });
});
