# Delta for Component Tests

## ADDED Requirements

### Requirement: Board-first Layout Rendering

The application layout SHALL render as a vertical stack with Board full-width at top, followed by Badge, Controls, and History.

#### Scenario: Vertical stack layout structure

- **GIVEN**: The App component is rendered
- **WHEN**: The DOM structure is inspected
- **THEN**: The Board element is the first child of the main container
- **AND**: The Badge element follows the Board
- **AND**: The Controls element follows the Badge
- **AND**: The History element follows the Controls
- **AND**: No two-column or grid layout is present

#### Scenario: Board full-width on desktop

- **GIVEN**: The App component is rendered on a viewport >1024px
- **WHEN**: The Board container width is measured
- **THEN**: The Board spans full available width with max-w-4xl constraint
- **AND**: The Board is horizontally centered

### Requirement: CurrentNumberBadge Rendering

The CurrentNumberBadge component SHALL render as a compact circle displaying the current number, replacing the SpinWheel.

#### Scenario: Badge renders current number

- **GIVEN**: The CurrentNumberBadge component is rendered with currentNumber=42 and drawPhase='revealed'
- **WHEN**: The component is inspected
- **THEN**: The number "42" is displayed
- **AND**: The badge has bingo-red background styling
- **AND**: The badge is circular with 80-100px diameter

#### Scenario: Badge renders placeholder when idle

- **GIVEN**: The CurrentNumberBadge component is rendered with no currentNumber and drawPhase='idle'
- **WHEN**: The component is inspected
- **THEN**: A placeholder ("—") is displayed

#### Scenario: Badge has no SpinWheel elements

- **GIVEN**: The CurrentNumberBadge component is rendered
- **WHEN**: The DOM is inspected for SpinWheel-specific elements
- **THEN**: No wheel spin animation classes are present
- **AND**: No pointer element exists
- **AND**: No decorative dots are rendered

### Requirement: Compact Controls Layout

The Controls component SHALL render buttons in a compact horizontal row.

#### Scenario: Horizontal button layout

- **GIVEN**: The Controls component is rendered
- **WHEN**: The button container layout is inspected
- **THEN**: Buttons are arranged in a horizontal flex row
- **AND**: Buttons are not stacked vertically

#### Scenario: Compact button sizing

- **GIVEN**: The Controls component is rendered
- **WHEN**: Button padding is measured
- **THEN**: "Sacar Número" button has px-4 py-2 padding on mobile
- **AND**: "Sacar Número" button has md:px-6 md:py-3 padding on medium+ screens

#### Scenario: Button text during spinning

- **GIVEN**: The Controls component is rendered with drawPhase='spinning'
- **WHEN**: The "Sacar Número" button text is inspected
- **THEN**: The button text is "Girando..."
- **AND**: The button is disabled

### Requirement: Thin History Strip

The History component SHALL render as a thin horizontal strip with smaller badges.

#### Scenario: Horizontal history row

- **GIVEN**: The History component is rendered with 5 drawn numbers
- **WHEN**: The layout is inspected
- **THEN**: Numbers are displayed in a horizontal row
- **AND**: Badges are w-8 h-8 on mobile, md:w-10 md:h-10 on medium+

#### Scenario: Most recent highlighted

- **GIVEN**: The History component is rendered with drawn numbers
- **WHEN**: The first badge is inspected
- **THEN**: It has bingo-red styling
- **AND**: Subsequent badges do not have bingo-red styling

## MODIFIED Requirements

### Requirement: Board Rendering

The Board component MUST render all 75 bingo numbers and visually distinguish drawn/current numbers, with larger cell and font sizing for projector readability.
(Previously: Board renders all 75 numbers with standard cell sizing w-8/w-10 and text-sm/text-base fonts)

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
- **AND**: Cell sizing is w-12 h-12 on mobile, lg:w-14 lg:h-14 on large screens
- **AND**: Font sizing is text-xl on mobile, lg:text-2xl on large screens
