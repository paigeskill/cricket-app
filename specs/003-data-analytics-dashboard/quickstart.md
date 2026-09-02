# Validation and Quickstart Guide: Advanced Analytics Dashboard

This guide details how to set up the development environment, execute the test suite, and manually validate the data analytics and graphing features in your web browser.

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
- Accurate calculation of Multi-dimensional averages and Runs per Dismissal.
- Dynamic filtering based on multiselect Year/Club/Location and grouping updates.
- Rendering of inline custom SVG charts.

---

## 3. Manual Validation Scenarios

### Scenario A: Filtering and Grouping Analytics
1. Click on the hamburger menu drawer in the header, and select **"Analytics Dashboard"**.
2. **Expected Outcome**: You are redirected to `/analytics` with the dashboard loaded.
3. Select **"Group By"**: `Club` (instead of the default `Year`).
4. **Expected Outcome**:
   - The table/charts instantly aggregate runs and averages per club.
   - For example, you should see *West London CC* listed with its total runs, average runs, and wickets.
5. In the **Filter Bar** at the top:
   - Select **Venue Filter**: `Away Only`.
6. **Expected Outcome**:
   - The aggregates recalculate. All totals now only sum matches played "Away".

### Scenario B: Chart Visualization Toggle
1. Under the **"Runs & Averages"** tab, click the **"Graph View"** toggle button.
2. **Expected Outcome**:
   - The grid table is replaced with interactive custom SVG charts (Line/Bar graphs).
   - Hover your mouse over one of the bars/points.
   - **Expected Outcome**: An elegant, floating dark tooltip displays showing the exact value of runs or average at that coordinate.

### Scenario C: Dismissal Percentage Breakdown
1. Select the **"Dismissals"** tab.
2. Toggle to **"Graph View"**.
3. **Expected Outcome**:
   - An elegant SVG Donut chart displays, slicing up dismissal types (Caught, Bowled, LBW, etc.).
   - Hover your mouse over the colored slices to reveal the percentage representation.
