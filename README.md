# Live Trading Dashboard

A compact simulated trading dashboard for portfolio use. It shows a watchlist, live price changes, a simple chart, persisted favourites, recent trades and a pause/resume control for live updates.

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

## Performance Decisions

- Live tick handling is isolated from presentation components.
- Chart data is capped to the latest 24 points per asset.
- Recent trades are capped to the latest 12 rows, so virtualization would add complexity without value.
- Expensive selected-chart lookups are memoised in the dashboard component.

## Tests

```bash
npm test
```
