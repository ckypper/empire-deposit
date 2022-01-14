export interface ConfigProps {
  name: string;
  userAgent: string;
  empire: {
    apikey: string;
    uid: number;
    uuid: string;
    active: boolean;
  };
  steam: Steam;
  discord: {
    active: boolean;
    hook: string;
  };
}

interface Steam {
  accountName: string;
  password: string;
  sharedSecret: string;
  identitySecret: string;
}
