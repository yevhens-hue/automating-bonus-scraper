import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import React from 'react';

vi.mock('@/i18n/routing', () => ({
    usePathname: vi.fn(() => '/'),
    useRouter: vi.fn(() => ({ replace: vi.fn() }))
}));

describe('LanguageSwitcher', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders language options', () => {
        render(<LanguageSwitcher currentLocale="en" />);

        expect(screen.getByText('en')).toBeInTheDocument();
        expect(screen.getByText('tr')).toBeInTheDocument();
        expect(screen.getByText('pt')).toBeInTheDocument();
        expect(screen.getByText('fr')).toBeInTheDocument();
    });

    it('renders as a div with buttons', () => {
        const { container } = render(<LanguageSwitcher currentLocale="en" />);

        expect(container.querySelector('div')).toBeInTheDocument();
        expect(container.querySelectorAll('button').length).toBe(4);
    });
});