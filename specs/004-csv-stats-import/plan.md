# Implementation Plan: CSV Stats Import

**Branch**: `004-csv-stats-import` | **Date**: 2026-09-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-csv-stats-import/spec.md`

## Summary

This feature implements a client-side **CSV Stats Import** mechanism to allow users to load all their past cricket match history. It replaces the "Reset Mock Data" button on the **Historical Statistics** page with a modern "Import Data" button (with file selector) and parses the incoming spreadsheet entirely in the browser. It translates standard dismissal acronyms, resolves wicketkeeping roles dynamically based on stumping and bye integers, and permanently stores the resulting structured `Game` list in browser local storage (`cricket_games`).

## Technical Context

- **Framework**: React.js (React 19)
- **Styling**: Material UI (MUI v9)
- **File Parsing**: Client-side `FileReader` API combined with a custom, lightweight, dependency-free CSV parser.
- **Role Isolation**: Automatic logic to route catches and runouts to outfield fields (`catches`, `run_outs`) or keeper-specific fields (`catches_keeper`, `run_outs_keeper`) and set `is_keeper: true/false` depending on the presence of stumping and bye integers.
- **Persistence**: Flat-file structured JSON arrays committed directly to `localStorage` under `cricket_games`.
- **Validation**: Strict boundary checks (numeric ranges, valid dates) and grace-filled fallback for `N/A` missing data.

## Constitution Check

*GATE: Passed. No principles violated.*

1. **I. Simplicity**: Instead of importing heavy external CSV libraries (like PapaParse), a custom robust CSV parsing function will be used. This eliminates peer-dependency build bloat.
2. **II. Performance**: Parsing of CSV files (even with thousands of rows) executes in-browser in <10ms with zero server latency.
3. **III. Testing**: Comprehensive unit tests will verify parsing correctness, date formatting, role mapping, acronym resolution, and error reporting.

## Project Structure

### Documentation (this feature)

```text
specs/004-csv-stats-import/
├── spec.md              # Feature specification
├── plan.md              # This file (/speckit.plan output)
├── research.md          # Phase 0 output (CSV parsing & acronym dictionary)
├── data-model.md        # Phase 1 output (JSON field mapping and CSV columns)
├── quickstart.md        # Phase 1 output (Manual and automated validation guides)
├── checklists/
│   └── requirements.md  # Spec Quality Checklist
└── contracts/
    └── placeholder.txt  # Placeholder in contracts directory
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── GameRowCells.js
│   ├── StatsTable.js
│   └── EditGameDialog.js
├── pages/
│   ├── HistoricalStatsPage.js  # Replaces Reset Mock Data button with Import Data and handles file upload
│   ├── HistoricalStatsPage.test.js # Test suite expanded for file import
│   ├── EnterGamePage.js
│   └── LandingPage.js
├── data/
│   └── mockData.js
└── utils/
    ├── csvParserHelper.js      # NEW: Custom CSV parsing, acronym translation, and keeper logic
    └── csvParserHelper.test.js # NEW: Automated test suite verifying parser rules
```

## Complexity Tracking

By utilizing the browser's native `FileReader` and standard JavaScript RegExp/String tokenizer splitters, we achieve lightweight and robust CSV handling with zero external node module dependencies, ensuring the core principle of **Simplicity** is rigorously maintained.
