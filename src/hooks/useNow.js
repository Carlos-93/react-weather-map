import { useEffect, useState } from 'react';

// Current time in milliseconds, refreshed every minute for clocks and relative times
export default function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
}