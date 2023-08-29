import type { NextRequest, NextResponse } from 'next/server';
import { IsomorphicStorageContext } from '../isomorphic-storage';
import type { IsomorphicStorageType, IsomorphicStorageTypeOptions } from '../utils/isomorphic-storage-type';

export class MiddlewareCookieStorage implements IsomorphicStorageType {
  private req: NextRequest;
  private res: NextResponse;

  constructor(private key: string, ctx: IsomorphicStorageContext) {
    if (!ctx.req || !ctx.res) {
      throw new Error('Missing request or response object');
    }

    this.req = ctx.req;
    this.res = ctx.res;
  }

  public get() {
    const cookie = this.req.cookies.get(this.key);

    if (!cookie) return undefined;

    if (cookie.value === '') {
      throw new Error('Empty cookie value');
    }

    return JSON.parse(cookie.value);
  }

  public set(value: unknown, options?: IsomorphicStorageTypeOptions) {
    const stringified = JSON.stringify(value);
    if (value === undefined) return undefined;
    this.res.cookies.set(this.key, stringified, {
      maxAge: options?.expiration,
    });
  }

  public delete() {
    this.res.cookies.delete(this.key);
  }
}
