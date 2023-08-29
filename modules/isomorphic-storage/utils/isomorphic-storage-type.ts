import { IsomorphicStorageContext } from '../isomorphic-storage';

export interface IsomorphicStorageTypeOptions {
  /**
   * The number of seconds until the item expires.
   */
  expiration: number;
}

export interface IsomorphicStorageTypeContext extends IsomorphicStorageContext {
  client: boolean;
  server: boolean;
}

export type IsomorphicStorageTypeFunction = (key: string, ctx: IsomorphicStorageTypeContext) => IsomorphicStorageType;

/**
 * It's important that you don't throw errors in the methods
 * of this interface. Errors are handled in {@linkcode IsomorphicStorage}.
 */
export abstract class IsomorphicStorageType {
  abstract get(): unknown;
  abstract set(value: unknown, options?: IsomorphicStorageTypeOptions): void;
  abstract delete(): void;
}
