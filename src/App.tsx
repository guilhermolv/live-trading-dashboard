import { useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAssets } from './features/markets/useAssets';
import { useMarketSocket } from './features/markets/useMarketSocket';
import { useMarketStore } from './features/markets/store';
import { formatMoney, formatPercent, getChange } from './shared/format';
import './styles.css';

const queryClient = new QueryClient();

function Dashboard() {
  const { isLoading, isError, error } = useAssets();
  const status = useMarketSocket();
  const assets = useMarketStore((state) => state.assetList);
  const history = useMarketStore((state) => state.history);
  const trades = useMarketStore((state) => state.trades);
  const favourites = useMarketStore((state) => state.favourites);
  const toggleFavourite = useMarketStore((state) => state.toggleFavourite);
  const paused = useMarketStore((state) => state.paused);
  const setPaused = useMarketStore((state) => state.setPaused);
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const selectedAsset = assets.find((asset) => asset.symbol === selectedSymbol) ?? assets[0];
  const selectedHistory = useMemo(() => history[selectedAsset?.symbol ?? ''] ?? [], [history, selectedAsset?.symbol]);

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <p>Simulated market data</p>
          <h1>Live Trading Dashboard</h1>
        </div>
        <div className="actions">
          <span className={`badge ${status}`}>{paused ? 'Paused' : status}</span>
          <button type="button" onClick={() => setPaused(!paused)}>{paused ? 'Resume' : 'Pause'}</button>
        </div>
      </header>

      {isLoading ? <section className="panel">Loading watchlist...</section> : null}
      {isError ? <section className="panel">Error: {error.message}</section> : null}
      {!isLoading && !isError && assets.length === 0 ? <section className="panel">No assets available.</section> : null}

      {selectedAsset ? (
        <div className="grid">
          <section className="panel watchlist" aria-label="Asset watchlist">
            {assets.map((asset) => {
              const change = getChange(asset.price, asset.previousClose);
              return (
                <button key={asset.symbol} className={asset.symbol === selectedAsset.symbol ? 'asset selected' : 'asset'} type="button" onClick={() => setSelectedSymbol(asset.symbol)}>
                  <span><b>{asset.symbol}</b><small>{asset.name}</small></span>
                  <span><b>{formatMoney(asset.price)}</b><small className={change >= 0 ? 'up' : 'down'}>{formatPercent(asset.price, asset.previousClose)}</small></span>
                  <span
                    role="button"
                    tabIndex={0}
                    aria-label={`${favourites.includes(asset.symbol) ? 'Remove' : 'Add'} ${asset.symbol} favourite`}
                    onClick={(event) => { event.stopPropagation(); toggleFavourite(asset.symbol); }}
                    onKeyDown={(event) => { if (event.key === 'Enter') toggleFavourite(asset.symbol); }}
                  >
                    {favourites.includes(asset.symbol) ? '★' : '☆'}
                  </span>
                </button>
              );
            })}
          </section>

          <section className="panel chart">
            <h2>{selectedAsset.name}</h2>
            <strong>{formatMoney(selectedAsset.price)}</strong>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={selectedHistory}>
                <XAxis dataKey="time" hide />
                <YAxis domain={['dataMin', 'dataMax']} width={80} />
                <Tooltip formatter={(value) => formatMoney(Number(value))} />
                <Line type="monotone" dataKey="price" stroke="#0f766e" strokeWidth={3} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </section>

          <section className="panel">
            <h2>Recent trades</h2>
            <table>
              <thead><tr><th>Asset</th><th>Side</th><th>Qty</th><th>Price</th></tr></thead>
              <tbody>{trades.map((trade) => <tr key={trade.id}><td>{trade.symbol}</td><td>{trade.side}</td><td>{trade.quantity}</td><td>{formatMoney(trade.price)}</td></tr>)}</tbody>
            </table>
          </section>
        </div>
      ) : null}
    </main>
  );
}

export function App() {
  return <QueryClientProvider client={queryClient}><Dashboard /></QueryClientProvider>;
}
