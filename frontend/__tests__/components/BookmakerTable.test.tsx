import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BookmakerTable from '../../app/[locale]/match/[slug]/BookmakerTable';
import type { BookmakerOdd } from '../../lib/odds';
import React from 'react';

const mockBookmakers: BookmakerOdd[] = [
    {
        brand_id: 'brand1',
        brand_name: 'Bet365',
        affiliate_url: 'http://bet365.com',
        odds: { '1': 1.75, 'X': 3.25, '2': 2.10 },
        implied_probability: 45
    },
    {
        brand_id: 'brand2',
        brand_name: 'Parimatch',
        affiliate_url: 'http://parimatch.com',
        odds: { '1': 1.70, 'X': 3.30, '2': 2.05 },
        implied_probability: 48
    },
    {
        brand_id: 'brand3',
        brand_name: '1xBet',
        affiliate_url: 'http://1xbet.com',
        odds: { '1': 1.80, 'X': 3.20, '2': 2.15 },
        implied_probability: 42
    }
];

describe('BookmakerTable', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders bookmaker names', () => {
        render(
            React.createElement(BookmakerTable, {
                bookmakers: mockBookmakers,
                teamHome: 'Team A',
                teamAway: 'Team B'
            })
        );

        expect(screen.getByText('Bet365')).toBeInTheDocument();
        expect(screen.getByText('Parimatch')).toBeInTheDocument();
        expect(screen.getByText('1xBet')).toBeInTheDocument();
    });

    it('displays odds columns', () => {
        render(
            React.createElement(BookmakerTable, {
                bookmakers: mockBookmakers,
                teamHome: 'Team A',
                teamAway: 'Team B'
            })
        );

        // Check for column headers
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('X')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('displays odds values', () => {
        render(
            React.createElement(BookmakerTable, {
                bookmakers: mockBookmakers,
                teamHome: 'Team A',
                teamAway: 'Team B'
            })
        );

        // Check formatted odds (2 decimal places)
        expect(screen.getByText('1.75')).toBeInTheDocument();
        expect(screen.getByText('3.25')).toBeInTheDocument();
        expect(screen.getByText('2.10')).toBeInTheDocument();
    });

    it('displays Bet Now buttons', () => {
        render(
            React.createElement(BookmakerTable, {
                bookmakers: mockBookmakers,
                teamHome: 'Team A',
                teamAway: 'Team B'
            })
        );

        const betButtons = screen.getAllByText('Bet Now');
        expect(betButtons.length).toBe(3);
    });

    it('displays search input', () => {
        render(
            React.createElement(BookmakerTable, {
                bookmakers: mockBookmakers,
                teamHome: 'Team A',
                teamAway: 'Team B'
            })
        );

        expect(screen.getByPlaceholderText('Search bookmaker...')).toBeInTheDocument();
    });

    it('displays bookmaker count', () => {
        render(
            React.createElement(BookmakerTable, {
                bookmakers: mockBookmakers,
                teamHome: 'Team A',
                teamAway: 'Team B'
            })
        );

        expect(screen.getByText(/Found 3 bookmakers/)).toBeInTheDocument();
    });

    it('filters bookmakers on search', () => {
        render(
            React.createElement(BookmakerTable, {
                bookmakers: mockBookmakers,
                teamHome: 'Team A',
                teamAway: 'Team B'
            })
        );

        const searchInput = screen.getByPlaceholderText('Search bookmaker...');
        fireEvent.change(searchInput, { target: { value: 'Bet365' } });

        expect(screen.getByText('Bet365')).toBeInTheDocument();
        expect(screen.queryByText('Parimatch')).not.toBeInTheDocument();
    });

    it('displays margin column', () => {
        render(
            React.createElement(BookmakerTable, {
                bookmakers: mockBookmakers,
                teamHome: 'Team A',
                teamAway: 'Team B'
            })
        );

        expect(screen.getByText('Margin')).toBeInTheDocument();
    });

    it('shows empty state when no bookmakers', () => {
        render(
            React.createElement(BookmakerTable, {
                bookmakers: [],
                teamHome: 'Team A',
                teamAway: 'Team B'
            })
        );

        // Should not render table when empty
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
});