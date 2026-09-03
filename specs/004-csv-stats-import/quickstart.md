# Validation and Quickstart Guide: CSV Stats Import

This guide details how to set up, execute tests, and manually validate the client-side CSV import and parsing features.

## 1. Local Development Setup

To run and verify this feature locally, follow these steps:

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```
2. **Start the local server**:
   ```bash
   npm start
   ```
3. **Open the browser** and navigate to:
   ```text
   http://localhost:3000
   ```

---

## 2. Automated Test Execution

You can execute the unit and integration test suites using:

```bash
npm test
```

This test command executes tests verifying:
- Custom CSV tokenizer splits rows cleanly while preserving quoted commas.
- Full acronym translation from spreadsheet dismissals to descriptive strings.
- Accurate dynamic wicketkeeper assignment (`is_keeper: true` vs `false`) depending on stumping and bye presence.
- Graceful mapping of missing (`N/A`) stats and batting exclusion (`did_not_bat: true`).
- UI integration, button replacement, and state updates on `HistoricalStatsPage`.

---

## 3. Manual Validation Scenarios

### Scenario A: Replace Reset Button & File Upload
1. Navigate to the **"View Historical Stats"** page.
2. **Expected Outcome**:
   - The orange "Reset Mock Data" button in the upper header actions is completely removed.
   - A new "Import Data" button is present with identical layout, matching styling, and an upload icon (e.g. `CloudUploadIcon`).
3. Click the **"Import Data"** button.
4. **Expected Outcome**: A file selector opens, filtered strictly to `.csv` files.

### Scenario B: Valid CSV Parsing and Mapping
1. Prepare a CSV file named `stats_import.csv` with the following row:
   ```csv
   Club,Team,Opponent,Date,Year,Month,H / A,Overs,Maidens,Runs,Wickets,Number,Runs,Dismissal,Out?,Catches,Run Outs,Stumpings,Byes
   NCC,3s,Pontblyddyn,5/4/2014,2014,MAY,A,4,3,7,1,8,0,CWK,1,0,0,N/A,N/A
   ```
2. Select and upload this file.
3. **Expected Outcome**:
   - A success snackbar/alert displays: *"Successfully imported 1 matches!"*
   - The table instantly refreshes to display this match.
   - **Fields Verified in Row**:
     - Date: `2014-05-04`
     - Dismissal: `Caught by Wicketkeeper`
     - Batting Number: `8`
     - Runs Scored: `0`
     - Status: `Out`
     - Role: `Outfield` (since stumpings and byes are `N/A`)

### Scenario C: Wicketkeeping & Missing Data Dynamic Logic
1. Prepare a CSV row representing a keeping match with missing batting/bowling data:
   ```csv
   Club,Team,Opponent,Date,Year,Month,H / A,Overs,Maidens,Runs,Wickets,Number,Runs,Dismissal,Out?,Catches,Run Outs,Stumpings,Byes
   NCC,3s,Bangor,5/11/2014,2014,MAY,H,N/A,N/A,N/A,N/A,N/A,N/A,NO,0,2,0,1,2
   ```
2. Upload the file.
3. **Expected Outcome**:
   - SNACKBAR: *"Successfully imported 1 matches!"*
   - Table displays match under Date `2014-05-11` against *Bangor*.
   - **Fields Verified in Row**:
     - Batting Position/Runs: Displays `—` (or DNB) with `did_not_bat: true` on backend.
     - Bowling: All fields display `—` (correctly ignored from average/economy).
     - Role: Displays `Keeper` chip (since stumpings/byes are integers: `1`/`2`).
     - Keeper Catches: Displays `2` (the catches mapped to `catches_keeper`).
     - Stumpings: Displays `1`.
     - Keeper Run Outs: Displays `0` (the run outs mapped to `run_outs_keeper`).
     - Byes Conceded: Displays `2`.
