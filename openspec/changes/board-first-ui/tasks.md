# Board-first UI Refactor — Implementation Tasks

> **Change**: `board-first-ui`
> **Specs**: 5 spec files under `openspec/changes/board-first-ui/specs/`
> **Design**: `openspec/changes/board-first-ui/design.md`
> **Stack**: Vite 8 + React 19 + TypeScript 6 + Zustand 5 + TailwindCSS 4 + Vitest

---

## Task: 1. Delete SpinWheel.tsx and remove from App.tsx ✅

- **Phase**: 1 — Cleanup
- **Files**: `src/components/SpinWheel.tsx` (delete), `src/App.tsx` (modify)
- **Description**: Delete the 216-line SpinWheel component entirely. Remove its import and `<SpinWheel />` usage from App.tsx. App.tsx will temporarily have a broken layout (SpinWheel gone but not yet replaced with vertical stack) — this is intentional; Task 5 fixes it.
- **Acceptance**:
  - `src/components/SpinWheel.tsx` does not exist ✅
  - `src/App.tsx` has no import or reference to SpinWheel ✅
  - `npm run build` succeeds (no type errors) ✅
- **Estimated lines**: 0 new + 5 modified + 216 deleted = **221 changed**
- **Verification**: `ls src/components/SpinWheel.tsx` → file not found; `grep -r SpinWheel src/` → no results ✅

---

## Task: 2. Delete CurrentNumber.tsx (dead code) ✅

- **Phase**: 1 — Cleanup
- **Files**: `src/components/CurrentNumber.tsx` (delete)
- **Description**: Delete the 152-line CurrentNumber component. It is not imported anywhere (verified: only its own export references it). No other files need changes.
- **Acceptance**:
  - `src/components/CurrentNumber.tsx` does not exist ✅
  - No broken imports or references anywhere in `src/` ✅
  - `npm run build` succeeds ✅
- **Estimated lines**: 0 new + 0 modified + 152 deleted = **152 changed**
- **Verification**: `ls src/components/CurrentNumber.tsx` → file not found; `grep -r CurrentNumber src/` → no results ✅

---

## Task: 3. Create CurrentNumberBadge.tsx

- **Phase**: 2 — New Component
- **Files**: `src/components/CurrentNumberBadge.tsx` (create)
- **Description**: Create a compact circular badge component (~35 lines) that displays the current drawn number. States:
  - **Revealed**: Shows number with `bg-bingo-red text-white`, 80-100px diameter circle, subtle pulse animation (1-2s)
  - **Idle**: Shows "—" placeholder
  - Uses `useBingoStore` to read `currentNumber`
  - No SpinWheel features (no wheelSpin, pointerBounce, numberReveal, pointer element, decorative dots)
- **Acceptance**:
  - Component renders a circular div with current number or "—"
  - Pulse animation present on revealed state
  - No wheel/pointer/decorative elements in DOM
  - TypeScript compiles with no errors
- **Estimated lines**: 35 new + 0 modified + 0 deleted = **35 changed**
- **Verification**: `npx tsc --noEmit` passes; component renders correctly in isolation

---

## Task: 4. Write CurrentNumberBadge.test.tsx

- **Phase**: 2 — New Component
- **Files**: `src/components/CurrentNumberBadge.test.tsx` (create)
- **Description**: Write component tests following existing mock pattern (`vi.mock('../stores/gameStore')`). Test cases:
  - Renders "—" placeholder when currentNumber is null (idle state)
  - Renders current number when currentNumber is set (revealed state)
  - Has `bg-bingo-red` class when revealed
  - Does NOT contain SpinWheel elements (no pointer, no wheel, no decorative dots)
  - Pulse animation class present on revealed state
- **Acceptance**:
  - All 5 test cases pass with `npm test`
  - Uses same mock pattern as existing tests
  - No SpinWheel-related DOM elements found in rendered output
- **Estimated lines**: 55 new + 0 modified + 0 deleted = **55 changed**
- **Verification**: `npm test -- CurrentNumberBadge` → all pass

---

## Task: 5. Refactor App.tsx to vertical stack layout ✅

- **Phase**: 3 — Layout Refactor
- **Files**: `src/App.tsx` (modify)
- **Description**: Replace the two-column `flex-row lg:flex-row` layout with a single vertical column. New structure:
  ```
  Header (unchanged)
  └─ main: flex-col, items-center
      ├─ Board (full-width, max-w-4xl, centered)
      ├─ CurrentNumberBadge
      ├─ Controls
      └─ History
  ```
  - Remove `lg:flex-row` and the two-column wrapper divs ✅
  - Add `CurrentNumberBadge` import and usage (deferred to PR 2 — Badge not yet created)
  - Board gets `max-w-4xl mx-auto w-full` ✅
  - Main content uses `flex flex-col gap-4 md:gap-6 px-4 md:px-8 pb-4` ✅
