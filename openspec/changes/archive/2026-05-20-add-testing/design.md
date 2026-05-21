# Design: Add Test Infrastructure

## Technical Approach

Install Vitest + Testing Library as the test stack for the SantaEthnea Vite 8 + React 19 project. Configure Vitest to reuse the existing Vite config (minus the PWA plugin), set up jsdom with mocks for browser APIs (AudioContext, matchMedia), and establish testing patterns for both the Zustand store (unit tests with fake timers) and React components (rendering tests with mocked store selectors).

## Architecture Decisions

| Decision | Option | Tradeoff | Decision |
|----------|--------|----------|----------|
| Test runner | Vitest vs Jest | Vitest is Vite-native, ESM-first, 10-100x faster; Jest requires more config for Vite | **Vitest** |
| DOM environment | jsdom vs happy-dom | jsdom has broader API coverage and is @testing-library's default; happy-dom is faster but less complete | **jsdom** |
| Timer control | vi.useFakeTimers() vs real delays | Fake timers give deterministic, instant tests for the store's setTimeout-based transitions | **Fake timers** |
| PWA plugin in tests | Include vs exclude | VitePWA registers service workers that break test runs; must exclude from vitest config | **Exclude** |
| Zustand mocking | vi.mock() vs test-specific store | vi.mock() is simpler and matches how components import the store directly | **vi.mock()** |

## Data Flow

```
  vitest.config.ts (extends vite.config.ts, excludes PWA)
        │
        ├── src/test/setup.ts (globals: jest-dom, AudioContext mock, matchMedia mock)
        │
        ├── stores/gameStore.test.ts
        │       └── vi.useFakeTimers() → vi.advanceTimersByTimeAsync() → assert state
        │
        └── components/*.test.tsx
                └── vi.mock('../stores/gameStore') → render(<Component />) → assert DOM
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Modify | Add test scripts + devDependencies |
| `vitest.config.ts` | Create | Vitest config: jsdom, globals, setupFiles, v8 coverage, no PWA |
| `src/test/setup.ts` | Create | Global test setup: jest-dom import, AudioContext mock, matchMedia mock |
| `tsconfig.app.json` | Modify | Add `vitest/globals` to types array |
| `tsconfig.node.json` | Modify | Add `vitest.config.ts` to include |
| `src/stores/gameStore.test.ts` | Create | Store unit tests: initial state, transitions, guard clauses, reset |
| `src/components/Board.test.tsx` | Create | Component tests: renders 75 cells, highlights drawn/current |
| `src/components/Controls.test.tsx` | Create | Component tests: button states, click handlers, disabled logic |
| `src/components/History.test.tsx` | Create | Component tests: empty state, renders recent numbers |

## Interfaces / Contracts

No new interfaces. Tests consume existing `BingoState` and `DrawPhase` types from `gameStore.ts`.

### Vitest Config Contract

```ts
// vitest.config.ts — must NOT include VitePWA plugin
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: { provider: 'v8' },
  },
})
```

### Store Mock Pattern for Components

```ts
vi.mock('../stores/gameStore', () => ({
  useBingoStore: vi.fn((selector) =>
    selector({
      drawnNumbers: [1, 2, 3],
      currentNumber: 3,
      startDraw: vi.fn(),
      resetGame: vi.fn(),
      drawPhase: 'idle',
      isFinished: false,
      availableNumbers: Array.from({ length: 72 }, (_, i) => i + 4),
    })
  ),
}))
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit (store) | Initial state, createNumberPool (75 items), shuffleArray (same items, different order), startDraw phase transitions (idle→spinning→revealing→revealed), guard clauses (can't start while busy, can't start when empty), resetGame (full state reset), finish condition (availableNumbers.length === 0) | `vi.useFakeTimers()` + `vi.advanceTimersByTimeAsync(1000)` then `vi.advanceTimersByTimeAsync(800)` + state assertions |
| Component (Board) | Renders 75 number cells, highlights drawn numbers, highlights current number with distinct styling | `render(<Board />)` + `screen.getAllByText()` + data-testid or role queries |
| Component (Controls) | Start button disabled when busy/finished/empty, reset button disabled when busy, click handlers called | `render(<Controls />)` + `userEvent.click()` + mock fn assertions |
| Component (History) | Empty state message when no draws, shows last 10 reversed, count display | `render(<History />)` + text assertions |

**Exclusions**: Do NOT test Tailwind class names, CSS animations, or visual styles. Test DOM presence, attributes, and behavior only.

## Migration / Rollout

No migration required. This is greenfield test infrastructure.

## Open Questions

- [ ] Should SpinWheel.test.tsx be included in this change or deferred? (It has AudioContext + complex inline styles — needs the most mocking)
- [ ] Should we add `@vitest/coverage-v8` as a separate devDependency or rely on vitest's built-in coverage? (vitest 3.x bundles v8 coverage)
