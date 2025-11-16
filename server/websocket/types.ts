import { WebSocket } from 'ws';

export interface WSMessage {
  type: string;
  data: unknown;
  id: number;
}

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

export interface RoomUserInfo {
  name: string;
  index: number;
}

export interface RoomInfo {
  roomId: number;
  roomUsers: RoomUserInfo[];
}

export interface RegRequestData {
  name: string;
  password: string;
}

export interface AddUserToRoomRequestData {
  indexRoom: number;
}

export interface CreateGameResponseData {
  idGame: number;
  idPlayer: number;
}

export interface Ship {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
}

export interface AddShipsRequestData {
  gameId: number;
  ships: Ship[];
  indexPlayer: number;
}

export interface StartGameResponseData {
  ships: Ship[];
  currentPlayerIndex: number;
}

export interface PlayerInGame {
  index: number;
  ws: WebSocket;
  ships: Ship[];
  ready: boolean;
}

export interface GameSession {
  gameId: number;
  players: PlayerInGame[];
}

export interface Position {
  x: number;
  y: number;
}

export interface AttackResult {
  status: 'miss' | 'shot' | 'killed';
  hitShip?: Ship;
  surroundingCells?: Position[];
}

export interface GameState {
  currentPlayer: number;
  attackedCells: Map<number, Position[]>; 
  playerIndexes: number[];
}