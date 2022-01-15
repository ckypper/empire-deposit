export interface ConfigProps {
  name: string;
  empire: {
    apikey: string;
    uid: number;
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
