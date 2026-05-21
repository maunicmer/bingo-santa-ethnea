# Design: Board-first UI Refactor

## Technical Approach

Replace the two-column lg:flex-row layout in App.tsx with a single vertical stack: Header → Board (full-width, max-w-4xl) → CurrentNumberBadge → Controls (horizontal) → History (thin strip). Delete SpinWheel.tsx and CurrentNumber.tsx (both are oversized display components replaced by the new compact badge). Update Board, Controls, and History with responsive sizing. No gameStore changes — pure UI refactor.

## Architecture Decisions

| Decision | Option A | Option B | Selected | Rationale |
|----------|----------|----------|----------|-----------|
| SpinWheel fate | Delete file | Keep but don't import | **Delete** | 216 lines of dead code with complex inline styles, conic-gradients, 4 keyframes, and Web Audio. No rollback value — the new badge is simpler and the file can be restored from git. |
| CurrentNumber.tsx fate | Delete | Keep as fallback | **Delete** | 152 lines of radial-gradient bingo ball with 3 keyframes. Same fate as SpinWheel — replaced by CurrentNumberBadge. |
| Board max-width | max-w-4xl | max-w-6xl | **max-w-4xl** | Prevents excessive cell stretching on ultrawide monitors. 4xl (896px) gives ~56px cells at 15 columns with gaps — matches the lg:w-14 spec. |
| Controls layout | Horizontal flex | Stacked on mobile | **Horizontal flex, always** | Saves vertical space for the Board. Buttons are compact enough (px-4 py-2) to fit side-by-side even on mobile. |
| Badge animation | animate-pulse (Tailwind) | Custom keyframe | **animate-pulse** | Subtle enough to not distract from Board. No need for custom keyframes — keeps CSS minimal. |
| Badge sound | Migrate from SpinWheel | No sound | **No sound** | Sound was tied to SpinWheel's reveal animation. The Board's red pulse on current number is sufficient feedback. Sound can be re-added later if needed. |

## Data Flow

```
  useBingoStore (unchanged)
    ├── drawnNumbers ──→ Board (green cells) + History (badge strip)
    ├── currentNumber ──→ Board (red pulse cell) + CurrentNumberBadge (big circle)
    ├── drawPhase ──→ Controls (disabled state, "Girando...") + CurrentNumberBadge (idle/revealed)
    └── isFinished ──→ Controls (disabled) + CurrentNumberBadge (shows "FIN")
```

No store changes. Components read from the same selectors.

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/App.tsx` | Modify | Replace lg:flex-row two-column with vertical flex-col stack. Remove SpinWheel import. Add CurrentNumberBadge import. |
| `src/components/CurrentNumberBadge.tsx` | Create | Compact circular badge (w-20 h-20 md:w-24 md:h-24). Shows "—" when idle, number when revealed with bingo-red bg + animate-pulse. Reads currentNumber + drawPhase from store. |
| `src/components/Board.tsx` | Modify | Cell sizes: w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14. Fonts: text-lg md:text-xl lg:text-2xl. Gap: gap-1.5 md:gap-2. Container: max-w-4xl mx-auto. Remove "Tablero" heading (saves vertical space). |
| `src/components/Controls.tsx` | Modify | Button sizes: px-4 py-2 md:px-6 md:py-3. Font: text-sm md:text-base. Remove flex-wrap, use flex-row gap-3. Keep all disabled logic and "Girando..." text. |
| `src/components/History.tsx` | Modify | Badge sizes: w-8 h-8 md:w-10 md:h-10. Font: text-xs md:text-sm. Container: min-h-[48px] md:min-h-[56px]. Remove heading, use overflow-x-auto for horizontal scroll. |
| `src/components/SpinWheel.tsx` | Delete | Replaced by CurrentNumberBadge. 216 lines of complex animations removed. |
| `src/components/CurrentNumber.tsx` | Delete | Alternative display component, also replaced by CurrentNumberBadge. 152 lines removed. |
| `src/components/CurrentNumberBadge.test.tsx` | Create | Tests: idle state shows "—", revealed state shows number with bingo-red, no spin-wheel elements present. |
| `src/components/Board.test.tsx` | Modify | Update cell size assertions: w-10/w-12/w-14 instead of w-8/w-10. |
| `src/components/Controls.test.tsx` | Modify | Update button size assertions: px-4/py-2 instead of px-8/py-4. |
| `src/components/History.test.tsx` | Modify | Update badge size assertions: w-8/w-10 instead of w-10/w-12. |

## New Component: CurrentNumberBadge

```tsx
// src/components/CurrentNumberBadge.tsx
import { useBingoStore } from '../stores/gameStore';

