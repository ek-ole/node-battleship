import { WebSocket } from 'ws';
import { GameStorage, Player } from './types.js';

let playerIdCounter = 1;

export function getNextPlayerId(): number {
  return playerIdCounter++;
}

export const gameStorage: GameStorage = {
  players: new Map<WebSocket, Player>(),
  rooms: [],
};

export function isPlayerInAnyRoom(playerIndex: number): boolean {
  return gameStorage.rooms.some((room) =>
    room.roomUsers.some((user) => user.index === playerIndex)
  );
}

export function findPlayerByWs(ws: WebSocket) {
   return gameStorage.players.get(ws);
}