interface AppConfig {
  apiUrl: string | undefined;
};

const appConfig: AppConfig = {
  apiUrl: import.meta.env.API_URL || 'http://localhost:3000',
};

export default appConfig;
