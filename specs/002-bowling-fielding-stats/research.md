# Research and Technical Decisions: Bowling & Fielding Expansion

This document outlines the engineering decisions and mathematical calculations established during Phase 0 to ensure the accuracy of statistical computations and the clean layout of UI components.

## 1. Cricket Statistics Calculations

### Bowling Economy (Econ)
* **Standard Formula**: `Runs Conceded / (Balls Bowled / 6)`
* **The Fractional Over Challenge**: In cricket, overs are represented as a decimal, e.g. `3.4` overs means 3 complete overs of 6 balls, plus 4 extra balls. A simple float division `Runs / 3.4` would lead to incorrect statistics.
* **Resolution**: Translate decimal overs into total balls bowled:
  $$\text{Balls Bowled} = (\lfloor\text{Overs}\rfloor \times 6) + ((\text{Overs} \bmod 1) \times 10)$$
  *Example*: `4.2` overs $\rightarrow (4 \times 6) + (0.2 \times 10) = 24 + 2 = 26 \text{ balls}$.
  $$\text{Economy} = \frac{\text{Runs Conceded}}{\text{Balls Bowled} / 6} = \frac{\text{Runs Conceded} \times 6}{\text{Balls Bowled}}$$
  *Example*: 18 runs conceded in 4.2 overs $\rightarrow \frac{18 \times 6}{26} = 4.15$ economy rate.

### Bowling Average (Avg)
* **Standard Formula**: `Runs Conceded / Wickets Taken`
* **Boundary Case**: If wickets is `0`, average is undefined. The system will display `'N/A'` or `'—'` and exclude this row/match from aggregate average computations if wickets taken is `0`.

### Bowling Strike Rate (SR)
* **Standard Formula**: `Balls Bowled / Wickets Taken`
* **Boundary Case**: If wickets is `0`, strike rate is undefined. The system will display `'N/A'` or `'—'`.

---

## 2. UI/UX Layout Selection

### Form Categorization
* **Alternative 1**: MUI Vertical/Horizontal `Tabs`
* **Alternative 2**: Collapsible Accordions
* **Alternative 3**: Styled MUI `Card` sections grouped in a responsive `Grid`
* **Decision**: We will use a hybrid tabbed or card-based grouping. Since the user "likes how the current form looks", we will preserve the central card style but use MUI **`Tabs`** to toggle between **"Game Info & Batting"**, **"Bowling"**, and **"Fielding"** forms. This avoids vertical scrolling, looks incredibly sleek, and works beautifully on mobile viewports.

---

## 3. Data Structure Decisions

* **Flat-file State vs. Nested Objects**:
  * **Option A**: Nested `{ gameInfo: {}, batting: {}, bowling: {} }`
  * **Option B**: Flat `{ id, date, club, runs_scored, overs_bowled, catches, ... }`
  * **Decision**: We will use **Option B (Flat Structure)**. Flat JSON entries make it incredibly simple to filter, map, and pass datasets directly to prospective charting libraries (like Chart.js or Recharts) in the future. It is also far easier to load and save to `localStorage` without deep merging errors.
