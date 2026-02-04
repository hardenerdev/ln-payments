import { Server as SocketIO } from 'socket.io';
import { Server as HttpServer } from 'http';
import appConfig from '../config/app.config';

class SocketService {
  // singleton patter to ensure only one socket.io instance
  // is created and ensure event consistency
  private static instance: SocketService;
  private io: SocketIO | null = null;

  constructor() {};

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }

    return SocketService.instance;
  };

  public init(httpServer: HttpServer) {
    this.io = new SocketIO(httpServer, {
      cors: {
        origin: `http://localhost:${appConfig.uiPort}`,
        methods: ['GET', 'POST'],
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`Socket.io connected with id ${socket.id}`);

      socket.on('disconnect', () => {
        console.log(`Socket.io disconnected`);
      });
    });
  };

  public emitEvent(event: string, data: any) {
    if (this.io) {
      this.io.emit(event, data);
    }
  };
}

export default SocketService;