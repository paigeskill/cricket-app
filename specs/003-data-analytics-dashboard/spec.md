# Feature: Advanced Data Analytics Dashboard

## 1. Overview

An interactive, multi-dimensional Data Analytics and Visualization Dashboard for the cricket application. This dedicated page aggregates, groups, and filters a player's batting, bowling, and fielding statistics across multiple facets (Year, Month, Club, and Venue) and provides interactive visual graphs (charts) to easily track trends, compare performances, and analyze dismissals.

## 2. User Stories

- **US1**: As a user, I want to see my compiled batting statistics (total runs, average runs, and average runs per dismissal) grouped by Year, Month, or Club, so that I can easily spot my peak performance periods.
- **US2**: As a user, I want to see a tabular breakdown of my dismissal types filtered by Month, Year, Club, and Venue, so that I can analyze how I am getting out and adapt my technique.
- **US3**: As a user, I want an interactive filter bar to select specific years or clubs to compare their metrics side-by-side (e.g. comparing my performance in 2026 vs 2025, or Club A vs Club B).
- **US4**: As a user, I want to toggle between a structured "Data Table" view and interactive "Visual Charts" (bar, line, and pie/donut charts) so that I can more easily visualize my statistics.
- **US5**: As a player, I want all rate aggregates (Economy, Average Runs per Innings, Runs per Dismissal) to automatically recalculate in real-time as I toggle filters or groupings.

## 3. Functional Requirements

### Navigation & Routing (FR-001)
- **FR-001**: The hamburger navigation drawer in the header must include a new navigation link: "Analytics Dashboard" pointing to the `/analytics` route.

### Real-Time Interactive Filter Bar (FR-002)
- **FR-002**: The Analytics page must feature a prominent, responsive filter panel at the top:
  - **Year Filter**: Multiselect select dropdown containing all unique years parsed from the match database dates. Defaults to "All Years" selected.
  - **Club Filter**: Multiselect select dropdown containing all unique clubs parsed from the match database. Defaults to "All Clubs" selected.
  - **Location/Venue Filter**: Toggle buttons for "All", "Home Only", or "Away Only".

### Metric Groups & Dynamic Grouping Controls (FR-003)
- **FR-003**: The dashboard must provide a **"Group By"** selector control allowing the user to group the aggregated statistics dynamically by:
  - **Year** (aggregates grouped by calendar year)
  - **Month** (aggregates grouped by calendar month name across years, e.g. "May", "June")
  - **Club** (aggregates grouped by individual clubs)

### Analytics Dashboard Panels (FR-004 to FR-006)
The page must group statistics into three major tabs/views:

- **FR-004: Runs & Averages Dashboard (Tab 1)**:
  - Display compiled batting metrics:
    - **Total Runs Scored** in the selected group.
    - **Innings Batted**: Count of matches where the player did not DNB.
    - **Batting Average**: `Runs Scored / Innings Batted` (where Innings Batted > 0).
    - **Runs per Dismissal**: `Runs Scored / Times Out` (where Times Out = count of matches in selected group where `is_out === true`; if Times Out is 0, display "N/A (Not Out)").
  - Provide a toggle button to switch this panel between **"Data Table View"** and **"Graph View"**:
    - **Table View**: Render a structured list showing each grouped item (e.g. each year or club) alongside their Total Runs, Innings, Average, and Runs per Dismissal.
    - **Graph View**: Render interactive SVG-based charts:
      - **Line Trend Chart**: Visualizing monthly/yearly runs scored progression.
      - **Bar Chart**: Comparing Average Runs vs Runs per Dismissal side-by-side per club/year.
- **FR-005: Dismissal Analysis Dashboard (Tab 2)**:
  - Display a table breakdown of the user's dismissals (Caught, Bowled, LBW, Run Out, Stumpings, Hit Wicket, Retired Hurt, etc.) according to the active grouping (Year, Month, Club, or Venue).
  - Provide a toggle to switch this panel to **"Graph View"**:
    - **Donut/Pie Chart**: Visualizing the percentage distribution of dismissal types (e.g. 50% Caught, 30% Bowled, 20% LBW).
- **FR-006: Comparative Analysis Dashboard (Tab 3)**:
  - Permit users to select two distinct items from the grouping facet (e.g. comparing "2026 vs 2025" or "Club A vs Club B") to render parallel comparative cards:
    - Left Column: Item A totals, metrics, and averages.
    - Right Column: Item B totals, metrics, and averages.
    - Render a comparative dual-bar chart showing runs scored and batting averages side-by-side.

### Mathematical Accuracy & Cricket Calculations (FR-007)
- **FR-007**: All rate aggregates (batting averages, bowling economy, runs per dismissal) must be computed dynamically in the frontend to 2 decimal places. If a player was "Not Out" in all matches of a filtered group, `Runs per Dismissal` must display as `'—'` or `'N/A (Not Out)'` and prevent NaN division-by-zero crashes.

### Technical Optimization: SVG-Based Charting (FR-008)
- **FR-008**: To ensure compliance with the **Simplicity** mandate, prevent bloated build sizes, and eliminate external charting peer-dependency conflicts with React 19, the visual charts must be custom-rendered using lightweight, inline responsive React **SVG** elements.
  - Charts must support basic hover tooltips (revealing values when hovering over bars/points).
  - Use elegant primary and secondary theme colors matching the existing dark theme.

## 4. Success Criteria

- **SC-001**: Dashboard components are responsive, adapting grid elements dynamically between mobile viewports and wide-screen desktops.
- **SC-002**: SVG-based charts scale smoothly, look premium with dark-themed grid lines and hover effects, and execute with zero external library overhead.
- **SC-003**: Math calculations remain mathematically precise when filters are applied (for example, correctly isolating batting average to only include matches where the user batted).
- **SC-004**: Toggling filters or groupings instantly recalculates and re-renders both tables and graphs in <15ms.

## 5. Data Model

The analytics dashboard will process the flat `Game` records retrieved from `localStorage` (matching the `002-bowling-fielding-stats` schema):

```typescript
interface Game {
  id: string;
  date: string;              // Used to extract Year (date.substring(0, 4)) and Month (date.substring(5, 7))
  club: string;              // Used to group/filter by club
  opponent: string;
  location: "Home" | "Away"; // Used to filter by venue
  did_not_bat: boolean;      // Innings Batted is calculated where did_not_bat is false/undefined
  runs_scored: number | null;// Aggregated for runs, average, and highest score
  is_out: boolean;           // Aggregated for runs per dismissal
  dismissal: string;         // Aggregated for dismissal breakdowns
}
```

## 6. Assumptions

- Data is retrieved on-the-fly from the list of games stored in `localStorage` (`cricket_games`). No API integrations or server connections are needed.
- If no games match the active filter criteria, the page should display an elegant zero-state message: *"No matches match the selected filters. Clear some filters or add more matches!"*

## 7. Out of Scope

- Saving custom filter combinations (filters reset to default on page reload).
- Exporting raw charts to PNG/PDF formats.
- Manual data entry on the analytics page (game details must be added via the "Enter New Game" form page).
