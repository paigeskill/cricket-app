# Tasks: Bowling and Fielding Statistics Expansion

**Input**: Design documents from `/specs/002-bowling-fielding-stats/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story and phase to enable independent, modular implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- Exact file paths are listed in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and base mock data seed expansion

- [x] T001 Expand mock data array in `src/data/mockData.js` to include standard bowling and fielding statistics (overs, maidens, runs, wickets, catches, run outs, stumpings, byes) for the original 2026 match entries.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core structure preparation before user story implementation

- [x] T002 Verify local state-passing signatures from `EnterGamePage.js` to `GameForm.js` and from `HistoricalStatsPage.js` to `StatsTable.js` to ensure the extended schema is supported by parent pages.

---

## Phase 3: User Story 1 - Categorized Game Entry Form (Priority: P1) 🎯 MVP

**Goal**: Partition the existing `GameForm` into clean, tabbed categories (Game Info, Batting, Bowling, Fielding) using MUI `Tabs` and form inputs with validations.

**Independent Test**: Mount the form, verify that clicking on tabs successfully switches input fields, fill out invalid values (e.g. `3.6` overs), check validation errors, and confirm successful submission.

### Implementation for User Story 1

- [x] T003 [P] [US5] Implement MUI `Tabs` and `TabPanel` container structures in `src/components/GameForm.js` to toggle between "Game & Batting", "Bowling", and "Fielding" sections.
- [x] T004 [P] [US5] Re-organize existing Game Date, Club, Opponent, Location, Runs, Batting position, and Out/Dismissal inputs into the first Tab Panel in `src/components/GameForm.js`.
- [x] T005 [P] [US1] Implement Bowling form inputs (Overs Bowled, Maidens, Runs Conceded, Wickets Taken) in `src/components/GameForm.js` with validation (such as over decimal parts must be <= .5, e.g. `3.6` is invalid; inputs must be non-negative).
- [x] T006 [P] [US2] Implement Fielding form inputs (Catches, Run Outs, Stumpings, Byes Conceded) in `src/components/GameForm.js` with non-negative integer validations.
- [x] T007 [US1] Update form submit handler inside `src/components/GameForm.js` to parse all batting, bowling, and fielding fields as numbers (defaulting empty fields to `0` or null) and pass the flat record to the parent `onSave` hook.

---

## Phase 4: User Story 2 - Expanded Scorecard & KPI Dashboard (Priority: P2)

**Goal**: Expand the summary KPI deck with individual Batting, Bowling, and Fielding categories, and implement toggling sub-tables in the scorecard.

**Independent Test**: Load the scorecard page, check aggregate totals inside card decks, click through tabular scorecards, and verify computed rates match expected formulas.

### Implementation for User Story 2

- [x] T008 [P] [US4] Implement dynamic tabs inside `src/components/StatsTable.js` to toggle the visible table between "Batting Scorecard", "Bowling Scorecard", and "Fielding Scorecard".
- [x] T009 [P] [US3] Implement dynamic bowling scorecard rows in `src/components/StatsTable.js` featuring calculated columns for Economy, Bowling Average, and Strike Rate, resolving fractional over ball calculations.
- [x] T010 [P] [US4] Expand top KPI dashboard decks in `src/components/StatsTable.js` with individual cards for Batting, Bowling (Total Wickets, Economy, Best Bowling), and Fielding (Total Catches, Run Outs, Stumpings).
- [x] T011 [US4] Ensure the "Reset Mock Data" modal confirmation in `src/pages/HistoricalStatsPage.js` fully restores the original expanded 2026 cricket matches containing bowling and fielding statistics.

---

## Phase 5: Testing & Polish

**Purpose**: High-fidelity unit tests, integration validation, and compiler confirmation

- [x] T012 [P] Write unit tests in `src/components/GameForm.test.js` to assert Bowling and Fielding input validations, specifically testing boundary limits and invalid decimal overs.
- [x] T013 [P] Write unit tests in `src/components/StatsTable.test.js` to verify exact math calculations for Economy, Average, and Strike Rate, checking division by zero and zero balls bowled edge cases.
- [x] T014 Run the Jest test suite via `npm test` to confirm all 11 previous tests + new bowling/fielding tests pass flawlessly.
- [x] T015 Run `npm run build` to confirm production Webpack compiler success.
- [x] T016 [US1] Implement a "Did Not Bat" (DNB) toggle option in `src/components/GameForm.js` and render clean placeholders in `src/components/StatsTable.js`.

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: No dependencies - starts immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 completion.
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion (blocks scorecard displaying).
- **User Story 2 (Phase 4)**: Depends on Phase 3 completion.
- **Testing & Polish (Phase 5)**: Depends on Phase 4 completion.

### Parallel Opportunities
- In Phase 3, T003, T004, T005, and T006 can be implemented in parallel.
- In Phase 4, T008, T009, and T010 can be implemented in parallel.
- In Phase 5, T012 and T013 can be written in parallel.
