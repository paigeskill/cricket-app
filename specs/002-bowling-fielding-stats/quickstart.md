# Validation and Quickstart Guide: Bowling & Fielding Expansion

This guide details how to set up the development environment, execute the test suite, and manually validate the bowling and fielding features in your web browser.

## 1. Local Development Setup

To verify and run this expanded feature locally, follow these steps:

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

You can run the unit and integration test suites using the following command:

```bash
npm test
```

Tests verify:
- Accurate calculation of Bowling Economy, average, and strike rate.
- Input validation (e.g., rejecting invalid cricket overs like `3.6`).
- Responsive tab toggles and section renderings.

---

## 3. Manual Validation Scenarios

### Scenario A: Creating a New Multi-Discipline Record
1. Click on **"Enter New Game"** from the landing page.
2. Select the **"Game & Batting"** section:
   - Fill in: Date, Club, Opponent, Venue.
   - Enter Batting runs, position, and dismissal.
3. Select the **"Bowling"** section:
   - Enter **Overs Bowled**: `4.2`
   - Enter **Maidens**: `1`
   - Enter **Runs Conceded**: `18`
   - Enter **Wickets**: `2`
4. Select the **"Fielding"** section:
   - Enter **Catches**: `1`
5. Click **"Save Game Details"**.
6. **Expected Outcome**:
   - You should see a success toast and be redirected to the Stats dashboard.
   - The aggregate KPI cards at the top must now include your bowling and fielding statistics.
   - In the Bowling tab of the scorecard table, the newly created game must display **Economy**: `4.15` (calculated as $18 / (26 / 6)$) and **Average**: `9.00` ($18 / 2$).

### Scenario B: Boundary Validations
1. Open the Game Form and go to the **Bowling** section.
2. Enter **Overs Bowled**: `3.6` (invalid balls part).
3. Try to save.
4. **Expected Outcome**:
   - The form should block submission and show an error helper: *"Decimal part of overs bowled can only be between .0 and .5 balls."*
