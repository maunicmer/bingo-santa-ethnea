# Game Store Tests Specification

## Purpose

Defines the unit test coverage for the Zustand game store (`gameStore.ts`), including number pool management, shuffle logic, draw phase transitions, and reset behavior.

## Requirements

### Requirement: Number Pool Creation

The `createNumberPool()` function MUST generate a complete bingo number pool.

#### Scenario: Returns array 1-75

- **GIVEN**: `createNumberPool()` is called
- **WHEN**: The function executes
- **THEN**: The returned array contains exactly 75 elements
- **AND**: Elements are the integers 1 through 75 (order may vary)

### Requirement: Shuffle Logic

The `shuffleArray()` function MUST randomize array order while preserving all elements.

#### Scenario: Preserves all elements

- **GIVEN**: An array of N unique elements
- **WHEN**: `shuffleArray()` is called on it
- **THEN**: The shuffled array has the same length N
- **AND**: Every original element appears exactly once in the result

#### Scenario: Produces different order

- **GIVEN**: An array with 3+ elements
- **WHEN**: `shuffleArray()` is called
- **THEN**: The resulting order differs from the input order (probabilistic)

### Requirement: Reset Game

The `resetGame()` action MUST restore the store to its initial state.

#### Scenario: Clears all drawn numbers

- **GIVEN**: The store has drawn numbers (drawnNumbers is non-empty)
- **WHEN**: `resetGame()` is called
- **THEN**: `drawnNumbers` is an empty array
- **AND**: `currentNumber` is `null`
- **AND**: `drawPhase` is `'idle'`
- **AND**: The number pool is reshuffled to 75 numbers

### Requirement: Start Draw Phase Transitions

The `startDraw()` action MUST execute a timed sequence of phase transitions.

#### Scenario: Normal draw cycle

- **GIVEN**: `drawPhase` is `'idle'` and the number pool is non-empty
- **WHEN**: `startDraw()` is called
- **THEN**: `drawPhase` transitions to `'spinning'` immediately
- **AND**: After 1000ms, `drawPhase` transitions to `'revealing'`
- **AND**: After 800ms more, `drawPhase` transitions to `'revealed'`
- **AND**: `currentNumber` is set to a number from the pool
- **AND**: The drawn number is added to `drawnNumbers`
- **AND**: The number is removed from the pool

#### Scenario: Guard against concurrent draws

- **GIVEN**: `drawPhase` is NOT `'idle'` (e.g., `'spinning'`)
- **WHEN**: `startDraw()` is called
- **THEN**: No state changes occur (the call is a no-op)

#### Scenario: Empty pool ends game

- **GIVEN**: The number pool is empty
- **WHEN**: `startDraw()` is called
- **THEN**: No phase transition occurs
- **AND**: `isFinished` is set to `true`

### Requirement: Game Completion

The store MUST correctly track when the game is finished.

#### Scenario: Last number triggers finished

- **GIVEN**: The pool has exactly 1 number remaining
- **WHEN**: `startDraw()` is called and completes its cycle
- **THEN**: `isFinished` becomes `true`
- **AND**: The last number is added to `drawnNumbers`

### Requirement: Initial Store State

The store MUST initialize with a well-defined default state.

#### Scenario: Default state values

- **GIVEN**: A fresh store instance is created
- **WHEN**: State is read immediately
- **THEN**: `drawnNumbers` is an empty array
- **AND**: `currentNumber` is `null`
- **AND**: `drawPhase` is `'idle'`
- **AND**: The number pool contains 75 numbers

### Requirement: Fake Timer Usage

Tests MUST use Vitest fake timers to control `setTimeout`-based transitions.

#### Scenario: Timer control in tests

- **GIVEN**: A test calls `vi.useFakeTimers()`
- **WHEN**: `vi.advanceTimersByTime(1000)` is called after `startDraw()`
- **THEN**: The `'spinning'` → `'revealing'` transition executes synchronously
- **AND**: `vi.advanceTimersByTime(800)` triggers `'revealing'` → `'revealed'`
