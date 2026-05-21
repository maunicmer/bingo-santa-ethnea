import { useBingoStore } from '../stores/gameStore';

const TOTAL_NUMBERS = 75;

export const Board = () => {
  const drawnNumbers = useBingoStore((state) => state.drawnNumbers);
  const currentNumber = useBingoStore((state) => state.currentNumber);

  const isDrawn = (num: number) => drawnNumbers.includes(num);
  const isCurrent = (num: number) => num === currentNumber;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6">
      <h2 className="text-bingo-yellow text-lg md:text-xl font-bold mb-4 text-center">
        Tablero
      </h2>
      <div className="grid grid-cols-10 md:grid-cols-15 gap-1.5 md:gap-2 lg:gap-3">
        {Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1).map((num) => (
          <div
            key={num}
            className={`
              flex items-center justify-center
              aspect-square w-full rounded-lg font-bold
              text-xl md:text-2xl lg:text-3xl xl:text-4xl
              transition-all duration-300
              ${isCurrent(num)
                ? 'bg-bingo-red text-white scale-125 shadow-lg animate-pulse'
                : isDrawn(num)
                  ? 'bg-bingo-green text-white'
                  : 'bg-white/20 text-white/60'
              }
            `}
          >
            {num}
          </div>
        ))}
      </div>
    </div>
  );
};
