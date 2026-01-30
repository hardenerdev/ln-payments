interface AppConfig {
  port: string | number | undefined;
};

const appConfig: AppConfig = {
  port: process.env.PORT || 3000,
};

export default appConfig;
