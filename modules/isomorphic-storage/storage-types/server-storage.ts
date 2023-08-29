import { IsomorphicStorageType } from '@/modules/isomorphic-storage';
import { cookies, headers } from 'next/dist/client/components/headers';

export class ServerCookieStorage implements IsomorphicStorageType {
  constructor(private readonly key: string) {}

  public get() {
    const cookie = cookies().get(this.key);
    const header = headers().get('set-cookie');

    // Cookies set in middleware are not available on the fist
    // pass of the server, so we need to check the `set-cookie` header.
    // This is a bug in Next.js that I expect to be fixed soon.
    // see: https://github.com/vercel/next.js/issues/49442
    if (cookie) {
      return JSON.parse(cookie.value);
    } else if (header) {
      const cookieHeader = this.parseCookie(this.key, header);
      if (!cookieHeader) return undefined;
      return JSON.parse(cookieHeader);
    }

    return undefined;
  }

  public set() {
    console.warn('Method not implemented.');
  }

  public delete() {
    console.warn('Method not implemented.');
  }

  private parseCookie(name: string, cookie: string) {
    // Get name followed by anything except a semicolon
    const cookiestring = RegExp(name + '=[^;]+').exec(cookie);

    if (!cookiestring) return undefined;

    // Return everything after the equal sign, or an empty string if the cookie name not found
    return decodeURIComponent(cookiestring.toString().replace(/^[^=]+./, ''));
  }
}
