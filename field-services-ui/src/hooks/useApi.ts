/**
 * useApi Hook
 * Custom hook for making API calls with loading and error states
 */

import { useState, useCallback } from 'react';
import { ApiException } from '../services/api.service';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * Custom hook for API calls with state management
 * @param apiFunction - The API function to execute
 * @returns Object with data, loading, error states and execute function
 */
export function useApi<T>(apiFunction: (...args: unknown[]) => Promise<T>): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: unknown[]) => {
      setState({ data: null, loading: true, error: null });

      try {
        const result = await apiFunction(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error) {
        const errorMessage =
          error instanceof ApiException
            ? error.message
            : error instanceof Error
              ? error.message
              : 'An unknown error occurred';

        setState({ data: null, loading: false, error: errorMessage });
        return null;
      }
    },
    [apiFunction],
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

export default useApi;
