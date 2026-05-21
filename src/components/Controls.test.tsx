import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Controls } from './Controls';
import { GameState } from '../types/game';
import { useBingoStore } from '../stores/gameStore';

vi.mock('../stores/gameStore', () => ({
  useBingoStore: vi.fn(),
}));

const mockStore = vi.mocked(useBingoStore);

const createMockState = (overrides = {}) => {
  const startDraw = vi.fn();
  const resetGame = vi.fn();
  return {
    drawnNumbers: [],
    currentNumber: null,
    drawPhase: 'idle' as const,
    isFinished: false,
    availableNumbers: Array.from({ length: 75 }, (_, i) => i + 1),
    startDraw,
    resetGame,
    ...overrides,
  };
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Controls', () => {
  it('renders "Sacar Número" button', () => {
    mockStore.mockImplementation((selector: (s: Partial<GameState>) => unknown) =>
      selector(createMockState())
    );

    render(<Controls />);

    expect(screen.getByText(/Sacar Número/)).toBeInTheDocument();
  });

  it('renders "Nueva Partida" button', () => {
    mockStore.mockImplementation((selector: (s: Partial<GameState>) => unknown) =>
      selector(createMockState())
    );

    render(<Controls />);

    expect(screen.getByText(/Nueva Partida/)).toBeInTheDocument();
  });

  it('calls startDraw when "Sacar Número" is clicked', async () => {
    const user = userEvent.setup();
    const startDraw = vi.fn();
    mockStore.mockImplementation((selector: (s: Partial<GameState>) => unknown) =>
      selector(createMockState({ startDraw }))
    );

    render(<Controls />);

    await user.click(screen.getByText(/Sacar Número/));
    expect(startDraw).toHaveBeenCalledTimes(1);
  });

  it('calls resetGame when "Nueva Partida" is clicked', async () => {
    const user = userEvent.setup();
    const resetGame = vi.fn();
    mockStore.mockImplementation((selector: (s: Partial<GameState>) => unknown) =>
      selector(createMockState({ resetGame }))
    );

    render(<Controls />);

    await user.click(screen.getByText(/Nueva Partida/));
    expect(resetGame).toHaveBeenCalledTimes(1);
  });

  it('disables "Sacar Número" when drawPhase is spinning', () => {
    mockStore.mockImplementation((selector: (s: Partial<GameState>) => unknown) =>
      selector(createMockState({ drawPhase: 'spinning' }))
    );

    render(<Controls />);

    // Button shows "Girando..." during spinning but is still the draw button
    const buttons = screen.getAllByRole('button');
    const drawButton = buttons.find((b) => b.textContent?.includes('Girando'));
    expect(drawButton).toBeDisabled();
  });

  it('disables "Sacar Número" when drawPhase is revealing', () => {
    mockStore.mockImplementation((selector: (s: Partial<GameState>) => unknown) =>
      selector(createMockState({ drawPhase: 'revealing' }))
    );

    render(<Controls />);

    const buttons = screen.getAllByRole('button');
    const drawButton = buttons.find((b) => b.textContent?.includes('Girando'));
    expect(drawButton).toBeDisabled();
  });

  it('disables "Sacar Número" when isFinished is true', () => {
    mockStore.mockImplementation((selector: (s: Partial<GameState>) => unknown) =>
      selector(createMockState({ isFinished: true }))
    );

    render(<Controls />);

    expect(screen.getByText(/Sacar Número/)).toBeDisabled();
  });

  it('disables "Sacar Número" when availableNumbers is empty', () => {
    mockStore.mockImplementation((selector: (s: Partial<GameState>) => unknown) =>
      selector(createMockState({ availableNumbers: [] }))
    );

    render(<Controls />);

    expect(screen.getByText(/Sacar Número/)).toBeDisabled();
  });

  it('enables "Sacar Número" when drawPhase is idle and game not finished', () => {
    mockStore.mockImplementation((selector: (s: Partial<GameState>) => unknown) =>
      selector(createMockState({ drawPhase: 'idle', isFinished: false }))
    );

    render(<Controls />);

    expect(screen.getByText(/Sacar Número/)).not.toBeDisabled();
  });

  it('renders buttons with compact sizing classes', () => {
    mockStore.mockImplementation((selector: (s: Partial<GameState>) => unknown) =>
      selector(createMockState())
    );

    const { container } = render(<Controls />);
    const buttons = container.querySelectorAll('button');

    expect(buttons.length).toBe(2);
    buttons.forEach((btn) => {
      // Verify compact button sizing: px-4 py-2 mobile, md:px-6 md:py-3 medium+
      expect(btn.className).toContain('px-4');
      expect(btn.className).toContain('py-2');
      expect(btn.className).toContain('md:px-6');
      expect(btn.className).toContain('md:py-3');
    });
  });

  it('renders controls in horizontal flex-row layout', () => {
    mockStore.mockImplementation((selector: (s: Partial<GameState>) => unknown) =>
      selector(createMockState())
    );

    const { container } = render(<Controls />);
    const controlsContainer = container.firstChild as HTMLElement;

    expect(controlsContainer?.className).toContain('flex-row');
    expect(controlsContainer?.className).toContain('gap-3');
  });
});
