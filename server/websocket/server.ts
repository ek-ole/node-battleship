import { WebSocketServer, WebSocket } from 'ws';

export function createWSServer(port: number = 3000): WebSocketServer {
  const wss = new WebSocketServer({ port });

  wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');

    ws.on('message', (data: Buffer) => {
      const message = data.toString();
      console.log('Received message:', message);
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  console.log(`Websocket server stated on port ${port}`)
  return wss;
}
