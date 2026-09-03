# Data Model: CSV Field Mappings and Game Structure

This document defines how the columns in the imported CSV spreadsheet map to the unified local `Game` entity, detailing types, default fallbacks, and validation constraints.

## 1. CSV-to-Entity Field Mapping

The following table defines how each column header of the imported CSV corresponds to the `Game` schema fields:

| CSV Column Header | 0-Based Column Index | Game Field | Type | Default Value | Parsing & Validation Rules |
|:---|:---|:---|:---|:---|:---|
| **Club** | 0 | `club` | String | `""` | Trimmed string. |
| **Team** | 1 | `team` | String | `undefined` | Optional field. Stored if present. |
| **Opponent** | 2 | `opponent` | String | `""` | Trimmed string. |
| **Date** | 3 | `date` | String | Current Date | Parsed from `M/D/YYYY` format and converted to `YYYY-MM-DD`. |
| **Year** | 4 | *None* | Number | *None* | Used for verifying/cross-validating the Year part of the Date. |
| **Month** | 5 | *None* | String | *None* | Used for verifying/cross-validating the Month part of the Date (e.g. `MAY` -> index `5`). |
| **H / A** | 6 | `location` | `"Home"` \| `"Away"` | `"Home"` | mapped from `"H"` -> `"Home"` and `"A"` -> `"Away"`. |
| **Overs** | 7 | `overs_bowled` | Number \| `null` | `null` | Bowling overs. mapped from integer/decimal. If `N/A`, stored as `null`. |
| **Maidens** | 8 | `maidens_bowled` | Number \| `null` | `null` | Maiden overs. If `N/A`, stored as `null`. |
| **Runs** (Bowling) | 9 | `runs_conceded` | Number \| `null` | `null` | Bowling runs conceded. Distinguished from Batting Runs by index position 9. If `N/A`, stored as `null`. |
| **Wickets** | 10 | `wickets_taken` | Number \| `null` | `null` | Wickets taken. If `N/A`, stored as `null`. |
| **Number** (Position)| 11 | `batting_number` | Number \| `null` | `null` | Batting line-up position. If `N/A`, stored as `null`. |
| **Runs** (Batting) | 12 | `runs_scored` | Number \| `null` | `null` | Batting runs scored. Distinguished from Bowling Runs by index position 12. If `N/A`, stored as `null` (sets `did_not_bat` to `true`). |
| **Dismissal** | 13 | `dismissal` | String | `"None"` | Translated from dismissal acronyms to descriptive names. |
| **Out?** | 14 | `is_out` | Boolean | `false` | Converted from CSV representation (`1` -> `true`, others -> `false`). |
| **Catches** | 15 | `catches` \| `catches_keeper` | Number \| `null` | `null` | Categorized depending on keeper check. If `N/A`, stored as `null`. |
| **Run Outs** | 16 | `run_outs` \| `run_outs_keeper` | Number \| `null` | `null` | Categorized depending on keeper check. If `N/A`, stored as `null`. |
| **Stumpings** | 17 | `stumpings` | Number \| `null` | `null` | Handled under wicketkeeping check. If `N/A`, stored as `null`. |
| **Byes** | 18 | `byes_conceded` | Number \| `null` | `null` | Handled under wicketkeeping check. If `N/A`, stored as `null`. |

---

## 2. Dynamic Wicketkeeping Detection

Wicketkeeping fields require partitioning depending on whether the player kept wicket for that specific match.

### Detection Rule
A match is classified as a wicketkeeping match if and only if:
1. `Stumpings` and `Byes` column values in the CSV are **not** `N/A`.
2. They are parseable as valid integers.

### Field Assignment Routing
* **If `is_keeper === true`**:
  * `catches_keeper` = Integer parsed from `Catches` column.
  * `run_outs_keeper` = Integer parsed from `Run Outs` column.
  * `stumpings` = Integer parsed from `Stumpings` column.
  * `byes_conceded` = Integer parsed from `Byes` column.
  * `catches` = `null`
  * `run_outs` = `null`
* **If `is_keeper === false`**:
  * `catches` = Integer parsed from `Catches` column.
  * `run_outs` = Integer parsed from `Run Outs` column.
  * `catches_keeper` = `null`
  * `run_outs_keeper` = `null`
  * `stumpings` = `null`
  * `byes_conceded` = `null`

---

## 3. Batting Graceful Exclusions (`did_not_bat`)

If batting `Runs` is `N/A`, the match must be marked as `did_not_bat: true` on the parsed `Game` object:
* `did_not_bat` = `true`
* `runs_scored` = `null`
* `batting_number` = `null`
* `is_out` = `false`
* `dismissal` = `"DNB"` (Did Not Bat)

Otherwise, `did_not_bat` is set to `false`.
