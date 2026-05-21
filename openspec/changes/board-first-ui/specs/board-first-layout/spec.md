# Board-first Layout Specification

## Purpose

Defines the layout structure where the Board is the primary visual element, displayed full-width at the top of the viewport, with all other UI elements stacked vertically below it.

## Requirements

### Requirement: Board Primary Position

The Board SHALL occupy the full available width at the top of the viewport, positioned above all other UI elements (badge, controls, history).

#### Scenario: Board occupies full width on wide screens

- **GIVEN**: The application is rendered on a viewport wider than 1024px
- **WHEN**: The layout is rendered
- **THEN**: The Board container spans the full available width
- **AND**: The Board is centered with a max-width constraint (max-w-4xl)

#### Scenario: Board is positioned above all other elements

- **GIVEN**: The application is rendered with an active game
- **WHEN**: The DOM structure is inspected
- **THEN**: The Board element appears before the Badge element
- **AND**: The Badge element appears before the Controls element
- **AND**: The Controls element appears before the History element

#### Scenario: Vertical stack layout order

- **GIVEN**: The application is rendered
- **WHEN**: The layout flow is inspected top-to-bottom
- **THEN**: The order is: Board → Badge → Controls → History
- **AND**: No two-column or sidebar layout is present

### Requirement: Responsive Board Sizing

The Board cells SHALL scale appropriately across mobile, tablet, and desktop breakpoints for projector readability.

#### Scenario: Mobile board sizing (<768px)

- **GIVEN**: The viewport width is less than 768px
- **WHEN**: The Board is rendered
- **THEN**: The Board takes the full viewport width
- **AND**: Board cells are sized appropriately for mobile (minimum w-8 h-8)

#### Scenario: Tablet board sizing (768px-1024px)

- **GIVEN**: The viewport width is between 768px and 1024px
- **WHEN**: The Board is rendered
- **THEN**: Board cells are larger than mobile sizing (minimum w-12 h-12)
- **AND**: Board fonts are scaled up (minimum text-xl)

#### Scenario: Desktop board sizing (>1024px)

- **GIVEN**: The viewport width is greater than 1024px
- **WHEN**: The Board is rendered
- **THEN**: Board cells are maximized for projector readability (minimum w-14 h-14)
- **AND**: Board fonts are large (minimum text-2xl)
- **AND**: Cells are legible from 3+ meters distance
