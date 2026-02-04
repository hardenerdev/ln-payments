import app from './app';
import appConfig from './config/app.config';
import SocketService from './services/socket.service';

const server = app.listen(appConfig.port, () => {
  console.log(`API listening on port ${appConfig.port}`);
});

const socket = SocketService.getInstance();
socket.init(server);
