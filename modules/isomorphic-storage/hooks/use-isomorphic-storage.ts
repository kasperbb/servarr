'use client';
import { useEffect, useState } from 'react';
import { AnyStorage } from '../isomorphic-storage';

type inferType<T extends AnyStorage, S extends boolean> = S extends true ? T['infer'] | undefined : T['infer'];

/**
 * A hook that subscribes to an instance of {@linkcode IsomorphicStorage}
 * and returns its value. The hook will re-render the component whenever
 * the storage value changes.
 *
 * @param storage The storage instance to subscribe to.
 * @param skipFirstRender If true, the hook will not return the storage value
 * on the first render. This is useful when the storage value is different
 * on the server and client.
 */
export function useIsomorphicStorage<T extends AnyStorage, S extends boolean = false>(storage: T, skipFirstRender?: S) {
  const [state, setState] = useState<inferType<T, S>>(skipFirstRender === true ? undefined : storage.get());

  useEffect(() => {
    if (skipFirstRender === true) {
      setState(storage.get());
    }

    return storage.subscribe(setState);
  }, [skipFirstRender, storage]);

  return state;
}
