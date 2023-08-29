import { settings } from '@/lib/settings';
import { constructUrl } from '@/utils/construct-url';
import { Type } from 'arktype';

interface FetchArguments<def> {
  path: string;
  schema: Type<def>;
  params?: Record<string, string>;
  options?: RequestInit;
}

export async function fetchSonarr<def>({ path, schema, params, options }: FetchArguments<def>) {
  const url = constructUrl(settings.sonarr, path, params);
  const res = await fetch(url, {
    ...options,
    headers: {
      'X-Api-Key': settings.sonarr.get().apiKey,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`${res.status}: ${res.statusText}`);
  }

  const json = await res.json();
  const { data, problems } = schema(json);

  if (problems) {
    throw new Error(problems.summary);
  }

  return data;
}
