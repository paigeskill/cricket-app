# Data Model: Advanced Analytics & Filtering

The analytics engine processes the list of match records stored in the `cricket_games` local database array.

## Match Record Fields used in Analytics

Each `Game` record matches the flat unified format:

| Field Name | Type | Purpose in Analytics |
|:---|:---|:---|
| `id` | String | Unique ID |
| `date` | String | Parsed to extract **Year** (`date.substring(0,4)`) and **Month** index (`date.substring(5,7)`) |
| `club` | String | Dimension grouped by and filtered side-by-side |
| `location` | String | Filtered to compare Home vs Away performances |
| `did_not_bat`| Boolean | If `true`, this row is excluded from batting innings and batting averages calculations |
| `runs_scored`| Number | Summed for Total Runs, averaged for batting averages and highest score trends |
| `is_out` | Boolean | Aggregated to compute Total Wickets lost and **Runs per Dismissal** |
| `dismissal` | String | Aggregated to count distribution of dismissal types (Caught, Bowled, LBW, etc.) |

---

## Derived Calculation Models

Aggregations computed in the frontend:

### Batting Average per Group (e.g. per Club or Month)
$$\text{Average} = \frac{\sum \text{runs\_scored}}{\text{Count of games where did\_not\_bat is false}}$$

### Runs per Dismissal per Group
$$\text{Runs per Dismissal} = \frac{\sum \text{runs\_scored}}{\text{Count of games where is\_out is true}}$$
*Note*: If count of `is_out === true` is 0, the player was not out in any inning within that filtered group. The system will display `'N/A (Not Out)'` to prevent division-by-zero errors.
