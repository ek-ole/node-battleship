import { WebSocket } from 'ws';

export interface Player {
  ws: WebSocket;
  name: string;
  index: number;
}

export interface Room {
  roomId: number;
  roomUsers: Player[];
}

export interface GameStorage {
  players: Map<WebSocket, Player>;
  rooms: Room[];
}

let playerIdCounter = 1;

export function getNextPlayerId(): number {
  return playerIdCounter++;
}

export const gameStorage: GameStorage = {
  players: new Map<WebSocket, Player>(),
  rooms: [],
};