- **Acceptance**:
  - Single vertical column layout (no `flex-row` anywhere) ✅
  - Board has `max-w-4xl` class ✅
  - All four components render in correct order: Board → Badge → Controls → History (Badge deferred to PR 2)
  - `npm run build` succeeds ✅
- **Estimated lines**: 0 new + 20 modified + 1 deleted (SpinWheel import already removed) = **21 changed**
- **Verification**: `npm run build` passes; visual inspection shows vertical stack ✅

---

## Task: 6. Update Board.tsx: larger cells and fonts ✅

- **Phase**: 3 — Layout Refactor
- **Files**: `src/components/Board.tsx` (modify)
- **Description**: Scale up Board cells for projector readability per spec breakpoints:
  - **Mobile (<768px)**: `w-10 h-10`, `text-lg` (was: `w-8 h-8`, `text-sm`)
  - **Tablet (768-1024px)**: `md:w-12 md:h-12`, `md:text-xl`
  - **Desktop (>1024px)**: `lg:w-14 lg:h-14`, `lg:text-2xl`
  - Keep grid layout: `grid-cols-10 md:grid-cols-15`
  - Keep existing color logic (bingo-red for current, bingo-green for drawn, white/20 for undrawn)
- **Acceptance**:
  - Cell sizes match spec breakpoints ✅
  - Font sizes match spec breakpoints ✅
  - All 75 numbers still render correctly ✅
  - Color logic unchanged ✅
- **Estimated lines**: 0 new + 4 modified + 0 deleted = **4 changed**
- **Verification**: `npm test -- Board` → existing tests pass; visual check of cell sizes ✅

---

## Task: 7. Update Controls.tsx: compact horizontal layout

- **Phase**: 3 — Layout Refactor
- **Files**: `src/components/Controls.tsx` (modify)
- **Description**: Make buttons compact and ensure horizontal layout:
  - Container: `flex flex-row gap-3 md:gap-4 justify-center items-center` (was: `flex flex-wrap`)
  - "Sacar Número" button: `px-4 py-2 md:px-6 md:py-3 text-base md:text-lg` (was: `px-8 py-4 md:px-12 md:py-6 text-xl md:text-2xl`)
  - "Nueva Partida" button: `px-4 py-2 md:px-6 md:py-3 text-base md:text-lg` (was: `px-6 py-4 md:px-8 md:py-6 text-lg md:text-xl`)
  - Keep all disabled state logic unchanged
  - Keep "Girando..." text during spinning phase
  - Remove inline SVG spinner (simplify to text-only during spinning)
- **Acceptance**:
  - Buttons render in horizontal row (not stacked)
  - Compact sizing matches spec (`px-4 py-2` mobile)
  - Disabled states work correctly (spinning, revealing, finished, empty)
  - "Girando..." text shows during spinning
- **Estimated lines**: 0 new + 15 modified + 0 deleted = **15 changed**
- **Verification**: `npm test -- Controls` → existing tests pass; visual check of button sizes

---

## Task: 8. Update History.tsx: thinner strip, smaller badges

- **Phase**: 3 — Layout Refactor
- **Files**: `src/components/History.tsx` (modify)
- **Description**: Make History a thinner horizontal strip with smaller badges:
  - Container: reduce padding `p-3 md:p-4` (was: `p-4 md:p-6`), reduce `min-h` for empty state
  - Badges: `w-8 h-8 md:w-10 md:h-10` (was: `w-10 h-10 md:w-12 md:h-12`)
  - Font: `text-sm md:text-base` (was: `text-lg md:text-xl`)
  - Keep horizontal row layout, reverse chronological order
  - Keep bingo-red highlight on most recent number
  - Keep empty state message
- **Acceptance**:
  - Badges are smaller than Board cells at all breakpoints
  - Single row container, minimal vertical height
  - Most recent number has `bg-bingo-red`
  - Empty state shows "Aún no salió ningún número"
- **Estimated lines**: 0 new + 10 modified + 0 deleted = **10 changed**
- **Verification**: `npm test -- History` → existing tests pass; visual check of badge sizes

---

## Task: 9. Update Board.test.tsx for new cell sizes

