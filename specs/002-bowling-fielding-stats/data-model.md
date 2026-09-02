# Data Model: Bowling & Fielding Stats

The data model for this feature represents a flat, unified structure for each cricket game. This flat schema simplifies storage, state management, and future charting/graphing capabilities.

## Game Entity

Each match played is saved as a single JSON object in the `cricket_games` list:

```typescript
interface Game {
  // Game Information
  id: string;               // Unique ID (timestamp-based)
  date: string;             // ISO Date format (YYYY-MM-DD)
  club: string;             // User's club name
  opponent: string;         // Opponent club name
  location: "Home" | "Away";// Match venue

  // Batting Statistics
  runs_scored: number;      // Runs scored by the user (integer >= 0)
  batting_number: number;   // Position in batting lineup (integer >= 1)
  is_out: boolean;          // Dismissed? (true/false)
  dismissal: string;        // Dismissal method (e.g. "Caught", "Bowled", "LBW", "None")

  // Bowling Statistics
  overs_bowled: number;     // Decimal overs bowled (e.g. 4.2 means 4 overs and 2 balls)
  maidens_bowled: number;   // Maiden overs bowled (integer >= 0)
  runs_conceded: number;    // Runs given away (integer >= 0)
  wickets_taken: number;    // Wickets taken by the user (integer, 0 to 10)

  // Fielding Statistics
  catches: number;          // Catches taken (integer >= 0)
  run_outs: number;         // Run outs made/assisted (integer >= 0)
  stumpings: number;        // Stumpings made as keeper (integer >= 0)
  byes_conceded: number;    // Byes conceded as keeper (integer >= 0)
}
```

## Initial Mock Data Seed

When `localStorage` is initialized or reset, it will be populated with matches containing comprehensive stats across batting, bowling, and fielding (e.g. games where the user bowled and fielded, as well as batted).
