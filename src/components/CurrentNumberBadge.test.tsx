import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CurrentNumberBadge } from './CurrentNumberBadge';
import type { BingoState } from '../stores/gameStore';
import { useBingoStore } from '../stores/gameStore';

vi.mock('../stores/gameStore', () => ({
  useBingoStore: vi.fn(),
}));

const mockStore = vi.mocked(useBingoStore);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('CurrentNumberBadge', () => {
  it('renders placeholder when currentNumber is null', () => {
    mockStore.mockImplementation((selector: (s: BingoState) => unknown) =>
      selector({ currentNumber: null, drawPhase: 'idle' } as unknown as BingoState)
    );

    render(<CurrentNumberBadge />);

    const badge = screen.getByTestId('current-number-badge');
    expect(badge).toHaveTextContent('\u2014');
  });

  it('renders the current number when revealed', () => {
    const number = 42;
    mockStore.mockImplementation((selector: (s: BingoState) => unknown) =>
      selector({ currentNumber: number, drawPhase: 'revealed' } as unknown as BingoState)
    );

    render(<CurrentNumberBadge />);

    const badge = screen.getByTestId('current-number-badge');
    expect(badge).toHaveTextContent(String(number));
  });

  it('uses bingo-red bg for revealed state', () => {
    mockStore.mockImplementation((selector: (s: BingoState) => unknown) =>
      selector({ currentNumber: 7, drawPhase: 'revealed' } as unknown as BingoState)
    );

    render(<CurrentNumberBadge />);

    const badge = screen.getByTestId('current-number-badge');
    expect(badge.className).toContain('bg-bingo-red');
  });

  it('has subtle pulse animation (animate-pulse class present)', () => {
    mockStore.mockImplementation((selector: (s: BingoState) => unknown) =>
      selector({ currentNumber: 7, drawPhase: 'revealed' } as unknown as BingoState)
    );

    render(<CurrentNumberBadge />);

    const badge = screen.getByTestId('current-number-badge');
    expect(badge.className).toContain('animate-pulse');
  });

  it('does NOT have spin-related classes or animations', () => {
    mockStore.mockImplementation((selector: (s: BingoState) => unknown) =>
      selector({ currentNumber: 7, drawPhase: 'revealed' } as unknown as BingoState)
    );

    render(<CurrentNumberBadge />);

    const badge = screen.getByTestId('current-number-badge');
    expect(badge.className).not.toContain('spin');
    expect(badge.className).not.toContain('wheel');
    expect(badge.className).not.toContain('rotate');
  });
});
