import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useBingoStore, createNumberPool, shuffleArray } from './gameStore';

// --- Task 6: Initial State ---

describe('gameStore — initial state', () => {
  it('has empty drawnNumbers', () => {
    expect(useBingoStore.getState().drawnNumbers).toEqual([]);
  });

  it('has null currentNumber', () => {
    expect(useBingoStore.getState().currentNumber).toBeNull();
  });

  it('has drawPhase idle', () => {
    expect(useBingoStore.getState().drawPhase).toBe('idle');
  });

  it('has isFinished false', () => {
    expect(useBingoStore.getState().isFinished).toBe(false);
  });

  it('has 75 available numbers', () => {
    expect(useBingoStore.getState().availableNumbers).toHaveLength(75);
  });
});

// --- Task 6: createNumberPool ---

describe('createNumberPool', () => {
  it('returns 75 numbers', () => {
    const pool = createNumberPool();
    expect(pool).toHaveLength(75);
  });

  it('contains all numbers 1-75', () => {
    const pool = createNumberPool();
    const sorted = [...pool].sort((a, b) => a - b);
    for (let i = 0; i < 75; i++) {
      expect(sorted[i]).toBe(i + 1);
    }
  });
});

// --- Task 7: shuffleArray ---

describe('shuffleArray', () => {
  it('preserves all elements', () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(original);
    expect([...shuffled].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5]);
  });

  it('preserves length', () => {
    const original = Array.from({ length: 100 }, (_, i) => i);
    expect(shuffleArray(original)).toHaveLength(100);
  });

  it('changes order probabilistically', () => {
    const original = Array.from({ length: 20 }, (_, i) => i + 1);
    let changed = 0;
    for (let i = 0; i < 10; i++) {
      const shuffled = shuffleArray(original);
      if (shuffled.some((v, idx) => v !== original[idx])) {
        changed++;
      }
    }
    expect(changed).toBeGreaterThan(0);
  });
});

// --- Helper: reset store to known state ---

const resetStore = () => {
  useBingoStore.setState({
    availableNumbers: shuffleArray(createNumberPool()),
    drawnNumbers: [],
    currentNumber: null,
    isFinished: false,
    drawPhase: 'idle',
  });
};

// --- Task 8: startDraw phase transitions ---

describe('startDraw — phase transitions', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetStore();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('transitions idle → spinning immediately', () => {
    useBingoStore.getState().startDraw();
    expect(useBingoStore.getState().drawPhase).toBe('spinning');
  });

  it('transitions spinning → revealing after 1000ms', async () => {
    useBingoStore.getState().startDraw();
    await vi.advanceTimersByTimeAsync(1000);
    expect(useBingoStore.getState().drawPhase).toBe('revealing');
  });

  it('transitions revealing → revealed after 800ms more', async () => {
    useBingoStore.getState().startDraw();
    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(800);
    expect(useBingoStore.getState().drawPhase).toBe('revealed');
  });

  it('sets currentNumber after reveal', async () => {
    useBingoStore.getState().startDraw();
    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(800);
    expect(useBingoStore.getState().currentNumber).not.toBeNull();
  });

  it('adds drawn number to drawnNumbers', async () => {
    useBingoStore.getState().startDraw();
    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(800);
    const { drawnNumbers, currentNumber } = useBingoStore.getState();
    expect(drawnNumbers).toContain(currentNumber);
  });

  it('removes drawn number from availableNumbers', async () => {
    const before = useBingoStore.getState().availableNumbers;
    useBingoStore.getState().startDraw();
    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(800);
    const { availableNumbers, currentNumber } = useBingoStore.getState();
    expect(availableNumbers).not.toContain(currentNumber);
    expect(availableNumbers).toHaveLength(before.length - 1);
  });
});

// --- Task 9: Guard clauses and finish condition ---

describe('startDraw — guard clauses', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    resetStore();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('does nothing when phase is spinning', () => {
    useBingoStore.getState().startDraw();
    const phaseBefore = useBingoStore.getState().drawPhase;
    useBingoStore.getState().startDraw();
    expect(useBingoStore.getState().drawPhase).toBe(phaseBefore);
  });

  it('does nothing when phase is revealing', async () => {
    useBingoStore.getState().startDraw();
    await vi.advanceTimersByTimeAsync(1000);
    expect(useBingoStore.getState().drawPhase).toBe('revealing');
    const drawnBefore = useBingoStore.getState().drawnNumbers.length;
    useBingoStore.getState().startDraw();
    expect(useBingoStore.getState().drawnNumbers).toHaveLength(drawnBefore);
  });

  it('does nothing and does not crash when pool is empty', () => {
    useBingoStore.setState({ availableNumbers: [], drawPhase: 'idle' });
    useBingoStore.getState().startDraw();
    expect(useBingoStore.getState().drawPhase).toBe('idle');
    expect(useBingoStore.getState().isFinished).toBe(false);
  });
});

describe('resetGame', () => {
  beforeEach(() => {
    resetStore();
  });

  it('clears drawnNumbers', async () => {
    vi.useFakeTimers();
    useBingoStore.getState().startDraw();
    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(800);
    vi.useRealTimers();

    expect(useBingoStore.getState().drawnNumbers.length).toBeGreaterThan(0);
    useBingoStore.getState().resetGame();
    expect(useBingoStore.getState().drawnNumbers).toEqual([]);
  });

  it('resets currentNumber to null', async () => {
    vi.useFakeTimers();
    useBingoStore.getState().startDraw();
    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(800);
    vi.useRealTimers();

    useBingoStore.getState().resetGame();
    expect(useBingoStore.getState().currentNumber).toBeNull();
  });

  it('reshuffles pool to 75 numbers', async () => {
    vi.useFakeTimers();
    useBingoStore.getState().startDraw();
    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(800);
    vi.useRealTimers();

    useBingoStore.getState().resetGame();
    expect(useBingoStore.getState().availableNumbers).toHaveLength(75);
  });

  it('sets drawPhase to idle', async () => {
    vi.useFakeTimers();
    useBingoStore.getState().startDraw();
    vi.useRealTimers();

    useBingoStore.getState().resetGame();
    expect(useBingoStore.getState().drawPhase).toBe('idle');
  });

  it('sets isFinished to false', () => {
    useBingoStore.setState({ isFinished: true });
    useBingoStore.getState().resetGame();
    expect(useBingoStore.getState().isFinished).toBe(false);
  });
});

describe('game completion — last number', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('sets isFinished when last number is drawn', async () => {
    useBingoStore.setState({
      availableNumbers: [42],
      drawnNumbers: Array.from({ length: 75 }, (_, i) => i + 1).filter(n => n !== 42),
      currentNumber: null,
      isFinished: false,
      drawPhase: 'idle',
    });

    useBingoStore.getState().startDraw();
    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(800);

    expect(useBingoStore.getState().isFinished).toBe(true);
    expect(useBingoStore.getState().drawnNumbers).toContain(42);
    expect(useBingoStore.getState().drawnNumbers).toHaveLength(75);
  });
});
