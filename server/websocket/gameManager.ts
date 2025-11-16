import { GameSession, Room, Ship } from "./types.js";

const gameSessions = new Map<number, GameSession>();

export function createGameSession(room: Room): GameSession {
  const gameSession: GameSession = {
    gameId: room.roomId,
    players: room.roomUsers.map(player => ({
      index: player.index,
      ships: [],
      ready: false
    }))
  };

  gameSessions.set(room.roomId, gameSession);
  console.log(`Created game session ${room.roomId}`);
  return gameSession;
}

export function addPlayerShips(gameId: number, playerIndex: number, ships: Ship[]): void {
  const game = gameSessions.get(gameId);
  if(!game) {
    console.log(`Game ${gameId} not found`);
    return;
  }

  const player = game.players.find(p => p.index === playerIndex);
  if (player) {
    player.ships = ships;
    player.ready = true;
    console.log(`Player ${playerIndex} ships added to game ${gameId}`);
  }
}

export function areBothPlayersReady(gameId: number): boolean {
  const game = gameSessions.get(gameId);
  if (!game) return false;

  return game.players.every(player => player.ready);
}

export function getGameSession(gameId: number): GameSession | undefined {
  return gameSessions.get(gameId);
}