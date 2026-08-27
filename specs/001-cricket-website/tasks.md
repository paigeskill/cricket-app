# Task Breakdown: Modern Cricket Website

**Feature**: [Modern Cricket Website](spec.md)

## Phase 1: Project Setup

- [x] T001 Initialize React application using Create React App
- [x] T002 Create the directory structure as defined in the implementation plan

## Phase 2: Foundational UI

- [x] T003 [P] Create a basic layout component with a header and main content area in `src/components/Layout.js`
- [x] T004 [P] Apply the base styles from `style.css` to the application
- [x] T005 [P] Implement the burger menu icon and navigation drawer in the header (FR6)

## Phase 3: User Story 1 - Enter New Game

- [x] T006 [US1] Create the `LandingPage.js` component in `src/pages/` with links to the other pages
- [x] T007 [US1] Create the `EnterGamePage.js` component in `src/pages/`
- [x] T008 [US1] Create the `GameForm.js` component in `src/components/` with all the fields from the data model
- [x] T009 [US1] Add routing for the `/enter-game` path to display the `EnterGamePage` component including back button to navigate back to home

## Phase 4: User Story 2 - View Historical Stats

- [x] T010 [US2] Create the `HistoricalStatsPage.js` component in `src/pages/`
- [x] T011 [US2] Create the `StatsTable.js` component in `src/components/` to display the game data
- [x] T012 [US2] Create the `mockData.js` file in `src/data/` with the mock game data
- [x] T013 [US2] Add routing for the `/historical-stats` path to display the `HistoricalStatsPage` component including back button to navigate back to home

## Phase 5: Testing & Polish

- [x] T014 [P] Write unit tests for the `GameForm.js` component
- [x] T015 [P] Write unit tests for the `StatsTable.js` component
- [x] T016 Write integration tests for the page navigation

## Dependencies

- User Story 1 and User Story 2 can be developed in parallel after the foundational UI is complete.
- Testing should be done after the components are developed.
