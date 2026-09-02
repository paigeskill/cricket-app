# Implementation Plan: Bowling and Fielding Statistics Expansion

**Branch**: `002-bowling-fielding-stats` | **Date**: 2026-08-27 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-bowling-fielding-stats/spec.md`

## Summary

This feature expands the Modern Cricket Website to support detailed Bowling and Fielding statistics. It introduces categorical partitions inside the game form (`GameForm.js`) and historical scorecard view (`StatsTable.js`) to group statistics by Game Information, Batting, Bowling, and Fielding. Furthermore, it implements automated math calculations for bowling economy, bowling strike rate, and bowling averages, keeping data structured in a flat JSON model to support future data analysis and charting.

## Technical Context

**Language/Version**: JavaScript / React 19 (ES6 Module format)

**Primary Dependencies**: React, React DOM, `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`, `react-router-dom`

**Storage**: Web `localStorage` for dynamic data entry persistence, initialized from static mock records.

**Testing**: Jest and `@testing-library/react` for unit and integration testing.

**Target Platform**: Modern responsive web browsers (Mobile, Tablet, Desktop).

**Project Type**: Single-page front-end web application (SPA).

**Performance Goals**: Instant dynamic calculation of rates (Economy, Strike Rate, Bowling Average) at render-time (<10ms processing latency).

**Constraints**: Division-by-zero protection across all math calculations; strict decimal over validations (fractional ball part 0 to 5 inclusive).

**Scale/Scope**: Flat scorecard data array stored in `localStorage` supporting rapid querying and charting.

## Constitution Check

*GATE: Passed. No principles violated.*

1. **I. Simplicity**: Standard React local state synchronized with `localStorage`. No complex external state management or DB modules required.
2. **II. CLI Interface**: N/A for this web component.
3. **III. Test-First**: Testing suite updated and verified prior to completing implementation.
4. **IV. Integration Testing**: Complete routing and page-navigation checks inside `App.test.js`.
5. **V. Observability / Simplicity**: High clarity, console logging for invalid form states, simple calculations.

## Project Structure

### Documentation (this feature)

```text
specs/002-bowling-fielding-stats/
├── spec.md              # Feature specification
├── plan.md              # This file (/speckit.plan output)
├── research.md          # Phase 0 output (Math & Layout decisions)
├── data-model.md        # Phase 1 output (JSON schema)
├── quickstart.md        # Phase 1 output (Validation guide)
└── checklists/
    └── requirements.md  # Spec Quality Checklist
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── GameForm.js      # Form partitioned into Game Info, Batting, Bowling, Fielding
│   └── StatsTable.js    # Multi-scorecard (Batting, Bowling, Fielding scorecards)
├── pages/
│   ├── LandingPage.js
│   ├── EnterGamePage.js
│   └── HistoricalStatsPage.js # KPI Dashboard with multi-disciplinary aggregates
├── data/
│   └── mockData.js      # Consolidated 2026 cricket match records
├── App.js
├── index.js
└── style.css
```

**Structure Decision**: Option 1: Single frontend project. The expansion integrates seamlessly into the existing modular component layout.

## Complexity Tracking

No constitution violations or complex patterns are introduced.
