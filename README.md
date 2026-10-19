# Live Trading Dashboard

A compact simulated trading dashboard for portfolio use. It shows a watchlist, live price changes, a simple chart, persisted favourites, recent trades and a pause/resume control for live updates.

## Overview

This project demonstrates how a modern fintech frontend can combine REST APIs and real-time WebSocket data without sacrificing type safety, responsiveness or maintainability.

It is a simulated market-data dashboard rather than a real order-execution platform. The focus is on frontend architecture, live-data handling, runtime validation, performance and clear presentation of financial information.

## Features

- Live simulated prices for cryptocurrency and equity instruments
- REST-based initial market snapshot
- Real-time WebSocket price and trade events
- Automatic connection-status tracking and reconnection
- Interactive instrument watchlist
- Responsive time-series price chart
- Recent buy and sell activity
- Persistent favourite instruments
- Pause and resume controls
- Loading, error and empty states
- Responsive desktop and mobile layouts
- Runtime validation of external data
- Automated unit tests

## Run

```bash
npm install
npm run dev
```

Frontend: `http://localhost:5174`  
Backend: `http://localhost:8788`

## Architecture

- `server/` generates simulated market ticks and trades over WebSockets.
- `src/features/markets/` contains the market API, WebSocket hook and Zustand state.
- `src/shared/` contains schemas and formatting utilities.

React Query owns the initial REST asset fetch. Zustand owns frequently changing live data so WebSocket updates do not force the query cache to churn. The store caps chart history and recent trades to avoid unbounded rerender work.

## Tech Stack

- **React 18** — component-based user interface
- **TypeScript** — static typing across the frontend, server and shared data models
- **Vite** — development server and production build tooling
- **TanStack Query** — initial REST data fetching, caching and request states
- **Zustand** — lightweight state management for frequently changing market data
- **WebSockets** — real-time price and trade updates
- **Zod** — runtime validation of REST responses and WebSocket messages
- **Recharts** — responsive time-series price visualisation
- **Express** — REST API and HTTP server
- **Vitest** — unit testing for state transitions and financial formatting
- **Testing Library and jsdom** — browser-like testing environment

## Skills Demonstrated

### Real-Time Frontend Development

The dashboard combines an initial REST snapshot with continuous WebSocket events. It tracks connection state, validates incoming messages, handles socket errors and automatically reconnects after a disconnection.

### Financial Data Presentation

The interface presents live instrument prices, percentage movement from the previous close, time-series history and recent buy/sell activity. Currency and percentage formatting are kept in reusable utilities for consistent display.

### State Management

TanStack Query manages the REST request lifecycle, caching, loading and error states. Zustand manages high-frequency market updates, chart history, recent trades, favourites and pause/resume behaviour.

This separation prevents rapidly changing WebSocket data from unnecessarily churning the query cache.

### Runtime Data Validation

Zod schemas validate data at both REST and WebSocket boundaries before it enters application state. TypeScript provides compile-time safety, while Zod protects the application from malformed data at runtime.

### Performance Engineering

- Chart history is limited to the latest 24 points per instrument.
- Recent trades are limited to 12 records.
- Duplicate trade IDs are removed before state is updated.
- Chart animations are disabled during live updates.
- Derived chart data is memoised.
- Components subscribe to focused slices of the Zustand store.

These decisions keep memory usage and rendering work predictable during a long-running session.

### Resilience and User Feedback

The interface represents loading, error, empty, connecting, live, reconnecting, offline and paused states. WebSocket timers and connections are cleaned up when the component unmounts.

### Responsive and Accessible UI

The layout adapts from a three-column desktop dashboard to a single-column mobile view. Semantic headings, tables, buttons and ARIA labels provide a foundation for an accessible experience.

### Testing and Code Quality

Unit tests cover financial formatting and persisted watchlist behaviour. The project uses shared data models and separates API access, schemas, state management, connection lifecycle and presentation concerns.

## Performance Decisions

- Live tick handling is isolated from presentation components.
- Chart data is capped to the latest 24 points per asset.
- Recent trades are capped to the latest 12 rows, so virtualization would add complexity without value.
- Expensive selected-chart lookups are memoised in the dashboard component.

## Tests

```bash
npm test
```
