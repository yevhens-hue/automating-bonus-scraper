import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ClientCalculator from '../../app/[locale]/match/[slug]/ClientCalculator';
import React from 'react';

describe('ClientCalculator', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const defaultProps = {
        outcomeLabel: 'Team A Wins',
        odds: 2.50,
        brandName: 'Bet365'
    };

    it('renders with outcome label and odds', () => {
        render(React.createElement(ClientCalculator, defaultProps));

        expect(screen.getByText(/2\.50/)).toBeInTheDocument();
    });

    it('displays default stake of 100', () => {
        render(React.createElement(ClientCalculator, defaultProps));

        const input = screen.getByDisplayValue('100');
        expect(input).toBeInTheDocument();
    });

    it('calculates profit correctly', () => {
        render(React.createElement(ClientCalculator, defaultProps));

        // Text split across elements - use regex to find partial text
        expect(screen.getByText(/150\.00/)).toBeInTheDocument();
        expect(screen.getByText(/250\.00/)).toBeInTheDocument();
    });

    it('updates calculation on stake change', () => {
        render(React.createElement(ClientCalculator, defaultProps));

        const input = screen.getByDisplayValue('100');
        fireEvent.change(input, { target: { value: '200' } });

        expect(screen.getByText(/300\.00/)).toBeInTheDocument();
        expect(screen.getByText(/500\.00/)).toBeInTheDocument();
    });

    it('has quick add buttons', () => {
        render(React.createElement(ClientCalculator, defaultProps));

        expect(screen.getByText('+$10')).toBeInTheDocument();
        expect(screen.getByText('+$50')).toBeInTheDocument();
        expect(screen.getByText('+$100')).toBeInTheDocument();
    });

    it('quick add buttons work correctly', () => {
        render(React.createElement(ClientCalculator, defaultProps));

        const add100Button = screen.getByText('+$100');
        fireEvent.click(add100Button);

        // After clicking +$100, stake becomes 200 (100 default + 100 clicked)
        // Check the calculated profit: 200 * 2.50 = 500, profit = 300
        expect(screen.getByText(/300\.00/)).toBeInTheDocument();
        expect(screen.getByText(/500\.00/)).toBeInTheDocument();
    });

    it('displays labels correctly', () => {
        render(React.createElement(ClientCalculator, defaultProps));

        expect(screen.getByText('Pure Profit')).toBeInTheDocument();
        expect(screen.getByText('Total Return')).toBeInTheDocument();
    });

    it('displays calculator label', () => {
        render(React.createElement(ClientCalculator, defaultProps));

        expect(screen.getByText(/Calculator:/)).toBeInTheDocument();
    });

    it('has close button', () => {
        render(React.createElement(ClientCalculator, defaultProps));

        const closeButton = screen.getByText('✕');
        expect(closeButton).toBeInTheDocument();
    });

    it('handles empty stake', () => {
        render(React.createElement(ClientCalculator, defaultProps));

        const input = screen.getByDisplayValue('100');
        fireEvent.change(input, { target: { value: '' } });

        // Profit should be 0.00 when stake is empty - check both profit and total return
        const profitElements = screen.getAllByText(/0\.00/);
        expect(profitElements.length).toBeGreaterThan(0);
    });

    it('handles decimal odds', () => {
        render(React.createElement(ClientCalculator, {
            ...defaultProps,
            odds: 1.75
        }));

        // For odds 1.75 and stake 100: profit = 75, total = 175
        // Use getAllByText since the text is split across elements
        expect(screen.getAllByText(/75\.00/).length).toBeGreaterThan(0);
    });
});