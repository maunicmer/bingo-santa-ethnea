import { useBingoStore } from '../stores/gameStore';

export const CurrentNumberBadge = () => {
  const currentNumber = useBingoStore((state) => state.currentNumber);
  const drawPhase = useBingoStore((state) => state.drawPhase);

  const isRevealed = currentNumber !== null && drawPhase === 'revealed';

  return (
    <div
      className={[
        'w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center',
        isRevealed
          ? 'bg-bingo-red text-white text-3xl md:text-4xl font-bold animate-pulse'
          : 'bg-white/20 text-white/60 text-3xl md:text-4xl font-bold',
      ].join(' ')}
      data-testid="current-number-badge"
    >
      {isRevealed ? currentNumber : '\u2014'}
    </div>
  );
};
