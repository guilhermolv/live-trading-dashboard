import express from 'express';
import http from 'node:http';
import { WebSocketServer } from 'ws';
import type { Asset, Tick, Trade } from '../src/shared/schemas';

const assets: Asset[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 84200, previousClose: 83100 },
  { symbol: 'ETH', name: 'Ethereum', price: 4620, previousClose: 4710 },
  { symbol: 'AAPL', name: 'Apple', price: 176.34, previousClose: 174.12 },
  { symbol: 'TSLA', name: 'Tesla', price: 248.5, previousClose: 253.8 },
];

function tick(): Tick {
  const asset = assets[Math.floor(Math.random() * assets.length)];
  const drift = asset.price * ((Math.random() - 0.48) / 120);
  asset.price = Number(Math.max(1, asset.price + drift).toFixed(2));
  const trade: Trade = {
    id: crypto.randomUUID(),
    symbol: asset.symbol,
    side: Math.random() > 0.5 ? 'buy' : 'sell',
    quantity: Number((Math.random() * 9 + 1).toFixed(2)),
    price: asset.price,
    createdAt: new Date().toISOString(),
  };
  return { type: 'market-tick', asset: { ...asset }, trade, createdAt: trade.createdAt };
}

const app = express();
app.get('/api/assets', (_request, response) => response.json(assets));

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });
setInterval(() => {
  const message = JSON.stringify(tick());
  wss.clients.forEach((client) => client.readyState === client.OPEN && client.send(message));
}, 1000);

server.listen(8788, () => console.log('Trading dashboard API listening on http://localhost:8788'));
