import { IsomorphicStorage } from '@/modules/isomorphic-storage';
import { Type } from 'arktype';

export function constructUrl(
  storage: IsomorphicStorage<
    Type<{
      url: string;
      apiKey: string;
    }>,
    false
  >,
  path: string,
  params: Record<string, string> = {}
) {
  const state = storage.get();
  const url = new URL(state.url + path);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  return url.toString();
}
