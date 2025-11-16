import { addPlayerShips, areBothPlayersReady, createGameSession, getGameSession } from "./gameManager.js";
import { sendToPlayer } from "./messageSender.js";
import { validateShipPlacement } from "./shipManager.js";
import { Room, StartGameResponseData, WSMessage } from "./types.js";
import { WebSocket } from 'ws';

export function startGame(room: Room) {
  console.log(`Starting game for room ${room.roomId}`);

  createGameSession(room);

  room.roomUsers.forEach((player) => {
        const createGameMessage = {
          type: 'create_game',
          data: JSON.stringify({
            idGame: room.roomId,
            idPlayer: player.index,
          }),
          id: 0,
        };
        sendToPlayer(player.ws, createGameMessage);
        console.log(`Sent create_game to player ${player.name}`);
      });
}

export function handleAddShips(ws: WebSocket, message: WSMessage): void {
  console.log('Handing add_ships command');

  let shipsData;
  if (typeof message.data === 'string') {
    shipsData = JSON.parse(message.data);
  } else {
    shipsData = message.data;
  }

  console.log(`Player ${shipsData.indexPlayer} added ships to game ${shipsData.gameId}`);

  if (!validateShipPlacement(shipsData.ships)) return;

  addPlayerShips(shipsData.gameId, shipsData.indexPlayer, shipsData.ships);

  if (areBothPlayersReady(shipsData.gameId)) {
    console.log(`Both players ready in game ${shipsData.gameId}, starting battle`);
    sendStartGame(shipsData.gameId);
  }
}

export function sendStartGame(gameId: number): void {
  const gameSession = getGameSession(gameId);
  if (!gameSession) return;

  gameSession.players.forEach(player => {
    const startGameMessage = {
      type: 'start_game',
      data: JSON.stringify({
        ships: player.ships,
        currentPlayerIndex: player.index,
      } as StartGameResponseData),
      id: 0,
    };
     console.log(`Would send start_game to player ${player.index}:`, startGameMessage);
  });
}