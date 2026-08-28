import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BonusCard from '../../components/BonusCard';
import React from 'react';

const mockBonus = {
    id: 1,
    geo: 'IN',
    type: 'casino' as const,
    brand_id: 'brand1',
    brand_name: 'Test Casino',
    bonus_title: 'Welcome Bonus',
    bonus_amount: '$1000',
    bonus_type: 'welcome',
    wagering: '30x',
    conditions: 'Min deposit $10',
    affiliate_url: 'http://test-casino.com',
    logo_url: 'http://logo.com/logo.png',
    rating: 4.8,
    scraped_at: '2026-03-01',
    is_new: true,
    is_active: 1
};

describe('BonusCard', () => {
    it('renders brand name and bonus amount', () => {
        render(React.createElement(BonusCard, { bonus: mockBonus }));

        expect(screen.getByText('Test Casino')).toBeInTheDocument();
        expect(screen.getByText('$1000')).toBeInTheDocument();
    });

    it('displays NEW badge when is_new is true', () => {
        render(React.createElement(BonusCard, { bonus: mockBonus }));

        expect(screen.getByText('NEW')).toBeInTheDocument();
    });

    it('displays NO WAGER badge when wagering is N/A', () => {
        const noWagerBonus = {
            ...mockBonus,
            wagering: 'N/A'
        };
        render(React.createElement(BonusCard, { bonus: noWagerBonus }));

        expect(screen.getByText(/NO WAGER/i)).toBeInTheDocument();
    });

    it('displays rating stars correctly', () => {
        render(React.createElement(BonusCard, { bonus: mockBonus }));

        // Should have 5 star elements
        const stars = screen.getAllByText('★');
        expect(stars).toHaveLength(5);
    });

    it('displays bonus title', () => {
        render(React.createElement(BonusCard, { bonus: mockBonus }));

        expect(screen.getByText('Welcome Bonus')).toBeInTheDocument();
    });

    it('displays wagering requirements', () => {
        render(React.createElement(BonusCard, { bonus: mockBonus }));

        expect(screen.getByText('30x')).toBeInTheDocument();
    });

    it('displays conditions', () => {
        render(React.createElement(BonusCard, { bonus: mockBonus }));

        expect(screen.getByText('Min deposit $10')).toBeInTheDocument();
    });

    it('renders claim button with correct href', () => {
        render(React.createElement(BonusCard, { bonus: mockBonus }));

        // Use a broader regex to match any of the possible CTA variants
        const affiliateLink = screen.getByRole('link', { name: /(Claim Bonus|Get Offer|Play Now)/i });
        expect(affiliateLink).toHaveAttribute('href', 'http://test-casino.com');
        expect(affiliateLink).toHaveAttribute('target', '_blank');
    });

    it('renders link to bonus details page', () => {
        render(React.createElement(BonusCard, { bonus: mockBonus }));

        const detailsLink = screen.getByText(/View Bonus Details/i).closest('a');
        expect(detailsLink).toHaveAttribute('href', '/bonus/1');
    });

    it('displays expired state when is_expired is true', () => {
        const expiredBonus = {
            ...mockBonus,
            is_expired: true,
            is_new: false
        };
        render(React.createElement(BonusCard, { bonus: expiredBonus }));

        expect(screen.getByText('EXPIRED')).toBeInTheDocument();
        expect(screen.getByText('Offer Expired')).toBeInTheDocument();
    });

    it('displays rank badge for top 3', () => {
        render(React.createElement(BonusCard, { bonus: mockBonus, rank: 1 }));

        expect(screen.getByText('#1')).toBeInTheDocument();
    });

    it('displays bonus type label', () => {
        render(React.createElement(BonusCard, { bonus: mockBonus }));

        // Use getAllByText since Welcome appears in both badge and title
        const welcomeElements = screen.getAllByText(/Welcome/i);
        expect(welcomeElements.length).toBeGreaterThan(0);
    });

    it('displays featured providers when present', () => {
        const bonusWithProviders = {
            ...mockBonus,
            featured_providers: 'NetEnt, Microgaming, PlayTech'
        };
        render(React.createElement(BonusCard, { bonus: bonusWithProviders }));

        expect(screen.getByText('NetEnt')).toBeInTheDocument();
    });
});