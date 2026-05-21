import { useBingoStore } from '../stores/gameStore';

export const History = () => {
  const drawnNumbers = useBingoStore((state) => state.drawnNumbers);
  const lastNumbers = [...drawnNumbers].reverse().slice(0, 10);

  if (drawnNumbers.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 min-h-[48px] md:min-h-[56px] flex items-center justify-center">
        <p className="text-white/50 text-xs md:text-sm">Aún no salió ningún número</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 min-h-[48px] md:min-h-[56px]">
      <div className="flex flex-row gap-2 items-center overflow-x-auto">
        {lastNumbers.map((num, index) => (
          <div
            key={`${num}-${index}`}
            className={`
              flex items-center justify-center flex-shrink-0
              w-8 h-8 md:w-10 md:h-10
              rounded-full font-bold text-xs md:text-sm
              ${index === 0
                ? 'bg-bingo-red text-white'
                : 'bg-bingo-yellow text-bingo-blue'
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
