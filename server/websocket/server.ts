import { WebSocketServer, WebSocket } from 'ws';
import { WSMessage } from '../game/types.js';
import { handleMessage } from './messageHandler.js';

export function createWSServer(port: number = 3000): WebSocketServer {
  const wss = new WebSocketServer({ port });

  wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');

    ws.on('message', (data) => {
      try {
        const message: WSMessage = JSON.parse(data.toString());
        console.log('Received message type:', message.type);
        console.log('Received message data:', message.data);
        handleMessage(ws, message);
      } catch (error) {
        console.error('Invalid JSON message:', error);
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  console.log(`Websocket server stated on port ${port}`);
  return wss;
}
