import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAssets } from './api';
import { useMarketStore } from './store';

export function useAssets() {
  const query = useQuery({ queryKey: ['assets'], queryFn: fetchAssets, staleTime: 30_000 });
  const hydrate = useMarketStore((state) => state.hydrate);

  useEffect(() => {
    if (query.data) hydrate(query.data);
  }, [hydrate, query.data]);

  return query;
}
