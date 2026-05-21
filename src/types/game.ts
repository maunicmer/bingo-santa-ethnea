export type DrawPhase = 'idle' | 'spinning' | 'revealing' | 'revealed';

export interface GameState {
  numbers: number[];
  drawnNumbers: number[];
  currentNumber: number | null;
  isPlaying: boolean;
  isFinished: boolean;
}

export type GameAction = 
  | { type: 'DRAW_NUMBER' }
  | { type: 'RESET_GAME' }
  | { type: 'TOGGLE_PLAYING' };
