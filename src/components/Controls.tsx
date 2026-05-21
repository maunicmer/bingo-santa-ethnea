import { useBingoStore } from '../stores/gameStore';

export const Controls = () => {
  const startDraw = useBingoStore((state) => state.startDraw);
  const resetGame = useBingoStore((state) => state.resetGame);
  const drawPhase = useBingoStore((state) => state.drawPhase);
  const isFinished = useBingoStore((state) => state.isFinished);
  const availableCount = useBingoStore((state) => state.availableNumbers.length);

  const isBusy = drawPhase === 'spinning' || drawPhase === 'revealing';

  return (
    <div className="flex flex-row gap-3 justify-center items-center p-2">
      <button
        onClick={startDraw}
        disabled={isFinished || availableCount === 0 || isBusy}
        className={`
          px-4 py-2 md:px-6 md:py-3
          text-sm md:text-base font-bold text-white
          rounded-xl shadow-md
          transition-all duration-200
          ${isFinished || availableCount === 0 || isBusy
            ? 'bg-gray-500 cursor-not-allowed opacity-60'
            : 'bg-bingo-red hover:bg-red-600 hover:scale-105 active:scale-95'
          }
        `}
      >
        {isBusy ? (
          <span className="flex items-center gap-1.5">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Girando...
          </span>
        ) : (
          '🎱 Sacar Número'
        )}
      </button>

      <button
        onClick={resetGame}
        disabled={isBusy}
        className={`
          px-4 py-2 md:px-6 md:py-3
          text-sm md:text-base font-bold text-bingo-blue
          rounded-xl shadow-md
          transition-all duration-200
          ${isBusy
            ? 'bg-gray-400 cursor-not-allowed opacity-60'
            : 'bg-bingo-gold hover:bg-yellow-400 hover:scale-105 active:scale-95'
          }
        `}
      >
        🔄 Nueva Partida
      </button>
    </div>
  );
};
