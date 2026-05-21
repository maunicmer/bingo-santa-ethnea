import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { GameState } from './types/game';
import { useBingoStore } from './stores/gameStore';

vi.mock('./stores/gameStore', () => ({
  useBingoStore: vi.fn(),
}));

const mockStore = vi.mocked(useBingoStore);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('App', () => {
  const createMockState = (overrides = {}) => ({
    drawnNumbers: [],
    currentNumber: null,
    drawPhase: 'idle' as const,
    isFinished: false,
    availableNumbers: Array.from({ length: 75 }, (_, i) => i + 1),
    startDraw: vi.fn(),
    resetGame: vi.fn(),
    ...overrides,
  });

  it('renders the app header with title', () => {
    mockStore.mockImplementation((selector: (s: Partial<GameState>) => unknown) =>
      selector(createMockState())
    );

    render(<App />);

    expect(screen.getByText(/Bingo Santa Ethnea/)).toBeInTheDocument();
  });

  it('uses vertical stack layout (flex-col)', () => {
    mockStore.mockImplementation((selector: (s: Partial<GameState>) => unknown) =>
      selector(createMockState())
    );

    const { container } = render(<App />);
    const main = container.querySelector('main');

    expect(main).toBeInTheDocument();
    expect(main?.className).toContain('flex-col');
  });

  it('renders Board as the primary element', () => {
    mockStore.mockImplementation((selector: (s: Partial<GameState>) => unknown) =>
      selector(createMockState())
    );

    render(<App />);

    // Board renders a heading "Tablero"
    expect(screen.getByText('Tablero')).toBeInTheDocument();
    // Board renders cells 1-75
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('renders CurrentNumberBadge component', () => {
    mockStore.mockImplementation((selector: (s: Partial<GameState>) => unknown) =>
      selector(createMockState())
    );

    render(<App />);

    // CurrentNumberBadge shows "—" in idle state
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('renders Controls component with action buttons', () => {
    mockStore.mockImplementation((selector: (s: Partial<GameState>) => unknown) =>
      selector(createMockState())
    );

    render(<App />);

    expect(screen.getByText(/Sacar Número/)).toBeInTheDocument();
    expect(screen.getByText(/Nueva Partida/)).toBeInTheDocument();
  });

  it('renders History component with empty state', () => {
    mockStore.mockImplementation((selector: (s: Partial<GameState>) => unknown) =>
      selector(createMockState())
    );

    render(<App />);

    expect(screen.getByText('Aún no salió ningún número')).toBeInTheDocument();
  });

  it('renders components in correct vertical order: Board → Badge → Controls → History', () => {
    mockStore.mockImplementation((selector: (s: Partial<GameState>) => unknown) =>
      selector(createMockState())
    );

    const { container } = render(<App />);
    const main = container.querySelector('main');

    // Get all direct children of main
    const children = Array.from(main?.children || []);

    // First child should be the Board wrapper (contains "Tablero")
    expect(children[0]?.textContent).toContain('Tablero');
    // Second child should be the badge (contains "—")
    expect(children[1]?.textContent).toContain('—');
    // Third child should be controls (contains "Sacar Número")
    expect(children[2]?.textContent).toContain('Sacar Número');
    // Fourth child should be history (contains "Aún no salió")
    expect(children[3]?.textContent).toContain('Aún no salió');
  });
});
