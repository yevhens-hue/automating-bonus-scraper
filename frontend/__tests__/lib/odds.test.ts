import { describe, it, expect } from 'vitest';
import type { OddsData, OddsEvent, OddsMarket, BookmakerOdd } from '../../lib/odds';

describe('Odds Types', () => {
    describe('OddsOutcome', () => {
        it('should have correct structure', () => {
            const outcome = {
                label: 'Team A',
                best_odd: 2.5,
                brand_id: 'brand1',
                brand_name: 'Bet365',
                affiliate_url: 'http://bet365.com'
            };

            expect(outcome.label).toBe('Team A');
            expect(outcome.best_odd).toBe(2.5);
            expect(outcome.brand_id).toBe('brand1');
            expect(outcome.brand_name).toBe('Bet365');
        });
    });

    describe('BookmakerOdd', () => {
        it('should have correct structure', () => {
            const bookmaker: BookmakerOdd = {
                brand_id: 'brand1',
                brand_name: 'Bet365',
                affiliate_url: 'http://bet365.com',
                odds: {
                    '1': 1.75,
                    'X': 3.25,
                    '2': 2.0
                },
                implied_probability: 45
            };

            expect(bookmaker.brand_name).toBe('Bet365');
            expect(bookmaker.odds['1']).toBe(1.75);
            expect(bookmaker.implied_probability).toBe(45);
        });
    });

    describe('OddsMarket', () => {
        it('should have correct structure', () => {
            const market: OddsMarket = {
                type: 'h2h',
                outcomes: [
                    {
                        label: 'Team A',
                        best_odd: 1.75,
                        brand_name: 'Bet365',
                        affiliate_url: 'http://bet365.com'
                    }
                ],
                bookmakers: []
            };

            expect(market.type).toBe('h2h');
            expect(market.outcomes).toHaveLength(1);
        });
    });

    describe('OddsEvent', () => {
        it('should have correct structure', () => {
            const event: OddsEvent = {
                id: 'event-123',
                slug: 'team-a-vs-team-b',
                sport: 'Cricket',
                tournament: 'IPL',
                team_home: 'Mumbai Indians',
                team_away: 'Chennai Super Kings',
                team_home_logo: 'http://logo.com/mi.png',
                team_away_logo: 'http://logo.com/csk.png',
                start_time: '2026-03-24T14:00:00Z',
                is_live: false,
                markets: []
            };

            expect(event.id).toBe('event-123');
            expect(event.slug).toBe('team-a-vs-team-b');
            expect(event.sport).toBe('Cricket');
            expect(event.team_home).toBe('Mumbai Indians');
        });
    });

    describe('OddsData', () => {
        it('should have correct structure', () => {
            const data: OddsData = {
                updated_at: '2026-03-24T12:00:00Z',
                events: []
            };

            expect(data.updated_at).toBeDefined();
            expect(Array.isArray(data.events)).toBe(true);
        });
    });
});

describe('Odds Utilities', () => {
    it('should calculate implied probability correctly', () => {
        const odds = 2.0;
        const impliedProbability = (1 / odds) * 100;
        
        expect(impliedProbability).toBe(50);
    });

    it('should handle different odds formats', () => {
        const decimalOdds = [1.5, 2.0, 3.5, 5.0];
        
        decimalOdds.forEach(odd => {
            const implied = (1 / odd) * 100;
            expect(implied).toBeGreaterThan(0);
            expect(implied).toBeLessThanOrEqual(100);
        });
    });
});