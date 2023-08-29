import { IsomorphicStorageType, IsomorphicStorageTypeOptions } from '@/modules/isomorphic-storage';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';

export class ClientCookieStorage implements IsomorphicStorageType {
  constructor(private key: string) {}

  public get() {
    const cookie = getCookie(this.key);

    if (!cookie) return undefined;

    return JSON.parse(cookie.toString());
  }

  public set(value: unknown, options?: IsomorphicStorageTypeOptions) {
    setCookie(this.key, JSON.stringify(value), {
      maxAge: options?.expiration,
    });
  }

  public async delete() {
    deleteCookie(this.key);
  }
}

export class ClientLocalStorage implements IsomorphicStorageType {
  constructor(private key: string) {}

  private warn() {
    // eslint-disable-next-line no-console
    console.warn('ClientLocalStorage is not available on the server');
  }

  public get() {
    if (typeof window === 'undefined') {
      this.warn();
      return undefined;
    }
    const value = localStorage.getItem(this.key);
    return value ? JSON.parse(value) : undefined;
  }

  public set(value: unknown) {
    if (typeof window === 'undefined') return this.warn();
    localStorage.setItem(this.key, JSON.stringify(value));
  }

  public update(value: unknown) {
    if (typeof window === 'undefined') return this.warn();
    localStorage.setItem(this.key, JSON.stringify(value));
  }

  public delete() {
    if (typeof window === 'undefined') return this.warn();
    localStorage.removeItem(this.key);
  }
}
