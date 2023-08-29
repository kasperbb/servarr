import { Type } from 'arktype';
import { NextRequest, NextResponse } from 'next/server';
import { chainableNoOpProxy } from '@/utils/chainable-noop-proxy';
import { IsomorphicStorageType, IsomorphicStorageTypeFunction } from './utils/isomorphic-storage-type';
import { IsomorphicStorageValidatorError } from './utils/errors';
import { mergeIsomorphicStorage } from './utils/merge-isomorphic-storage';

export type AnyStorage = IsomorphicStorage<Type<any>, boolean>;

export interface IsomorphicStorageContext {
  req?: NextRequest;
  res?: NextResponse;
}

export interface IsomorphicStorageInit<Schema extends Type> {
  /**
   * Stores the value in the storage with the specified key.
   */
  key: string;
  /**
   * The schema for the value. This is used to validate the value when it is
   * retrieved and set. It is also used to infer the type of the value.
   */
  schema: Schema;
  storage: IsomorphicStorageTypeFunction;
  /**
   * The context to use when getting and setting values. One example of when
   * this is useful is when you want to set a cookie on a server response.
   */
  context?: IsomorphicStorageContext;
}

interface OptionalIsomorphicStorageInit<Schema extends Type, Optional extends boolean>
  extends IsomorphicStorageInit<Schema> {
  defaultValue?: inferType<Schema, Optional, 'in'>;
  /**
   * If true, the value will be set to undefined if it is not found in the
   * storage. If false, the value will be set to the default value.
   */
  optional?: Optional;
}

interface RequiredIsomorphicStorageInit<Schema extends Type, Optional extends false>
  extends IsomorphicStorageInit<Schema> {
  defaultValue: inferType<Schema, Optional, 'in'>;
  /**
   * If true, the value will be set to undefined if it is not found in the
   * storage. If false, the value will be set to the default value.
   */
  optional?: Optional;
}

type inferIo<Schema extends Type, IO extends 'in' | 'out'> = IO extends 'in' ? Schema['inferIn'] : Schema['infer'];

type inferType<Schema extends Type, Optional extends boolean, IO extends 'in' | 'out' = 'out'> = Optional extends true
  ? inferIo<Schema, IO> | undefined
  : inferIo<Schema, IO>;

type UpdaterOrPartial<Schema extends Type, Optional extends boolean> =
  | ((value: inferType<Schema, Optional, 'in'>) => inferType<Schema, Optional>)
  | Partial<inferType<Schema, Optional, 'in'>>;

export class IsomorphicStorage<Schema extends Type, Optional extends boolean = false> {
  private listeners: Set<(value: inferType<Schema, Optional>) => void> = new Set();
  private storage: IsomorphicStorageType;

  public key: string;
  public context: IsomorphicStorageContext | undefined;
  public def: inferType<Schema, Optional> | undefined;

