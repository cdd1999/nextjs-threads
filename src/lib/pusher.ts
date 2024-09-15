import PusherServer from 'pusher';
import PusherClient, { Options} from 'pusher-js';
// Bi-directional hosted APIs that are flexible,
// scalable and easy to use. We create and maintain complex messaging
// infrastructure so you can build the realtime features your users need, fast.
const pusherServerOptions: PusherServer.Options = {
  appId: process.env.PUSHER_SERVER_APP_ID!,
  key: process.env.PUSHER_SERVER_KEY!,
  secret: process.env.PUSHER_SERVER_SECRET!,
  cluster: 'ap2',
  useTLS: true,
};

const pusherClientOptions: Options = {
  cluster: 'ap2'
};

export const pusherServer = new PusherServer(pusherServerOptions);

export const pusherClient = new PusherClient(process.env.PUSHER_SERVER_KEY!, pusherClientOptions);
