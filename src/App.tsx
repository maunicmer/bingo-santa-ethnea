import { Board } from './components/Board';
import { Controls } from './components/Controls';
import { History } from './components/History';
import { CurrentNumberBadge } from './components/CurrentNumberBadge';

function App() {
  return (
    <div className="min-h-screen bg-bingo-blue flex flex-col">
      {/* Header */}
      <header className="text-center py-4 md:py-6">
        <h1 className="text-4xl md:text-6xl font-bold text-bingo-gold tracking-wide">
          🎉 Bingo Santa Ethnea 🎉
        </h1>
      </header>

      {/* Main Content - Vertical Stack */}
      <main className="flex-1 flex flex-col items-center gap-4 md:gap-6 px-4 md:px-8 pb-4">
        <div className="max-w-screen-xl mx-auto w-full">
          <Board />
        </div>
        <CurrentNumberBadge />
        <Controls />
        <History />
      </main>
    </div>
  );
}

export default App;
