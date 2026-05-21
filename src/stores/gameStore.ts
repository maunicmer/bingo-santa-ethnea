import { create } from 'zustand';

export type DrawPhase = 'idle' | 'spinning' | 'revealing' | 'revealed';

export interface BingoState {
  availableNumbers: number[];
  drawnNumbers: number[];
  currentNumber: number | null;
  isFinished: boolean;
  drawPhase: DrawPhase;
  
  startDraw: () => void;
  revealNumber: () => void;
  resetGame: () => void;
}

const TOTAL_NUMBERS = 75;

export const createNumberPool = (): number[] => {
  return Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1);
};

export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const useBingoStore = create<BingoState>((set, get) => ({
  availableNumbers: shuffleArray(createNumberPool()),
  drawnNumbers: [],
  currentNumber: null,
  isFinished: false,
  drawPhase: 'idle',

  startDraw: () => {
    const { availableNumbers, drawPhase } = get();
    
    if ((drawPhase !== 'idle' && drawPhase !== 'revealed') || availableNumbers.length === 0) return;

    set({ drawPhase: 'spinning' });

    // Fase de giro: 1 segundo
    setTimeout(() => {
      set({ drawPhase: 'revealing' });
      
      // Fase de revelación: 0.8 segundos
      setTimeout(() => {
        const { availableNumbers: currentAvailable, drawnNumbers } = get();
        if (currentAvailable.length === 0) {
          set({ isFinished: true, drawPhase: 'idle' });
          return;
        }
        
        const [nextNumber, ...remaining] = currentAvailable;
        
        set({
          availableNumbers: remaining,
          drawnNumbers: [...drawnNumbers, nextNumber],
          currentNumber: nextNumber,
          isFinished: remaining.length === 0,
          drawPhase: 'revealed',
        });
      }, 800);
    }, 1000);
  },

  revealNumber: () => {
    // No-op, la revelación es automática por timer
  },

  resetGame: () => {
    set({
      availableNumbers: shuffleArray(createNumberPool()),
      drawnNumbers: [],
      currentNumber: null,
      isFinished: false,
      drawPhase: 'idle',
    });
  },
}));
