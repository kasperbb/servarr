import { chainableNoOpProxy } from '@/utils/chainable-noop-proxy';
import { IsomorphicStorage, IsomorphicStorageContext } from '@/modules/isomorphic-storage';
import { AnyStorage } from '../isomorphic-storage';

type UndefinedProperties<T> = {
  [P in keyof T]-?: undefined extends T[P] ? P : never;
}[keyof T];

type ToOptional<T> = Partial<Pick<T, UndefinedProperties<T>>> & Pick<T, Exclude<keyof T, UndefinedProperties<T>>>;

type StorageDict<T extends Record<string, AnyStorage>> = {
  [K in keyof T]: T[K] extends IsomorphicStorage<infer S, infer O>
    ? O extends false
      ? S['infer']
      : S['infer'] | undefined
    : 'Failed to infer storage dict' & never;
};

export function mergeIsomorphicStorage<T extends Record<string, AnyStorage>>(storageMap: T) {
  const listeners = new Set<(value: ToOptional<StorageDict<T>>) => void>();

  function subscribe(listener: (value: ToOptional<StorageDict<T>>) => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  function notify(data: ToOptional<StorageDict<T>>) {
    for (const listener of listeners) {
      listener(data);
    }
  }

  function setContext(context: IsomorphicStorageContext) {
    for (const storage of Object.values(storageMap)) {
      storage.setContext(context);
    }
  }

  function setExpiration(seconds: number) {
    for (const storage of Object.values(storageMap)) {
      storage.setExpiration(seconds);
    }
  }

  function getAll() {
    return Object.fromEntries(
      Object.entries(storageMap).map(([key, storage]) => [key, storage.get()])
    ) as StorageDict<T>;
  }

  function setAll(data: ToOptional<StorageDict<T>>) {
    for (const [key, storage] of Object.entries(storageMap)) {
      storage.set(data[key as keyof ToOptional<StorageDict<T>>]);
    }

    notify(data);
  }

  function clear() {
    for (const storage of Object.values(storageMap)) {
      storage.delete();
    }

    notify(getAll());
  }

  function compose<I, O extends ToOptional<StorageDict<T>>>(input: I, transform: (input: I) => O): O {
    return transform(input) as O;
  }

  return {
    get infer(): ToOptional<StorageDict<T>> {
      return chainableNoOpProxy;
    },
    setContext,
    setExpiration,
    subscribe,
    getAll,
    setAll,
    clear,
    compose,
    ...storageMap,
  };
}
