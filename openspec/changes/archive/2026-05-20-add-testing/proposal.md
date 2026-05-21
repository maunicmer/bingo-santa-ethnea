# Proposal: Add test infrastructure

## Intent

SantaEthnea has zero test coverage. The game store (`gameStore.ts`) contains non-trivial async logic with `setTimeout`-based phase transitions that are fragile without tests. Core UI components (Board, Controls, History) render derived store state but are untested. Adding a test framework prevents regressions as the game logic evolves.

## Scope

### In Scope
- Install vitest, @testing-library/react, @testing-library/jest-dom, jsdom, @testing-library/user-event
- Create `vitest.config.ts` (extends vite config, excludes PWA plugin, sets up jsdom)
- Create `src/test/setup.ts` (jest-dom matchers, AudioContext mock, user-event export)
- Add scripts to `package.json`: `test`, `test:watch`, `test:coverage`
- Write gameStore unit tests (~10-12 tests): phase transitions, number pool, shuffle, draw, reset
- Write Board, Controls, History component tests (~8-10 tests): render store state, button interactions
- Verify all tests pass via `npm test`

### Out of Scope
- SpinWheel tests (heavy CSS animations, lower priority)
- Dead code cleanup (CurrentNumber.tsx, Drum.tsx, types/game.ts — separate change)
- E2E tests (Playwright — future)

## Capabilities

### New Capabilities
- `testing-infrastructure`: Vitest + Testing Library setup, config, scripts, mocks
- `game-store-tests`: Unit tests for gameStore (phase transitions, pool management, draw logic)
- `component-tests`: Tests for Board, Controls, History components

### Modified Capabilities
- None

## Approach

1. Install dev dependencies via npm
2. Create `vitest.config.ts` that reuses the existing vite config but strips `vite-plugin-pwa` (incompatible with jsdom)
3. Create `src/test/setup.ts` with global jest-dom import, `AudioContext`/`webkitAudioContext` mock stubs, and a pre-configured `userEvent` export
4. Write store tests first (highest value, no DOM dependency) — use `vi.useFakeTimers()` for setTimeout-driven phase transitions
5. Write component tests using `@testing-library/react` with a test harness that wraps components in a Zustand provider or creates a fresh store per test
6. Run `npm test` to verify green

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `package.json` | Modified | Add test scripts and devDependencies |
| `vitest.config.ts` | New | Vitest config extending vite, excluding PWA |
| `src/test/setup.ts` | New | Global test setup, mocks, user-event |
| `src/stores/__tests__/gameStore.test.ts` | New | Store unit tests |
| `src/components/__tests__/Board.test.tsx` | New | Board component tests |
| `src/components/__tests__/Controls.test.tsx` | New | Controls component tests |
| `src/components/__tests__/History.test.tsx` | New | History component tests |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| `setTimeout` in store requires fake timers | Medium | `vi.useFakeTimers()` + `vi.advanceTimersByTime()` per phase |
| PWA plugin conflicts with vitest/jsdom | High | Explicitly exclude `vite-plugin-pwa` in vitest.config.ts |
| Web Audio API calls in components | Medium | Global mock in setup.ts stubs `AudioContext` |
| ~350-400 changed lines near review budget | Medium | Single PR acceptable; split if review exceeds 400 lines |

## Rollback Plan

1. Revert the commit(s) adding test infrastructure
2. Remove `vitest.config.ts`, `src/test/`, and `__tests__/` directories
3. Remove test scripts and devDependencies from `package.json`
4. Run `npm install` to clean up node_modules

No production code is modified — rollback is safe and isolated to test files and config.

## Dependencies

- Node.js 20+ (already required by project)
- npm (package manager)

## Success Criteria

- [ ] `npm test` runs all tests with zero failures
- [ ] `npm run test:coverage` produces a coverage report
- [ ] Store tests cover: init, startDraw phase transitions (idle→shuffling→drawing→complete), reset, number pool behavior
- [ ] Component tests verify: Board renders drawn numbers, Controls triggers store actions, History displays past draws
- [ ] No PWA or AudioContext errors in test output
