import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BonusTableRow from '../../components/BonusTableRow';
import React from 'react';

const mockBonus = {
    id: 1,
    geo: 'IN',
    type: 'casino' as const,
    brand_id: 'brand1',
    brand_name: 'Test Brand',
    bonus_title: 'Big Bonus',
    bonus_amount: '$1000',
    bonus_type: 'welcome',
    wagering: '30x',
    conditions: 'None',
    affiliate_url: 'http://test',
    logo_url: 'http://logo',
    rating: 4.8,
    scraped_at: '2026-03-01',
    is_new: true,
    is_active: 1
};

describe('BonusTableRow', () => {
    it('renders brand name and bonus amount', () => {
        render(
            <table>
                <tbody>
                    <BonusTableRow bonus={mockBonus} rank={1} />
                </tbody>
            </table>
        );

        expect(screen.getByText('Test Brand')).toBeInTheDocument();
        expect(screen.getByText('$1000')).toBeInTheDocument();
    });

    it('displays NEW badge when is_new is true', () => {
        render(
            <table>
                <tbody>
                    <BonusTableRow bonus={mockBonus} rank={1} />
                </tbody>
            </table>
        );

        expect(screen.getByText('NEW')).toBeInTheDocument();
    });

    it('displays HOT badge when rating is >= 4.7', () => {
        render(
            <table>
                <tbody>
                    <BonusTableRow bonus={mockBonus} rank={1} />
                </tbody>
            </table>
        );

        expect(screen.getByText(/HOT/)).toBeInTheDocument();
    });

    it('displays rank correctly', () => {
        render(
            <table>
                <tbody>
                    <BonusTableRow bonus={{ ...mockBonus, rating: 4.0 }} rank={5} />
                </tbody>
            </table>
        );

        expect(screen.getByText('5')).toBeInTheDocument();
    });
});
