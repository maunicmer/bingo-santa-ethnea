# Compact Controls Specification

## Purpose

Defines the compact horizontal control bar with reduced button sizing, replacing the previous stacked button layout.

## Requirements

### Requirement: Horizontal Button Layout

The controls SHALL render buttons in a single horizontal row, not stacked vertically.

#### Scenario: Buttons in horizontal row

- **GIVEN**: The Controls component is rendered
- **WHEN**: The layout is inspected
- **THEN**: "Sacar Número" and "Nueva Partida" buttons are in a horizontal flex row
- **AND**: Buttons are not stacked vertically

### Requirement: Compact Button Sizing

Button dimensions SHALL be reduced from the previous sizing for a more compact appearance.

#### Scenario: Sacar Número button sizing

- **GIVEN**: The Controls component is rendered
- **WHEN**: The "Sacar Número" button is measured
- **THEN**: Padding is px-4 py-2 on mobile
- **AND**: Padding is md:px-6 md:py-3 on medium screens and above

#### Scenario: Nueva Partida button sizing

- **GIVEN**: The Controls component is rendered
- **WHEN**: The "Nueva Partida" button is measured
- **THEN**: Padding matches the compact sizing (px-4 py-2 / md:px-6 md:py-3)

### Requirement: Button Disabled States

Buttons SHALL be disabled appropriately based on the current game state.

#### Scenario: Sacar Número disabled during spinning

- **GIVEN**: The drawPhase is 'spinning' or 'revealing'
- **WHEN**: The Controls component is rendered
- **THEN**: The "Sacar Número" button is disabled
- **AND**: Button text changes to "Girando..."

#### Scenario: Sacar Número disabled when game finished

- **GIVEN**: isFinished is true
- **WHEN**: The Controls component is rendered
- **THEN**: The "Sacar Número" button is disabled

#### Scenario: Buttons enabled during idle state

- **GIVEN**: The drawPhase is 'idle' and isFinished is false
- **WHEN**: The Controls component is rendered
- **THEN**: The "Sacar Número" button is enabled
- **AND**: The "Nueva Partida" button is enabled

### Requirement: Controls Position

The controls row SHALL be positioned below the badge in the vertical layout stack.

#### Scenario: Controls below badge

- **GIVEN**: The application is rendered with an active game
- **WHEN**: The layout flow is inspected
- **THEN**: The Controls element appears below the Badge element
- **AND**: The Controls element appears above the History element
