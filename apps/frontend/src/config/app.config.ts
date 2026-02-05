interface AppConfig {
  apiUrl: string | undefined;
  emitterUrl: string;
  emitterCert: string;
  emitterMacaroon: string;
  payerUrl: string;
  payerCert: string;
  payerMacaroon: string;
};

const appConfig: AppConfig = {
  apiUrl: import.meta.env.API_URL || 'http://localhost:3000',
  emitterUrl: import.meta.env.VITE_EMITTER_SOCKET,
  emitterCert: import.meta.env.VITE_EMITTER_CERT,
  emitterMacaroon: import.meta.env.VITE_EMITTER_MACAROON,
  payerUrl: import.meta.env.VITE_PAYER_SOCKET,
  payerCert: import.meta.env.VITE_PAYER_CERT,
  payerMacaroon: import.meta.env.VITE_PAYER_MACAROON,
};

export default appConfig;
