# Task Breakdown: Modern Cricket Website

**Feature**: [Modern Cricket Website](spec.md)

## Phase 1: Project Setup

- [ ] T001 Initialize React application using Create React App
- [ ] T002 Create the directory structure as defined in the implementation plan

## Phase 2: Foundational UI

- [ ] T003 [P] Create a basic layout component with a header and main content area in `src/components/Layout.js`
- [ ] T004 [P] Apply the base styles from `style.css` to the application

## Phase 3: User Story 1 - Enter New Game

- [ ] T005 [US1] Create the `LandingPage.js` component in `src/pages/` with links to the other pages
- [ ] T006 [US1] Create the `EnterGamePage.js` component in `src/pages/`
- [ ] T007 [US1] Create the `GameForm.js` component in `src/components/` with all the fields from the data model
- [ ] T008 [US1] Add routing for the `/enter-game` path to display the `EnterGamePage` component including back button to navigate back to home

## Phase 4: User Story 2 - View Historical Stats

- [ ] T009 [US2] Create the `HistoricalStatsPage.js` component in `src/pages/`
- [ ] T010 [US2] Create the `StatsTable.js` component in `src/components/` to display the game data
- [ ] T011 [US2] Create the `mockData.js` file in `src/data/` with the mock game data
- [ ] T012 [US2] Add routing for the `/historical-stats` path to display the `HistoricalStatsPage` component including back button to navigate back to home

## Phase 5: Testing & Polish

- [ ] T013 [P] Write unit tests for the `GameForm.js` component
- [ ] T014 [P] Write unit tests for the `StatsTable.js` component
- [ ] T015 Write integration tests for the page navigation

## Dependencies

- User Story 1 and User Story 2 can be developed in parallel after the foundational UI is complete.
- Testing should be done after the components are developed.
