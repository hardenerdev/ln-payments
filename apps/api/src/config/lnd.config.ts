interface LndConfig {
  lndSocket: string | undefined;
  lndMacaroon: string | undefined;
  lndTls: string | undefined;
};

const lndConfig: LndConfig = {
  lndSocket: process.env.LND_SOCKET,
  lndMacaroon: process.env.LND_MACAROON_PATH,
  lndTls: process.env.LND_TLS_PATH,
};

export default lndConfig;
