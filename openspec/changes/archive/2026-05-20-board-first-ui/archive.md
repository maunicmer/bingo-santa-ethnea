# Archive: board-first-ui

**Change**: board-first-ui
**Archived**: 2026-05-21
**Status**: COMPLETE — PASS
**Execution mode**: interactive
**Chained PR strategy**: feature-branch-chain (4 PRs)

---

## Executive Summary

Refactored the SantaEthnea UI from a two-column layout dominated by an oversized SpinWheel (256-384px, 4 animations) to a board-first vertical stack layout. The Board is now the primary visual element at full width, with a compact CurrentNumberBadge (80-100px), compact Controls, and a thin History strip below. Deleted SpinWheel.tsx (216 lines) and CurrentNumber.tsx (152 lines). Pure UI refactor — zero game logic changes.

---

## Change Summary

### What was implemented
- Replaced two-column layout with vertical stack: Board → Badge → Controls → History
- Created `CurrentNumberBadge.tsx`: compact circle (80-100px) with subtle CSS pulse, replaces SpinWheel
- Updated `Board.tsx`: larger cells (w-10→w-12→w-14) and fonts (text-lg→text-xl→text-2xl) for projector readability
- Updated `Controls.tsx`: compact buttons (px-4 py-2 / md:px-6 md:py-3), horizontal flex row
- Updated `History.tsx`: thinner strip (w-8 h-8 / md:w-10 md:h-10 badges), no heading, min-h-[48px]
- Deleted `SpinWheel.tsx` (216 lines) and `CurrentNumber.tsx` (152 lines)
- Created `App.test.tsx` (7 tests) for layout verification
- Added test assertions for Board cell sizes, font sizes, Controls compact sizing, History thin strip

### Why
The current layout inverted visual priorities: SpinWheel dominated the screen for 1-2 seconds of relevance per draw, while the Board (the main gameplay reference) was squeezed into a fixed 480-520px column with 32-40px cells. For projector/TV display, the Board must be the visual anchor.

---

## Final Stats

| Metric | Value |
|--------|-------|
| **Total tests** | 62 (43 existing + 19 new) |
| **Test files** | 6 passed |
| **Files created** | `CurrentNumberBadge.tsx`, `CurrentNumberBadge.test.tsx`, `App.test.tsx` |
| **Files modified** | `App.tsx`, `Board.tsx`, `Controls.tsx`, `History.tsx` |
| **Files deleted** | `SpinWheel.tsx`, `CurrentNumber.tsx` |
| **Total changed lines** | ~545 (mostly deletions) |
| **TypeScript** | Clean (tsc --noEmit, zero errors) |
| **Review budget** | 400 lines (exceeded by ~145, mitigated by chained PRs) |

### Test Breakdown

| Test File | Tests | Status |
|-----------|-------|--------|
| App.test.tsx | 7 | ✅ Created from scratch |
| Board.test.tsx | 6 | ✅ +2 cell size/font assertions |
| CurrentNumberBadge.test.tsx | 5 | ✅ Created with component |
| Controls.test.tsx | 11 | ✅ +2 compact sizing tests |
| History.test.tsx | 8 | ✅ +3 thin strip tests |
| Drum.test.tsx | 25 | ✅ Unchanged |

---

## Chained PR Execution

| PR | Tasks | Lines | Status |
|----|-------|-------|--------|
| PR 1 | 1,2,5,6 (Cleanup + Layout) | 399 | ✅ Merged |
| PR 2 | 3,4 (New Badge Component) | 90 | ✅ Merged |
| PR 3 | 7,8 (Compact Controls + History) | 25 | ✅ Merged |
| PR 4 | 9,10,11 (Test Updates) | 30 | ✅ Merged |

---

## Verification Results

**Overall**: PASS

- **Completeness**: 11/11 tasks complete
- **Tests**: 62/62 pass, 0 failed, 0 skipped
- **Build**: TypeScript clean
- **Spec compliance**: 28/30 scenarios fully COMPLIANT, 2 PARTIAL

### Spec Compliance Summary

| Spec | Status | Notes |
|------|--------|-------|
| board-first-layout | ✅ COMPLIANT | Vertical stack, responsive sizing, full-width |
| compact-current-number-badge | ✅ COMPLIANT | Idle/revealed states, pulse, no spin animations |
| compact-controls | ✅ COMPLIANT | Horizontal row, compact sizing, disabled states |
| thin-history-strip | ✅ COMPLIANT | Thin strip, smaller badges, empty state, reverse order |
| component-tests (Delta) | ⚠️ PARTIAL | max-w-4xl test assertion gap (code exists, no test) |