export const CurrentNumberBadge = () => {
  const currentNumber = useBingoStore((state) => state.currentNumber);
  const drawPhase = useBingoStore((state) => state.drawPhase);
  const isFinished = useBingoStore((state) => state.isFinished);
  const isRevealed = drawPhase === 'revealed';

  return (
    <div className="flex justify-center py-2">
      <div
        className={`
          flex items-center justify-center
          w-20 h-20 md:w-24 md:h-24
          rounded-full font-bold
          transition-all duration-300
          ${isRevealed && currentNumber
            ? 'bg-bingo-red text-white text-3xl md:text-4xl animate-pulse'
            : 'bg-white/10 text-white/40 text-3xl md:text-4xl'
          }
        `}
      >
        {isFinished ? 'FIN' : isRevealed && currentNumber ? currentNumber : '—'}
      </div>
    </div>
  );
};
```

## New App.tsx Layout

```tsx
// src/App.tsx (structure)
import { CurrentNumberBadge } from './components/CurrentNumberBadge';
import { Board } from './components/Board';
import { Controls } from './components/Controls';
import { History } from './components/History';

function App() {
  return (
    <div className="min-h-screen bg-bingo-blue flex flex-col">
      <header className="text-center py-4 md:py-6">
        <h1 className="text-4xl md:text-6xl font-bold text-bingo-gold tracking-wide">
          Bingo Santa Ethnea
        </h1>
      </header>

      <main className="flex-1 flex flex-col gap-4 px-4 md:px-8 pb-4">
        <Board />
        <CurrentNumberBadge />
        <Controls />
        <History />
      </main>
    </div>
  );
}
```

## Responsive Breakpoints

| Breakpoint | Board Cell | Badge | Controls Font | History Badge |
|------------|-----------|-------|---------------|---------------|
| <768px (mobile) | w-10 h-10 (40px) | w-20 h-20 (80px) | text-sm | w-8 h-8 (32px) |
| 768-1024px (tablet) | w-12 h-12 (48px) | w-24 h-24 (96px) | text-base | w-10 h-10 (40px) |
| >1024px (desktop) | w-14 h-14 (56px) | w-24 h-24 (96px) | text-base | w-10 h-10 (40px) |

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | CurrentNumberBadge idle/revealed states | Vitest + Testing Library, mock store selectors |
| Unit | Board cell sizing classes | Verify className includes w-10/w-12/w-14 at breakpoints |
| Unit | Controls horizontal layout | Verify flex-row, gap-3, compact button sizes |
| Unit | History thin strip | Verify min-height, horizontal overflow, badge sizes |
| Unit | SpinWheel/CurrentNumber deleted | No import errors, no references in App.tsx |
| Manual | Responsive at 3 breakpoints | Browser devtools at 375px, 768px, 1024px, 1440px |
| Manual | Projector readability | Verify Board cells legible from 3+ meters at 1024px+ |

## Migration / Rollout

No migration required. Single PR, UI-only changes. Rollback: `git revert` restores all deleted files.

## Open Questions

- [ ] Should the emoji 🎉 be kept in the header or removed for cleaner look? (cosmetic, non-blocking)
- [ ] Should History show the count "(X/75)" in the thin strip or drop it entirely? (spec says minimal, suggest dropping)
