# Feature: CSV Stats Import

## 1. Overview

An expansion to the Modern Cricket Website to allow users to import all of their past cricket statistics from a CSV file. This feature enables users to transition from mock data to their own historical playing history. The imported stats are parsed, validated, and stored permanently in the browser's local storage (which replaces the temporary mock data). In the UI, the "Reset Mock Data" button is replaced with an "Import Data" button featuring appropriate styling and iconography.

## 2. User Stories

- **US1**: As a user, I want to click an "Import Data" button on the Historical Stats page to upload my past statistics from a CSV file.
- **US2**: As a user, I want the system to parse and validate my CSV data, including mapping acronyms to readable dismissal names (e.g., "CWK" to "Caught by Wicketkeeper"), so that my data is cleanly displayed.
- **US3**: As a user, I want the system to handle missing data or "N/A" values gracefully so that matches where I did not bat, bowl, or keep do not skew my averages or cause calculation errors.
- **US4**: As a user, I want my imported data to persist permanently in my local storage so that my personal playing history remains saved in the repository across sessions, and is instantly accessible across all landing, stats, and analytics pages.

## 3. Functional Requirements

### UI Integration (FR-001)
- **FR-001**: On the "Historical Statistics" page (`src/pages/HistoricalStatsPage.js`), the existing "Reset Mock Data" button must be removed and replaced with an "Import Data" button.
  - The new button must have the same button styling (MUI Button, same size, layout position, etc.).
  - The start icon must be updated to an appropriate upload icon (e.g., `CloudUploadIcon` or `FileUploadIcon`).
  - Clicking this button must open a file selector dialog restricting selection to `.csv` files.

### CSV Parsing & Data Mapping (FR-002)
- **FR-002**: The system must parse the uploaded CSV file.
  - Column headers in the CSV must map to the underlying `Game` model.
  - Given that there are two columns named "Runs" in the CSV headers, the parser must distinguish them by position/index:
    - **Runs (index 9, 0-based index 9)**: Represents bowling runs conceded.
    - **Runs (index 12, 0-based index 12)**: Represents batting runs scored.
  - The date string (e.g., `5/4/2014`) must be parsed into the standard `YYYY-MM-DD` format (e.g., `2014-05-04`) for consistency with the application's date model.
    - *Note on parsing logic*: Since `Month` column is also provided (e.g., `MAY`), the parser can use the `Month` and `Year` columns to determine or validate the Month/Day/Year representation of the date (e.g., `5/4/2014` with Month `MAY` indicates `5` is the Month and `4` is the Day, yielding `2014-05-04`).

### Cricket Dismissal Acronym Mapping (FR-003)
- **FR-003**: The system must translate cricket dismissal type acronyms under the "Dismissal" column into fully descriptive text:
  - **CWK**: "Caught by Wicketkeeper"
  - **C**: "Caught"
  - **B**: "Bowled"
  - **ST**: "Stumped"
  - **RO**: "Run Out"
  - **LBW**: "Leg Before Wicket"
  - **C&B**: "Caught and Bowled"
  - **HW**: "Hit Wicket"
  - If the dismissal is blank, `N/A`, `NO`, or empty, it should be mapped to "None" (and `is_out` mapped to `false`).

### Graceful Missing/N/A Data Handling (FR-004)
- **FR-004**: The system must handle missing/`N/A` data values in the CSV gracefully and differentiate fielding roles:
  - **Batting `N/A` Handling**: If batting `Runs` (or batting `Number`) is `N/A`, the system must explicitly set `did_not_bat` to `true` on the `Game` record, and set `runs_scored` and `batting_number` to `null`. If batting `Runs` is a valid integer, `did_not_bat` must be set to `false`. This flag is used to exclude the match from batting aggregate calculations (such as batting average and innings played).
  - **Bowling `N/A` Handling**: If `Overs`, `Maidens`, `Runs` (bowling), or `Wickets` is `N/A`, the system must store bowling fields as `null` and ensure these games are excluded from bowling economy, average, and strike rate calculations.
  - **Fielding/Keeping Role & `N/A` Handling**: 
    - If `Stumpings` and `Byes` columns are **not** `N/A` (and are integers instead), the match is classified as a wicketkeeping match and `is_keeper` must be set to `true`.
      - Catches and Run Outs from the CSV must be assigned to keeper-specific fields: `catches_keeper` and `run_outs_keeper` respectively.
      - Outfield fields `catches` and `run_outs` must be set to `0` or `null`.
    - If `Stumpings` and `Byes` columns are `N/A` or empty:
      - The match is classified as an outfield fielding match and `is_keeper` must be set to `false`.
      - Catches and Run Outs from the CSV must be assigned to outfield-specific fields: `catches` and `run_outs` respectively.
      - Keeper fields `catches_keeper` and `run_outs_keeper` must be set to `0` or `null`.
    - If any of these fields are `N/A` individually, the system must handle them gracefully in aggregates.

