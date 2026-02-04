interface AppConfig {
  port: string | number | undefined;
  uiPort: string | number | undefined;
};

const appConfig: AppConfig = {
  port: process.env.PORT || 3000,
  uiPort: process.env.UI_PORT || 4000,
};

export default appConfig;
