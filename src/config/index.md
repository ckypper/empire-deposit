```js
import { ConfigProps } from '../interfaces/index';

export const USER_CONFIG: ConfigProps[] = [
  {
    name: 'John', // To display in message
    empire: {
      active: true, // if true, empire deposit will active
      uuid: '', // CSGOEmpire UUID, you can find in request headers of any API in empire,
      uid: 123456, // CSGOEmpire ID, you can find in API metadata in empire,
      apikey: 'abcxyz', // CSGOEmpire APIKey, you can find in https://csgoempire.com/trading/apikey,
    },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36', // You can find in request headers of any API in empire,
    steam: {
      accountName: 'abcxyz', // steam account
      password: 'abcxyz', // steam password
      identitySecret: 'abcxyz', // steam identitySecret
      sharedSecret: 'abcxyz', // steam sharedSecret
    },
    discord: {
      active: true, // if true, send log message to discord hook
      hook: 'aaaaaaaa', // discord hook
    },
  },
];
```
