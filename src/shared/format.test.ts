import { describe, expect, it } from 'vitest';
import { formatMoney, formatPercent } from './format';

describe('market formatting', () => {
  it('formats GBP prices', () => {
    expect(formatMoney(123.45)).toBe('£123.45');
  });

  it('formats signed percentage changes', () => {
    expect(formatPercent(110, 100)).toBe('+10.00%');
    expect(formatPercent(95, 100)).toBe('-5.00%');
  });
});
