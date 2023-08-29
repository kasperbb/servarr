import { Type } from 'arktype';
import { UseQueryOptions } from 'react-query';

type Options<def, S = Type<def>['infer']> = Omit<UseQueryOptions<Type<def>['infer'], Error, S>, 'queryKey' | 'queryFn'>;

export interface UseQueryOptionsWithParams<def> extends Options<def> {
  schema: Type<def>;
  params?: Record<string, string>;
}
