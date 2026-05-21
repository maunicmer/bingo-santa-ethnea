# Thin History Strip Specification

## Purpose

Defines the history component as a thin horizontal strip displaying the last drawn numbers with minimal vertical height.

## Requirements

### Requirement: History Display Format

The history SHALL display the last 10 drawn numbers in a horizontal row with smaller badge sizing.

#### Scenario: Shows last 10 numbers horizontally

- **GIVEN**: The store has 15 drawn numbers
- **WHEN**: The History component is rendered
- **THEN**: The last 10 numbers are displayed in a horizontal row
- **AND**: Numbers are shown in reverse chronological order (most recent first)

#### Scenario: History badge sizing

- **GIVEN**: The History component is rendered
- **WHEN**: History badges are measured
- **THEN**: Badges are w-8 h-8 on mobile
- **AND**: Badges are md:w-10 md:h-10 on medium screens and above
- **AND**: Badges are smaller than Board cells

### Requirement: Empty State

The history SHALL display a message when no numbers have been drawn.

#### Scenario: Empty state message

- **GIVEN**: The store's drawnNumbers array is empty
- **WHEN**: The History component is rendered
- **THEN**: The text "Aún no salió ningún número" is displayed
- **AND**: No badge elements are rendered

### Requirement: Most Recent Highlight

The most recently drawn number SHALL be visually highlighted in the history strip.

#### Scenario: Most recent number highlighted

- **GIVEN**: The store has at least one drawn number
- **WHEN**: The History component is rendered
- **THEN**: The first displayed number (most recent) has bingo-red styling
- **AND**: Other history numbers do not have bingo-red styling

### Requirement: Minimal Vertical Height

The history strip SHALL occupy minimal vertical space.

#### Scenario: Thin container

- **GIVEN**: The History component is rendered
- **WHEN**: The container height is measured
- **THEN**: The container height is minimized (single row of badges)
- **AND**: No excessive padding or margins are present vertically
