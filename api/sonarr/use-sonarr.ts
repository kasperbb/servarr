import { UseQueryOptionsWithParams } from '@/types/query';
import { useQuery } from '@tanstack/react-query';
import { fetchSonarr } from './fetch-sonarr';
import { Type } from 'arktype';

export function useSonarr<def>(path: string, options: UseQueryOptionsWithParams<def>) {
  const key = path.split('/').filter((str) => str.length);

  const { params, schema, ...rest } = options;

  return useQuery({
    queryKey: getKey(key, params),
    queryFn: () => fetchSonarr({ path, params, schema }),
    staleTime: Infinity,
    ...(rest as object),
  });
}

export function getKey(paths: string[], params?: Record<string, string>) {
  const pathsKey = paths.filter(Boolean).flat();
  const paramsKey = params ? Object.entries(params).flat() : [];
  return [pathsKey, paramsKey];
}
