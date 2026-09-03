import '@testing-library/jest-dom';
import React from 'react';

// Polyfill TextEncoder and TextDecoder which react-router-dom v7 needs in Jest jsdom
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Robust virtual mocking for @mui/icons-material subpath imports to bypass JSDOM/Jest module resolution issues
jest.mock('@mui/icons-material/Menu', () => () => <span data-testid="MenuIcon" />, { virtual: true });
jest.mock('@mui/icons-material/Home', () => () => <span data-testid="HomeIcon" />, { virtual: true });
jest.mock('@mui/icons-material/AddCircleOutlined', () => () => <span data-testid="AddCircleOutlinedIcon" />, { virtual: true });
jest.mock('@mui/icons-material/History', () => () => <span data-testid="HistoryIcon" />, { virtual: true });
jest.mock('@mui/icons-material/SportsCricket', () => () => <span data-testid="SportsCricketIcon" />, { virtual: true });
jest.mock('@mui/icons-material/CheckCircleOutlined', () => () => <span data-testid="CheckCircleOutlinedIcon" />, { virtual: true });
jest.mock('@mui/icons-material/CancelOutlined', () => () => <span data-testid="CancelOutlinedIcon" />, { virtual: true });
jest.mock('@mui/icons-material/ArrowBack', () => () => <span data-testid="ArrowBackIcon" />, { virtual: true });
jest.mock('@mui/icons-material/Refresh', () => () => <span data-testid="RefreshIcon" />, { virtual: true });
jest.mock('@mui/icons-material/Save', () => () => <span data-testid="SaveIcon" />, { virtual: true });
jest.mock('@mui/icons-material/DeleteOutlined', () => () => <span data-testid="DeleteOutlinedIcon" />, { virtual: true });
jest.mock('@mui/icons-material/BarChart', () => () => <span data-testid="BarChartIcon" />, { virtual: true });
jest.mock('@mui/icons-material/FilterAltOff', () => () => <span data-testid="FilterAltOffIcon" />, { virtual: true });
jest.mock('@mui/icons-material/TableRows', () => () => <span data-testid="TableRowsIcon" />, { virtual: true });
jest.mock('@mui/icons-material/QueryStats', () => () => <span data-testid="QueryStatsIcon" />, { virtual: true });
