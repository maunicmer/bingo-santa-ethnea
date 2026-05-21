import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Board } from './Board';
import { useBingoStore } from '../stores/gameStore';

vi.mock('../stores/gameStore', () => ({
  useBingoStore: vi.fn(),
}));

const mockStore = vi.mocked(useBingoStore);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Board', () => {
  it('renders 75 number cells (1-75)', () => {
    mockStore.mockImplementation((selector: (s: any) => any) =>
      selector({ drawnNumbers: [], currentNumber: null })
    );

    render(<Board />);

    for (let i = 1; i <= 75; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument();
    }
  });

  it('highlights drawn numbers with green styling', () => {
    const drawnNumbers = [5, 10, 15];
    mockStore.mockImplementation((selector: (s: any) => any) =>
      selector({ drawnNumbers, currentNumber: null })
    );

    render(<Board />);

    drawnNumbers.forEach((num) => {
      const cell = screen.getByText(String(num));
      expect(cell.className).toContain('bg-bingo-green');
    });
  });

  it('highlights current number with red styling and pulse animation', () => {
    const drawnNumbers = [5, 10];
    const currentNumber = 15;
    mockStore.mockImplementation((selector: (s: any) => any) =>
      selector({ drawnNumbers, currentNumber })
    );

    render(<Board />);

    const currentCell = screen.getByText(String(currentNumber));
    expect(currentCell.className).toContain('bg-bingo-red');
    expect(currentCell.className).toContain('animate-pulse');
    expect(currentCell.className).toContain('scale-125');
  });

  it('undrawn numbers have default styling', () => {
    const drawnNumbers = [1];
    mockStore.mockImplementation((selector: (s: any) => any) =>
      selector({ drawnNumbers, currentNumber: null })
    );

    render(<Board />);

    const undrawn = screen.getByText('2');
    expect(undrawn.className).toContain('bg-white/20');
  });

  it('renders cells with fluid sizing (aspect-square + w-full)', () => {
    mockStore.mockImplementation((selector: (s: any) => any) =>
      selector({ drawnNumbers: [], currentNumber: null })
    );

    render(<Board />);

    const firstCell = screen.getByText('1');
    expect(firstCell.className).toContain('aspect-square');
    expect(firstCell.className).toContain('w-full');
  });

  it('renders cells with responsive font sizes', () => {
    mockStore.mockImplementation((selector: (s: any) => any) =>
      selector({ drawnNumbers: [], currentNumber: null })
    );

    render(<Board />);

    const cell = screen.getByText('1');
    expect(cell.className).toContain('text-xl');
    expect(cell.className).toContain('md:text-2xl');
    expect(cell.className).toContain('lg:text-3xl');
    expect(cell.className).toContain('xl:text-4xl');
  });
});