---

## Known Issues

### WARNING (Non-blocking)

1. **max-w-4xl test assertion gap**: `App.tsx` has `max-w-4xl mx-auto w-full` on the Board wrapper, but `App.test.tsx` does not explicitly assert this class. The layout test verifies flex-col structure, so this is low risk.
   - **Mitigation**: Consider adding an explicit test assertion for `max-w-4xl` in a future change.
   - **Impact**: Low — the class is present in code, just untested.

### SUGGESTIONS

1. Board.tsx still has a "Tablero" heading — adds vertical space. Consider if this is desired for the board-first layout.
2. Consider adding explicit test assertion for `max-w-4xl` in `App.test.tsx`.

---

## Key Learnings

1. **Store name is `useBingoStore`**, not `useGameStore` — the store import path is `./stores/gameStore` but the hook is named `useBingoStore`.
2. **Zustand mock pattern**: `vi.mocked(useBingoStore).mockImplementation((selector) => selector(mockState))` — the mock must match the import path relative to the test file location.
3. **Controls button text changes to "Girando..."** during spinning and revealing phases — buttons are disabled with this text during active game phases.
4. **App.test.tsx didn't exist previously** — created from scratch for layout verification.
5. **Mock paths must match import paths** relative to test file location (`./stores/gameStore` from `src/`, not `../stores/gameStore`).
6. **CurrentNumber.tsx (152 lines) also existed** alongside SpinWheel.tsx (216 lines) — both are oversized display components that should be deleted together.
7. **Board currently has `grid-cols-10 md:grid-cols-15`**, not just `grid-cols-15` as initially assumed.
8. **Chained PRs mitigate review budget overflow**: ~545 total lines split across 4 PRs (399, 90, 25, 30) keeps each within reasonable review scope.

---

## Files Changed

### Created
- `src/components/CurrentNumberBadge.tsx` — Compact current number display (22 lines)
- `src/components/CurrentNumberBadge.test.tsx` — 5 tests for badge component
- `src/App.test.tsx` — 7 tests for layout verification

### Modified
- `src/App.tsx` — Vertical stack layout (flex-col), max-w-4xl Board wrapper
- `src/components/Board.tsx` — Larger cells and responsive fonts
- `src/components/Controls.tsx` — Compact buttons, horizontal flex row
- `src/components/History.tsx` — Thin strip, smaller badges, no heading

### Deleted
- `src/components/SpinWheel.tsx` — 216 lines of complex animations
- `src/components/CurrentNumber.tsx` — 152 lines oversized display

### Unchanged (verified)
- `src/stores/gameStore.ts` — Zero changes, pure UI refactor
- `src/components/Drum.tsx` — Unchanged
- `src/components/Drum.test.tsx` — 25 tests unchanged

---

## Rollback Plan

1. Revert the 4 chained PRs — all changes are UI-only, no data migration
2. SpinWheel.tsx and CurrentNumber.tsx can be restored by reverting PR 1
3. No database or API changes to rollback

---

## Next Steps

**None** — change is complete. All 11 tasks done, all tests pass, TypeScript clean.

Optional follow-ups (not blocking):
- Add explicit `max-w-4xl` test assertion in `App.test.tsx`
- Evaluate whether "Tablero" heading should be removed from Board

---

## Artifacts

| Artifact | Location |
|----------|----------|
| Proposal | `openspec/changes/board-first-ui/proposal.md` + Engram `sdd/board-first-ui/proposal` |
| Spec | `openspec/changes/board-first-ui/spec.md` + Engram `sdd/board-first-ui/spec` |
| Design | `openspec/changes/board-first-ui/design.md` + Engram `sdd/board-first-ui/design` |
| Tasks | `openspec/changes/board-first-ui/tasks.md` + Engram `sdd/board-first-ui/tasks` |
| Apply Progress | Engram `sdd/board-first-ui/apply-progress` |
| Verify Report | Engram `sdd/board-first-ui/verify-report` |
| Archive | `openspec/changes/archive/2026-05-20-board-first-ui/archive.md` + Engram `sdd/board-first-ui/archive-report` |
