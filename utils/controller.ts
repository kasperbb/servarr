import { IsomorphicStorage } from '@/modules/isomorphic-storage';
import { Type } from 'arktype';

interface FetchArguments {
  path: string;
  params?: Record<string, string>;
  options?: RequestInit;
}

export abstract class Controller<T extends IsomorphicStorage<Type<any>, boolean>> {
  constructor(protected settings: T) {}

  protected url(path: string, params: Record<string, string> = {}) {
    const state = this.settings.get();
    const url = new URL(state.url + path);

    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    return url.toString();
  }

  protected async fetch<T>({ path, params, options }: FetchArguments): Promise<T> {
    const res = await fetch(this.url(path, params), options);

    if (!res.ok) {
      throw new Error(`${res.status}: ${res.statusText}`);
    }

    return res.json();
  }
}
