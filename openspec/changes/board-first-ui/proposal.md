# Proposal: Board-first UI Refactor

## Intent

The current layout inverts visual priorities: the SpinWheel (relevant for 1-2 seconds per draw) dominates the screen with 256-384px diameter and 4 simultaneous animations, while the Board (the main gameplay reference) is squeezed into a fixed 480-520px column with 32-40px cells. For projector/TV display, the Board must be the visual anchor.

## Scope

### In Scope
- Refactor App.tsx layout: Board full-width at top, badge + controls + history below
- Create `CurrentNumberBadge.tsx`: compact circle (80-100px) with subtle pulse, replaces SpinWheel
- Update Board.tsx: larger cells (w-12 h-12 lg:w-14 lg:h-14), larger fonts (text-xl lg:text-2xl)
- Update Controls.tsx: compact buttons (px-4 py-2 md:px-6 md:py-3), horizontal layout
- Update History.tsx: thinner strip, smaller badges
- Simplify or remove SpinWheel.tsx animations (keep component optional)

### Out of Scope
- Game logic changes (gameStore.ts stays untouched)
- New features
- Automated UI tests (none exist currently)

## Capabilities

### New Capabilities
- None — pure UI layout refactor, no new behavioral capabilities

### Modified Capabilities
- `component-tests`: Board rendering scenarios may need updated styling assertions (cell sizes, layout structure). Semantic requirements (drawn=green, current=red, pulse) remain unchanged.

## Approach

1. **App.tsx**: Replace two-column layout with vertical stack — Board full-width at top, compact section below with badge + controls + history strip
2. **CurrentNumberBadge.tsx**: New component — simple circle (80-100px), displays current number, subtle CSS pulse animation, uses bingo-red for current state
3. **Board.tsx**: Increase cell sizes from w-8/w-10 to w-12/w-14, fonts from text-sm/text-base to text-xl/text-2xl, keep grid-cols-10/15
4. **Controls.tsx**: Reduce button padding from px-8/py-4 to px-4/py-2 (md: px-6/py-3), horizontal flex layout
5. **History.tsx**: Thinner container, reduce badge size from 40-48px to 28-32px
6. **SpinWheel.tsx**: Remove or comment out complex animations (wheelSpin, numberReveal, pulseGlow, pointerBounce); keep as optional fallback

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/App.tsx` | Modified | Layout restructure: vertical stack instead of two-column |
| `src/components/Board.tsx` | Modified | Larger cells and fonts |
| `src/components/Controls.tsx` | Modified | Compact button sizing |
| `src/components/History.tsx` | Modified | Thinner strip, smaller badges |
| `src/components/SpinWheel.tsx` | Modified | Animation simplification |
| `src/components/CurrentNumberBadge.tsx` | New | Compact current-number display |
| `src/index.css` | Modified | May need custom grid or animation tweaks |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| SpinWheel inline styles are complex and entangled | Medium | Simplify incrementally; keep original as commented fallback |
| Tailwind responsive classes break at intermediate breakpoints | Medium | Manual testing at 768px, 1024px, 1280px |
| Board full-width looks empty on large screens | Low | Add max-width constraint (max-w-4xl) with centering |
| Estimated 200-300 changed lines may approach review budget | Low | Single PR, cohesive change, within 400-line budget |

## Rollback Plan

1. Revert the single PR — all changes are UI-only, no data migration
2. SpinWheel.tsx animations can be restored by uncommenting/reverting that file
3. No database or API changes to rollback

## Dependencies

- None — pure frontend refactor

## Success Criteria

- [ ] Board occupies full width at top of viewport on desktop (1024px+)
- [ ] Board cells are legible from 3+ meters (48-56px minimum)
- [ ] SpinWheel replaced by badge ≤ 100px diameter
- [ ] Controls fit in a single horizontal bar
- [ ] History renders as thin strip below Board
- [ ] No game logic regressions (all existing tests pass)
- [ ] Total changed lines ≤ 400
