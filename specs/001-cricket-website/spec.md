# Feature: Modern Cricket Website

## 1. Overview

A modern and sleek website for cricket enthusiasts to record and view game statistics.

## 2. User Stories

- **US1**: As a user, I want to be able to enter the details of a cricket game I just played, so that I can keep a record of my games.
- **US2**: As a user, I want to be able to view historical stats from past games, so that I can analyze my performance over time.

## 3. Functional Requirements

- **FR1**: The website must have a landing page with two main calls to action: "Enter New Game" and "View Historical Stats".
- **FR2**: The "Enter New Game" page must contain a form to input the following information about a game:
    - Date
    - Club
    - Opponent
    - Home or Away
    - Number of runs scored
    - Batting number
    - Dismissal
    - Out?
- **FR3**: The "View Historical Stats" page must display a table of past games with the same information as the form in FR2.
- **FR4**: The historical stats page must be populated with mock data for all games played in 2026.
- **FR5**: All pages must have tests to ensure the functionality and appearance of the website.
- **FR6**: The header must contain a burger menu icon that, when clicked, opens a navigation drawer. The drawer will contain links to the "Enter New Game" and "View Historical Stats" pages.

## 4. Success Criteria

- **SC1**: The website has a modern, sleek, and visually appealing design.
- **SC2**: The navigation is intuitive and user-friendly.
- **SC3**: The website is fully responsive and functions correctly on desktop, tablet, and mobile devices.

## 5. Data Model

- **Game**
    - `date`: Date - The date the game was played.
    - `club`: String - The name of the user's club.
    - `opponent`: String - The name of the opposing team.
    - `location`: String - "Home" or "Away".
    - `runs_scored`: Number - The number of runs the user scored.
    - `batting_number`: Number - The user's batting position.
    - `dismissal`: String - How the user was dismissed (e.g., "Bowled", "Caught", "LBW").
    - `is_out`: Boolean - Whether the user was out or not.

## 6. Assumptions

- The data for historical stats is mocked and does not need to be persisted or fetched from a live database.
- The initial version will not include user accounts or authentication.

## 7. Out of Scope

- User authentication and user-specific data.
- Real-time data updates for live games.
- Editing or deleting game records.
- Advanced statistical analysis or visualizations.
