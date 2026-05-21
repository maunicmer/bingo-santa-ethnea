# Component Tests Specification

## Purpose

Defines the test coverage for Board, Controls, and History React components, verifying their rendered output, store integration, and user interactions.

## Requirements

### Requirement: Board Rendering

The Board component MUST render all 75 bingo numbers and visually distinguish drawn/current numbers.

#### Scenario: Renders all 75 cells

- **GIVEN**: The Board component is rendered
- **WHEN**: The DOM is queried for number cells
- **THEN**: Exactly 75 cells are present
- **AND**: Each cell displays a number from 1 to 75

#### Scenario: Highlights drawn numbers

- **GIVEN**: The store has drawn numbers (e.g., [5, 12, 30])
- **WHEN**: The Board component is rendered
- **THEN**: Cells for numbers 5, 12, and 30 have green styling or a green-related CSS class
- **AND**: Cells for undrawn numbers do NOT have green styling

#### Scenario: Highlights current number

- **GIVEN**: The store has a `currentNumber` (e.g., 42) and `drawPhase` is `'revealed'`
- **WHEN**: The Board component is rendered
- **THEN**: The cell for number 42 has red styling or a red-related CSS class
- **AND**: The cell has a pulse animation applied

### Requirement: Controls Rendering and Interaction

The Controls component MUST render action buttons that trigger store methods and respect disabled states.

#### Scenario: Sacar Número button triggers draw

- **GIVEN**: The Controls component is rendered with `drawPhase` = `'idle'` and `isFinished` = `false`
- **WHEN**: The "Sacar Número" button is clicked
- **THEN**: The store's `startDraw()` action is called

#### Scenario: Nueva Partida button triggers reset

- **GIVEN**: The Controls component is rendered
- **WHEN**: The "Nueva Partida" button is clicked
- **THEN**: The store's `resetGame()` action is called

#### Scenario: Sacar Número is disabled during active draw

- **GIVEN**: The Controls component is rendered with `drawPhase` = `'spinning'`
- **WHEN**: The "Sacar Número" button is inspected
- **THEN**: The button is disabled

#### Scenario: Sacar Número is disabled when game is finished

- **GIVEN**: The Controls component is rendered with `isFinished` = `true`
- **WHEN**: The "Sacar Número" button is inspected
- **THEN**: The button is disabled

### Requirement: History Rendering

The History component MUST display drawn numbers in reverse chronological order.

#### Scenario: Empty state message

- **GIVEN**: The store's `drawnNumbers` array is empty
- **WHEN**: The History component is rendered
- **THEN**: The text "Aún no salió ningún número" is displayed

#### Scenario: Shows last 10 numbers in reverse order

- **GIVEN**: The store has 15 drawn numbers: [1, 2, 3, ..., 15]
- **WHEN**: The History component is rendered
- **THEN**: The displayed numbers are [15, 14, 13, 12, 11, 10, 9, 8, 7, 6] (last 10, most recent first)
- **AND**: Numbers 1-5 are NOT displayed

### Requirement: Store Mocking

All component tests MUST mock the gameStore selectors to isolate component behavior.

#### Scenario: Mocked selectors per test

- **GIVEN**: A component test is written
- **WHEN**: The component is rendered
- **THEN**: The gameStore's selector functions are mocked to return controlled test values
- **AND**: No real store instance is shared between tests
