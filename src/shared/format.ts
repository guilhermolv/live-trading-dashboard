export function formatMoney(value: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(price: number, previousClose: number) {
  const change = ((price - previousClose) / previousClose) * 100;
  return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
}

export function getChange(price: number, previousClose: number) {
  return ((price - previousClose) / previousClose) * 100;
}
