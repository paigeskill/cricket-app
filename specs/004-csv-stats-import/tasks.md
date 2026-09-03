# Tasks: CSV Stats Import

**Input**: Design documents from `/specs/004-csv-stats-import/`

**Prerequisites**: `plan.md` (required), `spec.md` (required), `research.md` (required), `data-model.md` (required), `quickstart.md` (required)

**Tests**: Test tasks are included as we require a fully test-verified implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- All descriptions include exact file paths.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create custom CSV helper placeholder file in `src/utils/csvParserHelper.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utility structure that MUST be complete before user story integration can begin

**⚠️ CRITICAL**: No UI integration work can begin until this phase is complete

- [x] T002 Initialize the unit test suite file in `src/utils/csvParserHelper.test.js` containing empty/dummy tests to verify Jest can run it

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - "Import Data" UI Button & File Selector (Priority: P1) 🎯 MVP

**Goal**: Replace the "Reset Mock Data" button with an "Import Data" button that opens a file selector restricting selection to `.csv` files.

**Independent Test**: Verify that clicking the "Import Data" button opens the file selector and lets the user choose a CSV file.

### Tests for User Story 1
- [x] T003 [P] [US1] Create unit tests in `src/pages/HistoricalStatsPage.test.js` to ensure the new "Import Data" button is successfully rendered in the header and triggers a file input click

### Implementation for User Story 1
- [x] T004 [US1] Replace the "Reset Mock Data" button in `src/pages/HistoricalStatsPage.js` with an "Import Data" button using matching styles, custom `CloudUploadIcon`, and a hidden `<input type="file" accept=".csv" />`

**Checkpoint**: User Story 1 is fully functional and testable independently

---

## Phase 4: User Story 2 - CSV Data Tokenizer & Dismissal Acronym Mapping (Priority: P2)

**Goal**: Implement the robust client-side CSV string parsing logic and translate cricket dismissal acronyms (CWK, C, B, ST, RO, LBW, C&B, HW, NO) to their descriptive names.

**Independent Test**: Run unit tests on `src/utils/csvParserHelper.js` with sample rows to prove correct tokenization (even with commas inside quoted cells) and correct acronym translation.

### Tests for User Story 2
- [x] T005 [P] [US2] Write unit tests in `src/utils/csvParserHelper.test.js` validating that individual CSV rows parse correctly, and dismissal abbreviations map to descriptive strings

### Implementation for User Story 2
- [x] T006 [P] [US2] Implement the row-splitting and tokenization logic in `src/utils/csvParserHelper.js` using regular expressions that preserve commas wrapped in double quotes
- [x] T007 [P] [US2] Implement the `DISMISSAL_DICTIONARY` mapping in `src/utils/csvParserHelper.js` to translate acronyms to readable names, setting `is_out` accordingly

**Checkpoint**: User Story 2 is fully functional and testable independently

---

## Phase 5: User Story 3 - Role Mapping & Graceful Missing/N/A Data (Priority: P3)

**Goal**: Differentiate match roles (Wicketkeeper vs Outfield) dynamically depending on stumping and bye integers, and parse missing stats (`N/A`) into `null` or `did_not_bat: true` gracefully.

**Independent Test**: Run unit tests on `src/utils/csvParserHelper.js` ensuring wicketkeeper vs outfield routing works correctly and `N/A` fields do not crash parsing or skew data.

### Tests for User Story 3
- [x] T008 [P] [US3] Add unit tests in `src/utils/csvParserHelper.test.js` to verify keeper-specific fields routing, `did_not_bat` evaluation when Runs is `"N/A"`, and graceful parsing of numeric `"N/A"` cells

### Implementation for User Story 3
- [x] T009 [P] [US3] Implement batting `"N/A"` handling in `src/utils/csvParserHelper.js` to explicitly set `did_not_bat: true` on the record when Runs is `"N/A"`
- [x] T010 [P] [US3] Implement bowling and fielding `"N/A"` nullification in `src/utils/csvParserHelper.js` to store missing stats as `null` and prevent them from skewing rates
- [x] T011 [P] [US3] Implement dynamic wicketkeeping checks in `src/utils/csvParserHelper.js` to set `is_keeper: true` and map catches/runouts to keeper fields if stumpings/byes are present and not `"N/A"`, mapping them to outfield fields otherwise

**Checkpoint**: User Story 3 is fully functional and testable independently

---

## Phase 6: User Story 4 - Data Persistence & State Integration (Priority: P4)

**Goal**: Connect the parsed games list to local storage, completely decommissioning the old mock data reset modal/methods.

**Independent Test**: Load a CSV, confirm the "Successfully imported X matches!" snackbar alert shows, and verify the UI updates immediately with the imported data.

### Tests for User Story 4
- [x] T012 [P] [US4] Add unit tests in `src/pages/HistoricalStatsPage.test.js` verifying successful file reading, state modification, snackbar alerts on import, and local storage replacement

### Implementation for User Story 4
- [x] T013 [US4] Integrate `src/utils/csvParserHelper.js` inside `src/pages/HistoricalStatsPage.js` to handle file selection, parse the string content, and save the resultant JSON array to `localStorage` under `cricket_games`
- [x] T014 [US4] Remove the old confirmation dialog, reset mock data button code, and associated mock data reset handlers from `src/pages/HistoricalStatsPage.js`

**Checkpoint**: All user stories are now fully functional and integrated

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T015 Ensure all React, MUI, and Helper imports are clean, and run `npm run build` or build steps to ensure there are zero type or compiler errors
- [x] T016 Run through manual validation scenarios in `quickstart.md` to guarantee perfect browser functionality and layout responsiveness
- [x] T017 Add option to delete the game record entry from the Edit Game Dialog form (`src/components/GameForm.js`) with propagation through `EditGameDialog.js` to `HistoricalStatsPage.js`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) - blocks all user stories.
- **User Stories (Phases 3 to 6)**: Depend on Foundational (Phase 2).
  - Can proceed sequentially (US1 → US2 → US3 → US4) or in parallel.
- **Polish (Phase 7)**: Depends on all user stories being complete.

### Within Each User Story
- Tests must be written and verified first.
- Utility logic should be written before page/UI integration.

### Parallel Opportunities
- Utility implementation tasks marked `[P]` (T005, T006, T007, T009, T010, T011) can be worked on in parallel once the basic structure is defined.
- UI tests (`T003`) and utility tests (`T005`, `T008`) are fully parallelizable.

---

## Parallel Example: User Story 2 & 3 Utilities
```bash
# Implement the tokenizer, dismissal dictionary, and keeper-routing simultaneously:
Task: "Implement the row-splitting and tokenization logic in src/utils/csvParserHelper.js"
Task: "Implement dismissal acronym mappings in src/utils/csvParserHelper.js"
Task: "Implement dynamic wicketkeeping checks in src/utils/csvParserHelper.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 & 2 Only)
1. Complete Setup & Foundation.
2. Complete User Story 1 (UI Button) & User Story 2 (Basic CSV parsing).
3. **STOP and VALIDATE**: Test basic CSV parsing without keeper routing or missing fields to confirm MVP value.

### Incremental Delivery
1. Foundation complete.
2. Deliver MVP: Button + CSV parser → verified.
3. Deliver Keeper/Missing statistics handling → verified.
4. Deliver Local Storage persistence & Clean-up of mock reset button → verified.
5. Perform Polish & final validations.

---

## Notes
- `[P]` tasks denote parallelizable items.
- Vague tasks have been completely avoided, and exact file paths are referenced.
