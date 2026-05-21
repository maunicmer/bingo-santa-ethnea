# Implementation Tasks: add-testing

## Task: 1. Install test dependencies
- **Phase**: 1 — Infrastructure
- **Files**: `package.json` (devDependencies section)
- **Description**: Install vitest, @testing-library/react, @testing-library/jest-dom, @testing-library/user-event, jsdom, and @vitest/coverage-v8 as devDependencies. Run `npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/coverage-v8`.
- **Acceptance**: `npm ls vitest @testing-library/react jsdom` shows installed packages with no errors.
- **Estimated lines**: +6 (package.json devDependencies)

---

## Task: 2. Create vitest.config.ts
- **Phase**: 1 — Infrastructure
- **Files**: `vitest.config.ts` (create)
- **Description**: Create Vitest configuration that: reuses the Vite react plugin, excludes VitePWA, sets environment to jsdom, configures globals (describe, it, expect, vi), points setupFiles to `src/test/setup.ts`, and configures v8 coverage provider.
- **Acceptance**: `npx vitest run` executes without config errors (even with zero tests).
- **Estimated lines**: +20 (new file)

---

## Task: 3. Create src/test/setup.ts
- **Phase**: 1 — Infrastructure
- **Files**: `src/test/setup.ts` (create)
- **Description**: Create global test setup file that: imports `@testing-library/jest-dom` for extended matchers, mocks `AudioContext` and `webkitAudioContext` as no-op constructors, mocks `window.matchMedia` for Tailwind/media query compatibility, and exports a pre-configured `userEvent.setup()` helper.
- **Acceptance**: Tests can use `toBeInTheDocument()`, `toHaveClass()`, and no AudioContext errors occur during test runs.
- **Estimated lines**: +25 (new file)

---

## Task: 4. Update tsconfig files for vitest types
- **Phase**: 1 — Infrastructure
- **Files**: `tsconfig.app.json` (modify), `tsconfig.node.json` (modify)
- **Description**: Add `"vitest/globals"` to the `types` array in `tsconfig.app.json` so test files recognize `describe`, `it`, `expect`, `vi` without imports. Add `"vitest.config.ts"` to the `include` array in `tsconfig.node.json` so the config file is type-checked.
- **Acceptance**: `npx tsc --noEmit` passes with no errors on test files and vitest.config.ts.
- **Estimated lines**: +2 modified (tsconfig.app.json types array), +1 modified (tsconfig.node.json include array)

---

## Task: 5. Add test scripts to package.json
- **Phase**: 1 — Infrastructure
- **Files**: `package.json` (modify scripts section)
- **Description**: Add three npm scripts: `"test": "vitest run"`, `"test:watch": "vitest"`, `"test:coverage": "vitest run --coverage"`.
- **Acceptance**: `npm test` runs all tests, `npm run test:watch` starts watch mode, `npm run test:coverage` generates coverage report.
- **Estimated lines**: +3 modified (package.json scripts)

---

## Task: 6. Test initial state and createNumberPool
- **Phase**: 2 — Store Tests
- **Files**: `src/stores/gameStore.test.ts` (create)
- **Description**: Write unit tests for: (a) fresh store initializes with empty drawnNumbers, null currentNumber, 'idle' drawPhase, and 75 availableNumbers; (b) createNumberPool returns exactly 75 elements containing integers 1–75. Use Zustand store directly without mocking.
- **Acceptance**: `npm test` passes these scenarios. Each assertion independently verifies the spec requirements.
- **Estimated lines**: +35 (new file section)

---

## Task: 7. Test shuffleArray
- **Phase**: 2 — Store Tests
- **Files**: `src/stores/gameStore.test.ts` (modify — append)
- **Description**: Export `shuffleArray` from gameStore (or test via store initialization). Test that: (a) shuffled array preserves all original elements (same length, same set); (b) shuffled order differs from input for arrays with 3+ elements (run multiple iterations to avoid flaky false negatives).
- **Acceptance**: Tests pass deterministically. Element preservation test uses Set comparison. Order-change test runs 10 iterations.
- **Estimated lines**: +25 (append to existing file)

---

## Task: 8. Test startDraw phase transitions with fake timers
- **Phase**: 2 — Store Tests
- **Files**: `src/stores/gameStore.test.ts` (modify — append)
- **Description**: Write tests using `vi.useFakeTimers()` that verify the timed sequence: (a) calling startDraw() immediately sets drawPhase to 'spinning'; (b) after advancing 1000ms, drawPhase becomes 'revealing'; (c) after advancing 800ms more, drawPhase becomes 'revealed', currentNumber is set, number is moved from pool to drawnNumbers. Use `vi.advanceTimersByTime()` for synchronous control.
- **Acceptance**: Tests pass with fake timers. Each phase transition is verified at the exact timing boundary. Store state assertions confirm number pool mutation.
- **Estimated lines**: +55 (append to existing file)

