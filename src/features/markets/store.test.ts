import { describe, expect, it } from 'vitest';
import { useMarketStore } from './store';

describe('favourites store', () => {
  it('adds and removes favourite symbols', () => {
    useMarketStore.setState({ favourites: [] });
    useMarketStore.getState().toggleFavourite('AAPL');
    expect(useMarketStore.getState().favourites).toContain('AAPL');
    useMarketStore.getState().toggleFavourite('AAPL');
    expect(useMarketStore.getState().favourites).not.toContain('AAPL');
  });
});
