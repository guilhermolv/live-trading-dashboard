import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Asset, Tick, Trade } from '../../shared/schemas';

type Point = { time: string; price: number };

type MarketState = {
  assets: Record<string, Asset>;
  history: Record<string, Point[]>;
  trades: Trade[];
  favourites: string[];
  paused: boolean;
  hydrate: (assets: Asset[]) => void;
  applyTick: (tick: Tick) => void;
  toggleFavourite: (symbol: string) => void;
  setPaused: (paused: boolean) => void;
};

export const useMarketStore = create<MarketState>()(
  persist(
    (set, get) => ({
      assets: {},
      history: {},
      trades: [],
      favourites: ['BTC', 'ETH'],
      paused: false,
      hydrate: (assets) =>
        set((state) => ({
          assets: { ...state.assets, ...Object.fromEntries(assets.map((asset) => [asset.symbol, asset])) },
          history: {
            ...state.history,
            ...Object.fromEntries(assets.map((asset) => [asset.symbol, state.history[asset.symbol] ?? [{ time: 'open', price: asset.price }]])),
          },
        })),
      applyTick: (tick) => {
        if (get().paused) return;
        set((state) => ({
          assets: { ...state.assets, [tick.asset.symbol]: tick.asset },
          history: {
            ...state.history,
            [tick.asset.symbol]: [...(state.history[tick.asset.symbol] ?? []), { time: new Date(tick.createdAt).toLocaleTimeString(), price: tick.asset.price }].slice(-24),
          },
          trades: [tick.trade, ...state.trades].slice(0, 12),
        }));
      },
      toggleFavourite: (symbol) =>
        set((state) => ({
          favourites: state.favourites.includes(symbol) ? state.favourites.filter((item) => item !== symbol) : [...state.favourites, symbol],
        })),
      setPaused: (paused) => set({ paused }),
    }),
    { name: 'portfolio-trading-dashboard' },
  ),
);
