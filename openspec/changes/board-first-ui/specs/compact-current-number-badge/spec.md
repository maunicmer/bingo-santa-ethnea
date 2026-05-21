# Compact Current Number Badge Specification

## Purpose

Defines the compact badge component that replaces the SpinWheel, displaying the current drawn number in a minimal visual footprint.

## Requirements

### Requirement: Badge Display States

The badge SHALL display the current number prominently when revealed, and a placeholder when idle.

#### Scenario: Badge shows current number when revealed

- **GIVEN**: A number has been drawn and revealed (drawPhase is 'revealed')
- **WHEN**: The badge component is rendered
- **THEN**: The current number is displayed prominently in the badge center
- **AND**: The badge uses bingo-red background with white text

#### Scenario: Badge shows placeholder when idle

- **GIVEN**: No number has been drawn yet (drawPhase is 'idle')
- **WHEN**: The badge component is rendered
- **THEN**: The badge displays a placeholder ("—") or empty state indicator

### Requirement: Badge Size and Appearance

The badge SHALL be a compact circle between 80-100px in diameter with subtle animation on new reveals.

#### Scenario: Badge dimensions

- **GIVEN**: The badge component is rendered
- **WHEN**: The badge container is measured
- **THEN**: The badge diameter is between 80px and 100px
- **AND**: The badge is circular in shape

#### Scenario: Pulse animation on new number reveal

- **GIVEN**: A new number is just revealed (transition from 'spinning' to 'revealed')
- **WHEN**: The badge renders the new number
- **THEN**: A subtle CSS pulse animation is triggered
- **AND**: The animation completes within 1-2 seconds

### Requirement: Badge Excludes SpinWheel Features

The badge SHALL NOT include any SpinWheel-specific visual elements.

#### Scenario: No spinning animations

- **GIVEN**: The badge component is rendered
- **WHEN**: The component styles are inspected
- **THEN**: No wheelSpin animation is present
- **AND**: No pointerBounce animation is present
- **AND**: No decorative dots or spinning elements are rendered

#### Scenario: No pointer element

- **GIVEN**: The badge component is rendered
- **WHEN**: The DOM is inspected
- **THEN**: No pointer or arrow element is present
- **AND**: No numberReveal animation overlay is present
