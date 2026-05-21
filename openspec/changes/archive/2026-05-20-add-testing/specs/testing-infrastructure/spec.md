# Testing Infrastructure Specification

## Purpose

Defines the test framework setup for SantaEthnea: Vitest as the test runner, Testing Library for React component testing, jsdom as the DOM environment, and all supporting configuration, scripts, and mocks.

## Requirements

### Requirement: Test Runner Execution

The project MUST provide a working test runner invokable via npm scripts that executes all test files under `src/`.

#### Scenario: Run all tests

- **GIVEN**: The project has `*.test.ts` and `*.test.tsx` files under `src/`
- **WHEN**: `npm test` is executed
- **THEN**: Vitest runs and reports results for all matching test files
- **AND**: The process exits with code 0 if all tests pass, non-zero otherwise

#### Scenario: Watch mode

- **GIVEN**: The test runner is configured
- **WHEN**: `npm run test:watch` is executed
- **THEN**: Vitest starts in watch mode, re-running tests on file changes

#### Scenario: Coverage report

- **GIVEN**: The test runner is configured with coverage enabled
- **WHEN**: `npm run test:coverage` is executed
- **THEN**: Vitest runs all tests and generates a coverage report

### Requirement: Vitest Configuration

The project MUST have a `vitest.config.ts` file that configures the test environment correctly.

#### Scenario: JSDOM environment

- **GIVEN**: `vitest.config.ts` exists
- **WHEN**: Vitest loads the config
- **THEN**: The environment is set to `jsdom`
- **AND**: The React plugin is included
- **AND**: The PWA plugin (`vite-plugin-pwa`) is excluded

#### Scenario: Coverage configuration

- **GIVEN**: `vitest.config.ts` exists
- **WHEN**: Coverage is requested
- **THEN**: A coverage provider is configured (e.g., `v8` or `istanbul`)
- **AND**: Coverage output is generated

### Requirement: Test Setup File

The project MUST have a `src/test/setup.ts` file that provides global test utilities and mocks.

#### Scenario: Jest-DOM matchers

- **GIVEN**: `src/test/setup.ts` exists
- **WHEN**: The test runner loads
- **THEN**: `@testing-library/jest-dom` is imported globally
- **AND**: Extended matchers (e.g., `toBeInTheDocument`, `toHaveClass`) are available

#### Scenario: AudioContext mock

- **GIVEN**: Components use Web Audio API
- **WHEN**: Tests run in jsdom
- **THEN**: `AudioContext` and `webkitAudioContext` are mocked as no-op stubs
- **AND**: No runtime errors occur from missing Web Audio API

#### Scenario: User-event helper

- **GIVEN**: `src/test/setup.ts` exists
- **WHEN**: A test imports from the setup file
- **THEN**: A pre-configured `userEvent` instance is exported for use in tests

### Requirement: Package.json Test Scripts

The `package.json` MUST define test-related scripts.

#### Scenario: Test script exists

- **GIVEN**: `package.json` is inspected
- **WHEN**: The `scripts` section is read
- **THEN**: A `test` script runs `vitest run`
- **AND**: A `test:watch` script runs `vitest` in watch mode
- **AND**: A `test:coverage` script runs `vitest` with coverage enabled

### Requirement: TypeScript Configuration

The project's `tsconfig` MUST include Vitest types for type-checking test files.

#### Scenario: Vitest types available

- **GIVEN**: `tsconfig.json` (or equivalent) is used for type-checking
- **WHEN**: A test file imports from `vitest`
- **THEN**: No TypeScript errors occur for Vitest globals (`describe`, `it`, `expect`, `vi`)
