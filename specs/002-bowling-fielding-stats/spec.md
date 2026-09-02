# Feature: Bowling and Fielding Statistics Expansion

## 1. Overview

An expansion to the Modern Cricket Website to record, view, and calculate detailed statistics for bowling and fielding. This expansion organizes inputs and views into clean categories (Game Info, Batting, Bowling, Fielding) using the existing dark-themed Material UI (MUI) visual design and prepares the flat-file database schema to support future charting/graphing capabilities.

## 2. User Stories

- **US1**: As a user, I want to record my bowling performance (overs bowled, maidens, runs conceded, wickets taken) in an organized section of the form, so that I can track my bowling metrics.
- **US2**: As a user, I want to record my fielding performance (catches, run outs, stumpings, and keeper byes) in an organized section of the form, so that I can track my fielding contributions.
- **US3**: As a bowler, I want the system to automatically compute and display my bowling average, strike rate, and economy on individual game records and summary cards.
- **US4**: As a user, I want the historical scorecard page to clearly categorize my matches so that I can review full performance scorecards at a glance.
- **US5**: As a developer, I want cricket data to be stored as a flat structured record per match so that it is optimized for future graphical data analysis (graphs and charts).

## 3. Functional Requirements

### UI/UX & Forms (FR-001 to FR-004)
- **FR-001**: The "Enter New Game" page form must be partitioned into four logical, user-friendly categories using MUI components (such as styled Card sections, Grid partitions, or Tabs):
  - **Category 1: Game Information** (Date, Club, Opponent, Venue/Location)
  - **Category 2: Batting Stats** (Runs Scored, Batting Position, Out Toggle, Dismissal Method)
  - **Category 3: Bowling Stats** (Overs Bowled, Maidens, Runs Given, Wickets)
  - **Category 4: Fielding Stats** (Catches, Run Outs, Stumpings, Byes Conceded)
- **FR-002**: Forms must validate that all values are non-negative.
- **FR-003**: If a user did not bowl or field in a match, the respective input fields can be left blank or defaulted to `0` and must be handled gracefully in calculations.
- **FR-004**: The overall appearance of the new input sections must seamlessly adapt to the modern, dark theme and responsive layout.

### Bowling Validations & Calculations (FR-005 to FR-007)
- **FR-005**: The bowling input fields must validate that:
  - **Overs Bowled**: Must be a non-negative decimal where the ball fractional part is between `.0` and `.5` inclusive (e.g., `3.4` is valid for 3 overs and 4 balls; `3.6` is invalid and must throw a validation error).
  - **Maiden Overs**: Must be a non-negative integer less than or equal to the whole number of overs bowled.
  - **Runs Given Away**: Must be a non-negative integer.
  - **Wickets Taken**: Must be a non-negative integer between `0` and `10` inclusive.
- **FR-006**: The system must automatically calculate the following bowling metrics for individual rows and average dashboard displays, rounded to 2 decimal places:
  - **Economy Rate** = `Runs Conceded / (Balls Bowled / 6)`.
    - *Example*: For 4.2 overs bowled, balls = `(4 * 6) + 2 = 26 balls`. Overs equivalent = `26 / 6 = 4.333 overs`. Economy = `18 runs / 4.333 overs = 4.15`.
  - **Bowling Average** = `Runs Given Away / Wickets Taken` (if wickets > 0, else display 'N/A' or '—').
  - **Bowling Strike Rate** = `Balls Bowled / Wickets Taken` (where balls bowled = `(Overs * 6) + Balls`; if wickets > 0, else display 'N/A' or '—').
- **FR-007**: Division by zero or NaN cases (such as when no overs are bowled or no wickets are taken) must be handled gracefully without crashing the UI, displaying clean placeholders.

### Fielding Validations (FR-008)
- **FR-008**: The fielding input fields must validate:
  - **Catches Taken**: Non-negative integer.
  - **Run Outs Taken**: Non-negative integer.
  - **Stumpings Taken**: Non-negative integer (applicable primarily to Wicketkeepers).
  - **Byes**: Non-negative integer (applicable primarily to Wicketkeepers).

### Historical Viewing & Scorecard (FR-009 to FR-011)
- **FR-009**: The "View Historical Stats" page must contain a comprehensive scorecard showing individual sections or columns for Batting, Bowling, and Fielding performances.
- **FR-010**: The dashboard summary KPI cards at the top of the stats page must include summary aggregates for Bowling (Total Wickets, Best Bowling, Overall Economy) and Fielding (Total Catches, Total Stumpings, Total Run Outs) in addition to Batting.
- **FR-011**: Match records must be stored in a clean, flat JSON structure per game to facilitate seamless mapping to charts or statistical visualization engines.

## 4. Success Criteria

- **SC-001**: The UI is sleek, modern, dark-themed, and responsive, with tabbed or categorized panels grouping inputs neatly.
- **SC-002**: Automatic bowling calculations (Economy, Strike Rate, Bowling Average) are mathematically accurate and resilient to division-by-zero or fractional over bounds.
- **SC-003**: The database schema/state structure is kept flat and clean to enable future integration with charting libraries.

## 5. Data Model

- **Game**
  - **Game Information**
    - `id`: String (unique)
    - `date`: String (YYYY-MM-DD)
    - `club`: String
    - `opponent`: String
    - `location`: String ("Home" or "Away")
  - **Batting**
    - `runs_scored`: Number
    - `batting_number`: Number
    - `is_out`: Boolean
    - `dismissal`: String
  - **Bowling**
    - `overs_bowled`: Number (cricket decimal overs, e.g. 4.2 represents 4 overs and 2 balls)
    - `maidens_bowled`: Number
    - `runs_conceded`: Number
    - `wickets_taken`: Number
  - **Fielding**
    - `catches`: Number
    - `run_outs`: Number
    - `stumpings`: Number
    - `byes_conceded`: Number

## 6. Assumptions

- Bowling and fielding entries are optional; games in which the user did not bowl or field will record those fields as `0` or null, which must not distort aggregate calculations (e.g., games with `0.0` overs bowled should be excluded from bowling average/economy aggregates).
- The historical data page will continue to initialize and reset with comprehensive mock statistics covering all three disciplines.

## 7. Out of Scope

- Rendering visual graphics/charts directly (this expansion implements the exact data modeling and stats calculation foundation for them, but drawing the actual charts on canvas is out of scope).
- Live server-side databases or API routing (all data persists locally in `localStorage`).
