import { useEffect, useRef, useState } from 'react';
import { tickSchema } from '../../shared/schemas';
import { useMarketStore } from './store';

type Status = 'connecting' | 'live' | 'reconnecting' | 'offline';

export function useMarketSocket() {
  const [status, setStatus] = useState<Status>('connecting');
  const applyTick = useMarketStore((state) => state.applyTick);
  const retryRef = useRef<number>();
  const socketRef = useRef<WebSocket>();

  useEffect(() => {
    let closed = false;
    const connect = () => {
      setStatus((current) => (current === 'connecting' ? 'connecting' : 'reconnecting'));
      const socket = new WebSocket(`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`);
      socketRef.current = socket;
      socket.addEventListener('open', () => setStatus('live'));
      socket.addEventListener('message', (event) => {
        const parsed = tickSchema.safeParse(JSON.parse(event.data));
        if (parsed.success) applyTick(parsed.data);
      });
      socket.addEventListener('close', () => {
        if (closed) return;
        setStatus('offline');
        retryRef.current = window.setTimeout(connect, 1500);
      });
      socket.addEventListener('error', () => socket.close());
    };
    connect();
    return () => {
      closed = true;
      window.clearTimeout(retryRef.current);
      socketRef.current?.close();
    };
  }, [applyTick]);

  return status;
}
