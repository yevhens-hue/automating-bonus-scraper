import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProfitCalculator from '../../components/ProfitCalculator';
import React from 'react';

describe('ProfitCalculator', () => {
    const defaultProps = {
        outcomeLabel: 'Team A Wins',
        odds: 2.50,
        brandName: 'Bet365',
        onClose: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders with correct odds and brand name', () => {
        render(React.createElement(ProfitCalculator, defaultProps));

        expect(screen.getByText(/Bet365/)).toBeInTheDocument();
        expect(screen.getByText(/2\.50/)).toBeInTheDocument();
    });

    it('displays default stake amount', () => {
        render(React.createElement(ProfitCalculator, defaultProps));

        const input = screen.getByPlaceholderText('Stake amount');
        expect(input).toHaveValue('100');
    });

    it('calculates profit correctly for winning bet', () => {
        render(React.createElement(ProfitCalculator, defaultProps));

        // Text split across elements - use regex to find partial text
        expect(screen.getByText(/150\.00/)).toBeInTheDocument();
        expect(screen.getByText(/250\.00/)).toBeInTheDocument();
    });

    it('updates calculation when stake changes', () => {
        render(React.createElement(ProfitCalculator, defaultProps));

        const input = screen.getByPlaceholderText('Stake amount');
        fireEvent.change(input, { target: { value: '200' } });

        expect(screen.getByText(/300\.00/)).toBeInTheDocument();
        expect(screen.getByText(/500\.00/)).toBeInTheDocument();
    });

    it('quick add buttons work correctly', () => {
        render(React.createElement(ProfitCalculator, defaultProps));

        const add100Button = screen.getByText('+$100');
        fireEvent.click(add100Button);

        // After clicking +$100, stake becomes 100 (100 default + 100 clicked = 200)
        // Check the calculated profit: 200 * 2.50 = 500, profit = 300
        expect(screen.getByText(/300\.00/)).toBeInTheDocument();
        expect(screen.getByText(/500\.00/)).toBeInTheDocument();
    });

    it('handles empty stake gracefully', () => {
        render(React.createElement(ProfitCalculator, defaultProps));

        const input = screen.getByPlaceholderText('Stake amount');
        fireEvent.change(input, { target: { value: '' } });

        // Profit should be 0.00 when stake is empty - check both profit and total return
        // The profit text is in green color
        const profitElements = screen.getAllByText(/0\.00/);
        expect(profitElements.length).toBeGreaterThan(0);
    });

    it('calls onClose when close button is clicked', () => {
        const onClose = vi.fn();
        render(React.createElement(ProfitCalculator, { ...defaultProps, onClose }));

        const closeButton = screen.getByText('✕');
        fireEvent.click(closeButton);

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('displays Pure Profit and Total Return labels', () => {
        render(React.createElement(ProfitCalculator, defaultProps));

        expect(screen.getByText('Pure Profit')).toBeInTheDocument();
        expect(screen.getByText('Total Return')).toBeInTheDocument();
    });

    it('handles decimal odds correctly', () => {
        const decimalProps = {
            ...defaultProps,
            odds: 1.75
        };
        render(React.createElement(ProfitCalculator, decimalProps));

        // For odds 1.75 and stake 100: profit = 75, total = 175
        // Use getAllByText since the text is split across elements
        expect(screen.getAllByText(/75\.00/).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/175\.00/).length).toBeGreaterThan(0);
    });

    it('filters non-numeric input', () => {
        render(React.createElement(ProfitCalculator, defaultProps));

        const input = screen.getByPlaceholderText('Stake amount');
        fireEvent.change(input, { target: { value: 'abc123.45xyz' } });

        expect(screen.getByDisplayValue('123.45')).toBeInTheDocument();
    });
});