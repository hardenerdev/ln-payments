import app from './app';
import appConfig from './config/app.config';

app.listen(appConfig.port, () => {
  console.log(`API listening on port ${appConfig.port}`);
});
