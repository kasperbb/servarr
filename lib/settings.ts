import {
  IsomorphicStorage,
  MiddlewareCookieStorage,
  type IsomorphicStorageTypeContext,
  ServerCookieStorage,
  ClientCookieStorage,
} from '@/modules/isomorphic-storage';
import { type } from 'arktype';

function getStorageTypes(key: string, ctx: IsomorphicStorageTypeContext) {
  if (ctx.req || ctx.res) return new MiddlewareCookieStorage(key, ctx);
  if (ctx.server) return new ServerCookieStorage(key);
  return new ClientCookieStorage(key);
}

export class Settings {
  public sonarr = new IsomorphicStorage({
    key: 'sonarr',
    schema: type({
      url: 'string',
      apiKey: 'string',
    }),
    defaultValue: {
      url: '',
      apiKey: '',
    },
    storage: getStorageTypes,
  });

  public radarr = new IsomorphicStorage({
    key: 'radarr',
    schema: type({
      url: 'string',
      apiKey: 'string',
    }),
    defaultValue: {
      url: '',
      apiKey: '',
    },
    storage: getStorageTypes,
  });
}

export const settings = new Settings();
