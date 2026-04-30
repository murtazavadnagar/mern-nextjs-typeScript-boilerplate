'use client';

import { useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { DebouncedFunc } from 'lodash';

export const useDebouncedCallback = <T extends (...args: never[]) => void>(
  callback: T,
  delay: number,
): DebouncedFunc<T> => {
  const debounced = useMemo(() => debounce(callback, delay), [callback, delay]);

  useEffect(() => {
    return () => {
      debounced.cancel();
    };
  }, [debounced]);

  return debounced;
};
