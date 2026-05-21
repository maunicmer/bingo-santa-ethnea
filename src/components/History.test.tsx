import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { History } from './History';
import { useBingoStore } from '../stores/gameStore';

vi.mock('../stores/gameStore', () => ({
  useBingoStore: vi.fn(),
}));

const mockStore = vi.mocked(useBingoStore);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('History', () => {
  it('shows "Aún no salió ningún número" when drawnNumbers is empty', () => {
    mockStore.mockImplementation((selector: (s: any) => any) =>
      selector({ drawnNumbers: [] })
    );

    render(<History />);

    expect(screen.getByText('Aún no salió ningún número')).toBeInTheDocument();
  });

  it('shows last 10 drawn numbers in reverse order (most recent first)', () => {
    const drawnNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    mockStore.mockImplementation((selector: (s: any) => any) =>
      selector({ drawnNumbers })
    );

    const { container } = render(<History />);

    // Query individual number balls by rounded-full class
    const numberBalls = container.querySelectorAll('.rounded-full');
    const displayedNumbers = Array.from(numberBalls).map((el) =>
      parseInt(el.textContent!)
    );

    // Should show last 10 in reverse: 15, 14, 13, ..., 6
    expect(displayedNumbers).toEqual([15, 14, 13, 12, 11, 10, 9, 8, 7, 6]);
  });

  it('shows all numbers when fewer than 10 drawn', () => {
    const drawnNumbers = [5, 10, 15];
    mockStore.mockImplementation((selector: (s: any) => any) =>
      selector({ drawnNumbers })
    );

    const { container } = render(<History />);

    const numberBalls = container.querySelectorAll('.rounded-full');
    const displayedNumbers = Array.from(numberBalls).map((el) =>
      parseInt(el.textContent!)
    );

    expect(displayedNumbers).toEqual([15, 10, 5]);
  });

  it('renders numbers in a horizontal strip without heading', () => {
    const drawnNumbers = [1, 2, 3, 4, 5];
    mockStore.mockImplementation((selector: (s: any) => any) =>
      selector({ drawnNumbers })
    );

    const { container } = render(<History />);

    // No heading should be present
    expect(screen.queryByText(/Últimos números/)).not.toBeInTheDocument();
    // Number balls should be present
    const numberBalls = container.querySelectorAll('.rounded-full');
    expect(numberBalls.length).toBe(5);
  });

  it('highlights the most recent number with red styling', () => {
    const drawnNumbers = [5, 10, 15];
    mockStore.mockImplementation((selector: (s: any) => any) =>
      selector({ drawnNumbers })
    );

    render(<History />);

    const mostRecent = screen.getByText('15');
    expect(mostRecent.className).toContain('bg-bingo-red');
  });

  it('renders history as a thin strip with minimal height', () => {
    mockStore.mockImplementation((selector: (s: any) => any) =>
      selector({ drawnNumbers: [1, 2, 3] })
    );

    const { container } = render(<History />);
    const stripContainer = container.firstChild as HTMLElement;

    // Verify thin strip sizing: min-h-[48px] mobile, md:min-h-[56px] medium+
    expect(stripContainer?.className).toContain('min-h-[48px]');
    expect(stripContainer?.className).toContain('md:min-h-[56px]');
  });

  it('renders history badges with smaller sizing than board cells', () => {
    mockStore.mockImplementation((selector: (s: any) => any) =>
      selector({ drawnNumbers: [1, 2, 3] })
    );

    const { container } = render(<History />);
    const badges = container.querySelectorAll('.rounded-full');

    expect(badges.length).toBe(3);
    badges.forEach((badge) => {
      // History badges: w-8 h-8 mobile, md:w-10 md:h-10 medium+
      expect(badge.className).toContain('w-8');
      expect(badge.className).toContain('h-8');
      expect(badge.className).toContain('md:w-10');
      expect(badge.className).toContain('md:h-10');
    });
  });

  it('does not render a heading in the history strip', () => {
    mockStore.mockImplementation((selector: (s: any) => any) =>
      selector({ drawnNumbers: [1, 2, 3, 4, 5] })
    );

    render(<History />);

    // No heading should be present in the thin strip
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(screen.queryByText(/Últimos números/)).not.toBeInTheDocument();
  });
});