### Local Data Persistence & Zero-State Handling (FR-005)
- **FR-005**: Upon successful import, the parsed games list must be stored under the `cricket_games` key in `localStorage`, fully replacing the existing mock data or active records.
  - The page state must immediately update to reflect the newly imported stats.
  - Since mock data is no longer reset, any existing mock data logic or "Reset statistics to original mock data" dialog is completely decommissioned.
  - The reset mock data modal and all other accessory methods and code should also be removed.

### CSV Import Feedback & Validation (FR-006)
- **FR-006**: The application must provide clear feedback to the user upon a successful or failed import.
  - A success snackbar/alert must display: *"Successfully imported {count} matches!"*
  - If the uploaded file is not a valid CSV or has incorrect headers, the system must show an error alert: *"Error importing CSV: Invalid column headers or file format. Please check your template."*

## 4. Success Criteria

- **SC-001**: Clicking the "Import Data" button allows a user to upload a CSV file, parses it entirely on the client, and displays the correct count of imported games.
- **SC-002**: CSV values with `N/A` are loaded without causing runtime errors or skewing batting/bowling/fielding calculations on any of the application dashboards.
- **SC-003**: Dismissal acronyms are correctly translated to their fully-qualified descriptions and display correctly on scorecards.
- **SC-004**: Date formats are parsed and stored consistently as `YYYY-MM-DD`, allowing the existing filters (Year, Month) and SVG charts on the Analytics page to group and render the newly imported data immediately and flawlessly.

## 5. Data Model

The imported CSV will be parsed into the `Game` schema, with the option of saving `team` as a newly supported field:

```typescript
interface Game {
  id: string;                // Uniquely generated UUID or index string
  date: string;              // Converted to YYYY-MM-DD from CSV date
  club: string;              // Club name from CSV
  team?: string;             // Optional team name from CSV (e.g. "3s")
  opponent: string;          // Opposing team name
  location: "Home" | "Away"; // "Home" if 'H', "Away" if 'A'
  did_not_bat: boolean;      // true if Runs is 'N/A', false otherwise
  runs_scored: number | null;// Runs scored, null if 'N/A' (did not bat)
  batting_number: number | null; // Batting position, null if 'N/A'
  dismissal: string;         // Fully-mapped dismissal name (e.g., "Caught by Wicketkeeper")
  is_out: boolean;           // true if Out? is '1', false otherwise
  overs_bowled: number | null; // Bowling overs, null if 'N/A'
  maidens_bowled: number | null; // Maidens bowled, null if 'N/A'
  runs_conceded: number | null;  // Bowling runs conceded, null if 'N/A'
  wickets_taken: number | null;  // Bowling wickets taken, null if 'N/A'
  is_keeper: boolean;        // true if Stumpings and Byes are integers (not N/A)
  catches: number | null;    // Outfield catches taken, null or 0 if 'N/A' or is_keeper is true
  run_outs: number | null;   // Outfield run outs taken, null or 0 if 'N/A' or is_keeper is true
  catches_keeper: number | null; // Keeper catches taken, null or 0 if 'N/A' or is_keeper is false
  run_outs_keeper: number | null;// Keeper run outs taken, null or 0 if 'N/A' or is_keeper is false
  stumpings: number | null;  // Stumpings taken, null if 'N/A'
  byes_conceded: number | null;  // Wicketkeeper byes, null if 'N/A'
}
```

## 6. Assumptions

- The date column in the spreadsheet uses the `M/D/YYYY` format, which is confirmed by matching the `Month` column value (`MAY` for month index `5` and `Date` starting with `5/`).
- Users will only import well-formed CSV files matching the specified header layout.
- If no data has been imported, the application will default to loading the initial mock dataset (`initialMockGames`) on first load, but subsequent imports will permanently overwrite this dataset.

## 7. Out of Scope

- Merging imported CSV stats with existing records (importing completely overrides the current storage database to prevent duplicate entries).
- Live backend storage or cloud database syncing (all storage remains client-side in `localStorage` for now).
- Interactive mapping interface for arbitrary CSV header names.
