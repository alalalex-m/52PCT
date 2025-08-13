import { useState, useEffect } from 'react';
import { canUseStorage } from '@/lib/utils';

export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [state, setState] = useState<T>(() => {
    const init = typeof initialValue === "function" ? (initialValue as () => T)() : initialValue;
    if (!canUseStorage()) return init;
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : init;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    if (!canUseStorage()) return;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);

  return [state, setState] as const;
} 