- **Phase**: 4 — Test Updates
- **Files**: `src/components/Board.test.tsx` (modify)
- **Description**: Update existing tests to account for new cell sizing classes. The existing tests check for color classes (`bg-bingo-green`, `bg-bingo-red`, `animate-pulse`, `scale-125`, `bg-white/20`) which remain unchanged. Add one new test:
  - Verify cell has responsive sizing classes (`w-12`, `md:w-12`, `lg:w-14`)
  - Verify font has responsive sizing classes (`text-xl`, `lg:text-2xl`)
- **Acceptance**:
  - All existing tests pass (color assertions unchanged)
  - New sizing assertions pass
  - `npm test -- Board` → all pass
- **Estimated lines**: 8 new + 2 modified + 0 deleted = **10 changed**
- **Verification**: `npm test -- Board` → all pass

---

## Task: 10. Update Controls.test.tsx for compact button assertions

- **Phase**: 4 — Test Updates
- **Files**: `src/components/Controls.test.tsx` (modify)
- **Description**: Add test assertions for compact button sizing and horizontal layout:
  - Verify buttons have compact padding classes (`px-4`, `py-2`)
  - Verify container uses `flex-row` (not `flex-wrap`)
  - Existing behavioral tests (click handlers, disabled states) remain unchanged
- **Acceptance**:
  - All existing tests pass (behavioral tests unchanged)
  - New sizing/layout assertions pass
  - `npm test -- Controls` → all pass
- **Estimated lines**: 8 new + 2 modified + 0 deleted = **10 changed**
- **Verification**: `npm test -- Controls` → all pass

---

## Task: 11. Update History.test.tsx for smaller badge assertions

- **Phase**: 4 — Test Updates
- **Files**: `src/components/History.test.tsx` (modify)
- **Description**: Add test assertions for smaller badge sizing:
  - Verify badges have smaller sizing classes (`w-8`, `h-8`, `md:w-10`, `md:h-10`)
  - Verify font is smaller (`text-sm`, `md:text-base`)
  - Existing behavioral tests (empty state, reverse order, count, red highlight) remain unchanged
- **Acceptance**:
  - All existing tests pass (behavioral tests unchanged)
  - New sizing assertions pass
  - `npm test -- History` → all pass
- **Estimated lines**: 8 new + 2 modified + 0 deleted = **10 changed**
- **Verification**: `npm test -- History` → all pass

---

## Review Workload Forecast

| Metric | Value |
|---|---|
| **Total new lines** | ~106 |
| **Total modified lines** | ~70 |
| **Total deleted lines** | ~369 |
| **Total changed lines** | **~545** |
| **Chained PRs recommended** | **Yes** |
| **400-line budget risk** | **High** (545 > 400) |
| **Decision needed before apply** | **Yes** — confirm chained PR split strategy |

### Recommended Chained PR Split

| PR | Tasks | Changed Lines | Focus |
|---|---|---|---|
| **PR 1: Cleanup** | 1, 2 | 373 (all deleted) | Remove dead code — pure deletion, trivial review |
| **PR 2: Badge + Layout** | 3, 4, 5, 6 | 115 (90 new + 25 mod) | New component + App layout refactor |
| **PR 3: Compact UI** | 7, 8 | 25 (all modified) | Controls + History sizing updates |
| **PR 4: Tests** | 9, 10, 11 | 30 (24 new + 6 mod) | Test updates for new sizing |

### Risks

1. **App.tsx temporal break**: After Task 1 (SpinWheel deleted), App.tsx layout is broken until Task 5. If PRs are merged independently, PR 1 alone will cause a runtime error. **Mitigation**: Tasks 1-2 should be merged together with Task 5 in a single PR, OR Task 5 should be included in PR 1.
2. **Revised split** (safer):
   - **PR 1: Cleanup + Layout** — Tasks 1, 2, 5, 6 (399 lines) — borderline but acceptable
   - **PR 2: Badge** — Tasks 3, 4 (90 lines)
   - **PR 3: Compact UI** — Tasks 7, 8 (25 lines)
   - **PR 4: Tests** — Tasks 9, 10, 11 (30 lines)

---

## Execution Order

```
Task 1 ──┐
Task 2 ──┤
         ├──→ Task 5 ──→ Task 6 ──┐
         │                        ├──→ Task 7 ──→ Task 8
Task 3 ──┘                        │
Task 4 ───────────────────────────┘
                                   ├──→ Task 9
                                   ├──→ Task 10
                                   └──→ Task 11
```

Tasks 1-2 can run in parallel. Task 5 depends on both. Tasks 3-4 can run in parallel with 1-2-5-6. Tasks 7-8 depend on Task 5. Tasks 9-11 depend on their respective component tasks.
