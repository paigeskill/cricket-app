# Research and Technical Decisions: CSV Parsing and Role Mapping

This document details the architectural decisions and parsing strategies developed during Phase 0 for the client-side CSV Stats Import feature (004).

## 1. Custom Dependency-Free CSV Parsing Strategy

To uphold the core **Simplicity** principle and ensure seamless compatibility with React 19, we bypass heavy npm dependencies (like PapaParse) and implement a robust client-side CSV parser.

### Parsing Algorithm
1. **FileReader Reading**: The browser's native `FileReader` API loads the uploaded file as a plain-text string.
2. **Line Splitter**: To handle different OS line endings safely, we split lines using a regular expression:
   ```javascript
   const lines = fileContent.split(/\r?\n/);
   ```
3. **CSV Row Tokenizer**: A robust regex tokenizer is used to parse commas while ignoring commas wrapped inside double quotes (e.g., in club or opponent names):
   ```javascript
   const tokenizeCSVRow = (rowText) => {
     const matches = rowText.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
     return matches.map(cell => cell.replace(/^"|"$/g, '').trim());
   };
   ```
4. **Header Index Mapping**: Instead of assuming column order, the parser scans the first row (headers) and maps header names dynamically to index positions.

---

## 2. Date Format Normalization

The imported spreadsheet date column uses the format `M/D/YYYY` (e.g., `5/4/2014`). The application requires date fields stored as standard `YYYY-MM-DD` strings.

### Parser Date Logic
1. Split the CSV date cell by `/`: `[monthStr, dayStr, yearStr]`.
2. Parse components into numbers.
3. Validate and pad elements:
   - Month (`MM`): Ensure two digits (e.g., `5` -> `05`).
   - Day (`DD`): Ensure two digits (e.g., `4` -> `04`).
   - Year (`YYYY`): Use directly.
4. Recombine into `YYYY-MM-DD` (`2014-05-04`).
5. **Cross-Validation with Month/Year columns**: The CSV contains auxiliary `Year` (e.g., `2014`) and `Month` (e.g., `MAY`) columns. The parser uses these to resolve ambiguous formats:
   - If `monthStr` matches the index of the Month column name (`MAY` -> index 5), we confirm `M/D/YYYY` layout.
   - If a mismatch occurs, we fallback to Month and Year columns directly to construct the date.

---

## 3. Keeper vs. Outfield Fielding Dynamic Detection

The flat `Game` schema separates outfield fielding from wicketkeeping statistics. The CSV represents fielding in four flat columns: `Catches, Run Outs, Stumpings, Byes`.

### Detection and Fields Mapping Rules
- **Wicketkeeping Detection**: We check if `Stumpings` and `Byes` column values in the CSV are **not** `"N/A"` (and are integers instead):
  ```javascript
  const hasStumpings = row[stumpingsIndex] !== 'N/A' && !isNaN(parseInt(row[stumpingsIndex]));
  const hasByes = row[byesIndex] !== 'N/A' && !isNaN(parseInt(row[byesIndex]));
  const isKeeper = hasStumpings || hasByes;
  ```
- **Fielding Route Logic Table**:

| Field Role (`is_keeper`) | CSV Catches Route | CSV Run Outs Route | CSV Stumpings Route | CSV Byes Route |
|:---|:---|:---|:---|:---|
| **Keeper** (`true`) | Map to `catches_keeper`, set `catches = 0` | Map to `run_outs_keeper`, set `run_outs = 0` | Map to `stumpings` | Map to `byes_conceded` |
| **Outfield** (`false`) | Map to `catches`, set `catches_keeper = 0` | Map to `run_outs`, set `run_outs_keeper = 0` | Map to `0` / `null` | Map to `0` / `null` |

---

## 4. Cricket Dismissal Acronym Mapping Dictionary

To ensure that the scoreboard displays elegant, descriptive text rather than technical scorebook abbreviations, the parser maps CSV dismissal values using an exact translation dictionary:

```javascript
const DISMISSAL_DICTIONARY = {
  'CWK': 'Caught by Wicketkeeper',
  'C': 'Caught',
  'B': 'Bowled',
  'ST': 'Stumped',
  'RO': 'Run Out',
  'LBW': 'Leg Before Wicket',
  'C&B': 'Caught and Bowled',
  'HW': 'Hit Wicket',
  'NO': 'Not Out'
};
```
* **Graceful Fallback**: If the dismissal value is blank, `N/A`, `NO`, or empty, it is translated to `'None'` (and `is_out` is set to `false`). Otherwise, if it matches a key in `DISMISSAL_DICTIONARY`, we map it to the expanded description and set `is_out` based on the CSV's `Out?` column (`1` = `true`, `0` = `false`).