  constructor(
    private init: Optional extends false
      ? RequiredIsomorphicStorageInit<Schema, Optional>
      : OptionalIsomorphicStorageInit<Schema, Optional>
  ) {
    this.context = init.context;
    this.def = init.schema.definition;

    this.key = init.key;
    this.storage = this.init.storage(init.key, {
      client: typeof window !== 'undefined',
      server: typeof window === 'undefined',
      ...init.context,
    });

    this.setContext = this.setContext.bind(this);
    this.setExpiration = this.setExpiration.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.get = this.get.bind(this);
    this.set = this.set.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  get infer(): inferType<Schema, Optional> {
    return chainableNoOpProxy;
  }

  public static merge<T extends Record<string, AnyStorage>>(storageMap: T) {
    return mergeIsomorphicStorage(storageMap);
  }

  /**
   * Sets the context to use when getting and setting values. One example of
   * when this is useful is when you want to set a cookie on a server response.
   *
   * The context is passed to the storage type when it is initialized. Which
   * is on initialization of the {@linkcode IsomorphicStorage} and on
   * {@linkcode IsomorphicStorage.setContext}. This ensures that the
   * context is always up to date.
   *
   * @param context The context to use when getting and setting values.
   * @example
   * ```ts
   * export default async function GET(req, res) {
   *   storage.setContext({ req, res });
   *   storage.set('pong'); // will use context passed to storage
   *   return res.json({ ping: storage.get() });
   * }
   * ```
   */
  public setContext(context: IsomorphicStorageContext) {
    this.context = context;
    this.storage = this.init.storage(this.init.key, {
      client: typeof window !== 'undefined',
      server: typeof window === 'undefined',
      ...context,
    });
  }

  /**
   * Sets the expiration for all cookies in the storage.
   * @param expiration The number of seconds until the cookie expires.
   */
  public setExpiration(expiration: number) {
    const values = this.get();
    if (!values) return;

    try {
      this.storage.set(values, {
        expiration: expiration,
      });
    } catch {
      // eslint-disable-next-line no-console
      console.warn(`Failed to set expiration for ${this.init.key.toString()}`);
    }
  }

  /**
   * Returns the values in storage. If the value is not found, it will
   * return the default value if it exists. If the default value does not exist,
   * it will throw an error.
   */
  public get(): inferType<Schema, Optional> {
    const value = this.storage.get();
    const defaultValue = this.getDefaultValue();
    const isOptional = this.isOptional();

    if ((value === null || value === undefined) && defaultValue) {
      const data = this.validate(defaultValue, 'out');
      this.set(data);
      return data;
    }

    if ((value === null || value === undefined) && isOptional) {
      return undefined;
    }

    return this.validate(value, 'out');
  }

  public set(value: inferType<Schema, Optional, 'in'>) {
    const data = this.validate(value, 'in');
    if (data) this.storage.set(data);
    this.notify(data);
  }

  public update(partial: Partial<inferType<Schema, Optional, 'in'>>): void;
  public update(updater: (value: inferType<Schema, Optional, 'in'>) => inferType<Schema, Optional>): void;
  public update(updaterOrPartial: UpdaterOrPartial<Schema, Optional>): void {
    const value = this.get();
    const newValue = this.applyUpdate(updaterOrPartial, value);
    const data = this.validate(newValue, 'in');

    this.storage.set(data);
    this.notify(data);
  }

  public delete() {
    this.storage.delete();
  }

  /**
   * Subscribes to changes for all keys in the storage. The listener will be
   * called with all values whenever any value changes.
   */
  public subscribe(listener: (value: inferType<Schema, Optional>) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private applyUpdate(
    updaterOrPartial: UpdaterOrPartial<Schema, Optional>,
    oldValue: inferType<Schema, Optional>
  ): inferType<Schema, Optional> {
    if (typeof updaterOrPartial === 'function') {
      return updaterOrPartial(oldValue);
    }

    if (Array.isArray(oldValue) && Array.isArray(updaterOrPartial)) {
      return [...oldValue, ...updaterOrPartial];
    }

    if (typeof oldValue === 'object' && typeof updaterOrPartial === 'object') {
      return { ...oldValue, ...updaterOrPartial };
    }

    return updaterOrPartial;
  }

  private notify(value: inferType<Schema, Optional>) {
    if (this.listeners.size === 0) return;

    try {
      this.listeners.forEach((listener) => listener(value));
    } catch {
      // eslint-disable-next-line no-console
      console.warn('Failed to notify listeners');
    }
  }

  private getDefaultValue() {
    return this.init.defaultValue;
  }

  private isOptional() {
    return this.init.optional || false;
  }

  private validate(data: unknown, io: 'in' | 'out'): inferType<Schema, Optional> {
    const optional = this.isOptional();

    if (optional && data === undefined) {
      return undefined as inferType<Schema, Optional>;
    }

    const result = this.init.schema(structuredClone(data));

    if (result.problems) {
      throw new IsomorphicStorageValidatorError(this.init.key, result.problems.summary);
    }

    return io === 'in' ? data : result.data;
  }
}
