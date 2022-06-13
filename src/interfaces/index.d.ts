export interface ConfigProps {
  name: string;
  empire: {
    apikey: string;
    uid: number;
    active: boolean;
    acceptThreshold?: number;
  };
  steam: Steam;
  discord: {
    active: boolean;
    hook: string;
  };
  hwang: {
    apikey: string;
  };
}

interface Steam {
  accountName: string;
  password: string;
  sharedSecret: string;
  identitySecret: string;
}