---

## Task: 9. Test guard clauses, resetGame, and finish condition
- **Phase**: 2 — Store Tests
- **Files**: `src/stores/gameStore.test.ts` (modify — append)
- **Description**: Write tests for: (a) calling startDraw() while phase is 'spinning' is a no-op; (b) calling startDraw() with empty pool sets isFinished=true; (c) last number in pool triggers isFinished=true after cycle completes; (d) resetGame() restores all state to initial values with a freshly shuffled pool.
- **Acceptance**: All guard clause scenarios pass. resetGame test verifies pool is reshuffled (75 numbers, not the same order as before reset).
- **Estimated lines**: +50 (append to existing file)

---

## Task: 10. Test Board component rendering and highlights
- **Phase**: 3 — Component Tests
- **Files**: `src/components/Board.test.tsx` (create)
- **Description**: Write component tests that mock `useBingoStore` via `vi.mock()`. Test: (a) renders exactly 75 number cells; (b) each cell displays its number (1–75); (c) drawn numbers (e.g., [5, 12, 30]) have green-related CSS class (`bg-bingo-green`); (d) undrawn numbers do NOT have green class; (e) current number with phase 'revealed' has red class (`bg-bingo-red`) and `animate-pulse`.
- **Acceptance**: `npm test` passes all Board scenarios. Store is mocked per test to isolate rendering behavior.
- **Estimated lines**: +55 (new file)

---

## Task: 11. Test Controls component buttons and disabled states
- **Phase**: 3 — Component Tests
- **Files**: `src/components/Controls.test.tsx` (create)
- **Description**: Write component tests that mock `useBingoStore` via `vi.mock()`. Test: (a) "Sacar Número" button calls startDraw on click when idle; (b) "Nueva Partida" button calls resetGame on click; (c) "Sacar Número" is disabled when drawPhase is 'spinning'; (d) "Sacar Número" is disabled when isFinished is true; (e) "Sacar Número" is disabled when availableNumbers is empty. Use `userEvent.click()` for interactions.
- **Acceptance**: `npm test` passes all Controls scenarios. Mock functions verify store action calls. Disabled attribute assertions pass.
- **Estimated lines**: +65 (new file)

---

## Task: 12. Test History component empty state and reverse order
- **Phase**: 3 — Component Tests
- **Files**: `src/components/History.test.tsx` (create)
- **Description**: Write component tests that mock `useBingoStore` via `vi.mock()`. Test: (a) empty drawnNumbers shows "Aún no salió ningún número" text; (b) with 15 drawn numbers [1..15], displays last 10 in reverse order [15, 14, ..., 6]; (c) numbers 1–5 are NOT displayed; (d) header shows count "(15/75)".
- **Acceptance**: `npm test` passes all History scenarios. Reverse order assertion verifies correct slicing.
- **Estimated lines**: +50 (new file)

---

## Review Workload Forecast

| Metric | Value |
|--------|-------|
| Total estimated new lines | ~380 |
| Total estimated modified lines | ~12 |
| **Total changed lines** | **~392** |
| Chained PRs recommended | **No** (within 400-line budget) |
| 400-line budget risk | **Low** (392/400 = 98% — borderline, but acceptable) |
| Decision needed before apply | **No** |

### Task Dependency Order

```
Task 1 (install deps)
  → Task 2 (vitest.config.ts)
    → Task 3 (setup.ts)
      → Task 4 (tsconfig updates)
        → Task 5 (package.json scripts)
          → Task 6 (store: initial state)
            → Task 7 (store: shuffleArray)
              → Task 8 (store: phase transitions)
                → Task 9 (store: guards + reset)
                  → Task 10 (Board tests)
                    → Task 11 (Controls tests)
                      → Task 12 (History tests)
```

### Phase Grouping

- **Phase 1 (Tasks 1–5)**: Infrastructure — ~56 new lines, ~6 modified lines
- **Phase 2 (Tasks 6–9)**: Store Tests — ~165 new lines, ~0 modified lines
- **Phase 3 (Tasks 10–12)**: Component Tests — ~170 new lines, ~0 modified lines

### Contingency

If estimates exceed 400 lines during apply, split into:
- **PR 1**: Phase 1 + Phase 2 (Tasks 1–9) — ~221 new + ~6 modified = ~227 lines
- **PR 2**: Phase 3 (Tasks 10–12) — ~170 new lines
