# Tasks: Advanced Data Analytics Dashboard

**Input**: Design documents from `/specs/003-data-analytics-dashboard/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story and phase to enable independent, modular implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- Exact file paths are listed in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Register routes and sidebar navigation elements

- [x] T001 Configure router paths in `src/App.js` to render the newly created `/analytics` dashboard page, and add a responsive link labeled "Analytics Dashboard" pointing to it inside the sidebar navigation drawer of `src/components/Layout.js`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core math computations and grouping helpers

- [x] T002 Implement a core analytical calculation utility file in `src/utils/analyticsHelper.js` to parse flat game records, compute aggregates (Total Runs, Innings, Average, Runs per Dismissal, Total Wickets, Best Bowling, Catches, Run Outs, Stumpings), group datasets dynamically by Year/Month/Club, and provide division-by-zero protection.

---

## Phase 3: User Story 1 & 2 - Interactive Filters, Groupings & Tabular Analytics (Priority: P1) 🎯 MVP

**Goal**: Formulate real-time multiselect dropdowns and group by controls, displaying aggregated tabular scorecards.

**Independent Test**: Load the dashboard, select filter values, and verify that the table rows dynamically group and recalculate.

### Implementation for User Story 1 & 2

- [x] T003 [P] [US3] Create the filter bar component in `src/components/AnalyticsFilters.js` featuring multiselect select dropdowns for Year and Club, alongside Location/Venue toggle buttons.
- [x] T004 [P] [US1] Create the core dashboard container `src/pages/AnalyticsDashboard.js` managing selected filter states, triggering groupings dynamically by Year/Month/Club, and rendering the tabular "Runs & Averages" panel.
- [x] T005 [P] [US2] Implement the tabular dismissal breakdown scorecard inside `src/pages/AnalyticsDashboard.js` showing categorized wickets lost counts.

---

## Phase 4: User Story 4 - Custom SVG Charting & Dashboard Graph Toggles (Priority: P2)

**Goal**: Implement custom inline SVG components to draw line, bar, and donut charts with hover coordinates state tooltips.

**Independent Test**: Toggle to Graph View, verify SVG nodes render smoothly, hover over coordinates, check that the floating tooltip overlays cleanly.

### Implementation for User Story 4

- [x] T006 [P] [US4] Create a custom SVG Line and Bar chart renderer component in `src/components/CustomCharts.js` supporting dynamic scale coordinate mappings and hover mouse overlay events.
- [x] T007 [P] [US4] Create a custom SVG Donut chart renderer component in `src/components/CustomCharts.js` calculating polar arc slices to represent dismissal percentage distributions.
- [x] T008 [US4] Integrate the charts inside `src/pages/AnalyticsDashboard.js` with toggle controls to switch each scorecard panel between "Data Table" and "Visual Graph" views.

---

## Phase 5: User Story 3 & 5 - Comparative Side-by-Side Analysis Card Deck (Priority: P3)

**Goal**: Render parallel side-by-side comparison grids for two selected years or two selected clubs with summary grids and comparative dual-bar charts.

### Implementation for User Story 3 & 5

- [x] T009 [US3] Create the comparative side-by-side analysis dashboard tab inside `src/pages/AnalyticsDashboard.js` featuring parallel KPI metric cards and a dual-bar comparative SVG chart.

---

## Phase 6: Testing & Polish

**Purpose**: High-fidelity unit tests, integration validation, and compiler confirmation

- [x] T010 [P] Write unit tests in `src/utils/analyticsHelper.test.js` validating the calculations, grouping logic, and null batting / DNB exclusions.
- [x] T011 [P] Write unit tests in `src/pages/AnalyticsDashboard.test.js` to verify filtering dropdown triggers, tab switches, and Table vs Graph toggling.
- [x] T012 Run the Jest test suite via `npm test` to confirm all 14 previous tests + new analytics tests pass flawlessly.
- [x] T013 Run `npm run build` to confirm production Webpack compiler success.
- [x] T014 [US3] Add a responsive "View Analytics" button in the actions header of `src/pages/HistoricalStatsPage.js` to link up scorecard data with the Advanced Analytics Dashboard page.
- [x] T015 [US3] Optimize Year and Club filters in `src/components/AnalyticsFilters.js` to render a compact selected count summary and display active selections as deletable MUI Chips underneath.
- [x] T016 [US2] Implement dynamic "Group By" and specific group selections in the Dismissal Breakdown tab of `src/pages/AnalyticsDashboard.js` to analyze dismissal types per year, month, club, or venue.

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: No dependencies - starts immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 completion (blocks analytics calculations).
- **User Story 1 & 2 (Phase 3)**: Depends on Phase 2 completion (blocks data table displays).
- **User Story 4 (Phase 4)**: Depends on Phase 3 completion.
- **User Story 3 & 5 (Phase 5)**: Depends on Phase 4 completion.
- **Testing & Polish (Phase 6)**: Depends on Phase 5 completion.

### Parallel Opportunities
- In Phase 3, T003, T004, and T005 can be implemented in parallel.
- In Phase 4, T006 and T007 can be written in parallel.
- In Phase 6, T010 and T011 can be written in parallel.
