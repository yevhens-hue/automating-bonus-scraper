import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import VipBonusCard from '../../components/VipBonusCard';
import React from 'react';

const mockBonus = {
    id: 1,
    geo: 'IN',
    type: 'casino' as const,
    brand_id: 'vipbrand1',
    brand_name: 'VIP Casino',
    bonus_title: 'Exclusive VIP Package',
    bonus_amount: '$10,000 + 500 Free Spins',
    bonus_type: 'vip',
    wagering: 'N/A',
    conditions: 'VIP members only',
    affiliate_url: 'http://vip-casino.com',
    logo_url: 'http://logo.com/vip-logo.png',
    rating: 4.9,
    scraped_at: '2026-03-01',
    is_new: true,
    is_active: 1,
    extra_data: JSON.stringify({
        tiers: ['Bronze: 5% cashback', 'Silver: 10% cashback', 'Gold: 15% cashback', 'Platinum: 20% cashback']
    })
};

describe('VipBonusCard', () => {
    it('renders brand name and bonus amount', () => {
        render(<VipBonusCard bonus={mockBonus} />);

        expect(screen.getByText('VIP Casino')).toBeInTheDocument();
        expect(screen.getByText('$10,000 + 500 Free Spins')).toBeInTheDocument();
    });

    it('displays NEW badge when is_new is true', () => {
        render(<VipBonusCard bonus={mockBonus} />);

        expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('displays VIP bonus title', () => {
        render(<VipBonusCard bonus={mockBonus} />);

        expect(screen.getByText('Exclusive VIP Package')).toBeInTheDocument();
    });

    it('displays rating stars correctly', () => {
        render(<VipBonusCard bonus={mockBonus} />);

        const stars = screen.getAllByText('★');
        expect(stars).toHaveLength(5);
    });

    it('renders VIP tiers from extra_data', () => {
        render(<VipBonusCard bonus={mockBonus} />);

        expect(screen.getByText('Bronze: 5% cashback')).toBeInTheDocument();
        expect(screen.getByText('Silver: 10% cashback')).toBeInTheDocument();
    });

    it('displays Loyalty Perks header when tiers exist', () => {
        render(<VipBonusCard bonus={mockBonus} />);

        expect(screen.getByText(/Loyalty Perks/i)).toBeInTheDocument();
    });

    it('renders join button with correct href', () => {
        render(<VipBonusCard bonus={mockBonus} />);

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', 'http://vip-casino.com');
    });

    it('displays rank badge for top 3', () => {
        render(<VipBonusCard bonus={mockBonus} rank={1} />);

        expect(screen.getByText('#1')).toBeInTheDocument();
    });

    it('displays expired state correctly', () => {
        const expiredBonus = {
            ...mockBonus,
            is_expired: true,
            is_new: false
        };
        render(<VipBonusCard bonus={expiredBonus} />);

        expect(screen.getByText('Program Closed')).toBeInTheDocument();
    });

    it('handles extra_data as simple string', () => {
        const simpleExtraBonus = {
            ...mockBonus,
            extra_data: 'Special Event Bonus'
        };
        render(<VipBonusCard bonus={simpleExtraBonus} />);

        // Should render without crashing
        expect(screen.getByText('VIP Casino')).toBeInTheDocument();
    });

    it('handles invalid JSON in extra_data gracefully', () => {
        const invalidJsonBonus = {
            ...mockBonus,
            extra_data: 'invalid{json'
        };
        // Should not throw
        expect(() => render(<VipBonusCard bonus={invalidJsonBonus} />)).not.toThrow();
    });
});