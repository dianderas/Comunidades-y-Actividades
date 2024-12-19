/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";

interface Props<T> {
  request: (...args: any[]) => Promise<T>;
}

export const useApi = <T,>({ request }: Props<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      const controller = new AbortController();
      controllerRef.current = controller
      const signal = controller.signal;

      setLoading(true);
      setError(null);
      try {
        const promise = request(...args);

        const response = await new Promise<T>((resolve, reject) => {
          promise.then(resolve).catch(reject);

          signal.addEventListener("abort", () => {
            reject(new Error("Request aborted"));
          });
        })

        if (!signal.aborted) {
          setData(response);
        }
      } catch (error) {
        if (!signal.aborted) {
          setError(error as Error);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    }, [request]);

  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    }
  }, []);

  return { data, loading, error, execute }
}