import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import EventMatchCard from '../../components/EventMatchCard';
import type { OddsEvent } from '../../lib/odds';
import React from 'react';

vi.mock('next/image', () => ({
    default: ({ src, alt }: { src: string; alt: string }) =>
        React.createElement('img', { src, alt })
}));

const mockEvent: OddsEvent = {
    id: 'event-123',
    slug: 'mumbai-indians-vs-chennai-super-kings',
    sport: 'Cricket',
    tournament: 'Indian Premier League',
    team_home: 'Mumbai Indians',
    team_away: 'Chennai Super Kings',
    team_home_logo: 'http://logo.com/mi.png',
    team_away_logo: 'http://logo.com/csk.png',
    start_time: '2026-03-25T14:00:00Z',
    is_live: false,
    markets: [
        {
            type: 'h2h',
            outcomes: [
                { label: 'Mumbai Indians', best_odd: 1.75, brand_name: 'Bet365', affiliate_url: 'http://bet365.com' },
                { label: 'Chennai Super Kings', best_odd: 2.10, brand_name: 'Bet365', affiliate_url: 'http://bet365.com' }
            ],
            bookmakers: []
        }
    ]
};

describe('EventMatchCard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('displays team names', () => {
        render(React.createElement(EventMatchCard, { event: mockEvent }));

        expect(screen.getAllByText(/Mumbai/)).toBeTruthy();
        expect(screen.getAllByText(/Chennai/)).toBeTruthy();
    });

    it('displays sport and tournament', () => {
        render(React.createElement(EventMatchCard, { event: mockEvent }));

        expect(screen.getByText('Cricket')).toBeInTheDocument();
        expect(screen.getByText('Indian Premier League')).toBeInTheDocument();
    });

    it('displays odds for both teams', () => {
        render(React.createElement(EventMatchCard, { event: mockEvent }));

        expect(screen.getByText('1.75')).toBeInTheDocument();
        expect(screen.getByText('2.10')).toBeInTheDocument();
    });

    it('displays brand name', () => {
        render(React.createElement(EventMatchCard, { event: mockEvent }));

        expect(screen.getAllByText('Bet365').length).toBeGreaterThan(0);
    });

    it('displays market type', () => {
        render(React.createElement(EventMatchCard, { event: mockEvent }));

        expect(screen.getByText('h2h')).toBeInTheDocument();
    });

    it('has link to match page', () => {
        render(React.createElement(EventMatchCard, { event: mockEvent }));

        // Find links - the first link should be the match page link
        const links = screen.getAllByRole('link');
        expect(links.length).toBeGreaterThan(0);
    });

    it('displays live badge when is_live is true', () => {
        const liveEvent = {
            ...mockEvent,
            is_live: true
        };
        render(React.createElement(EventMatchCard, { event: liveEvent }));

        expect(screen.getByText(/LIVE/)).toBeInTheDocument();
    });

    it('displays VS text', () => {
        render(React.createElement(EventMatchCard, { event: mockEvent }));

        expect(screen.getByText('VS')).toBeInTheDocument();
    });
});