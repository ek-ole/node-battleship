import { WebSocket } from 'ws';
import { WSMessage } from './types.js';
import { getGameSession } from './gameManager.js';
import { sendToPlayer } from './messageSender.js';
import { checkGameFinished, processAttack } from './attackManager.js';
import { getCurrentPlayer, switchTurn, recordAttack } from './gameStateManager.js';

export function handleAttack(ws: WebSocket, message: WSMessage): void {
  console.log('Handling attack command');

  let attackData;
  if (typeof message.data === 'string') {
    attackData = JSON.parse(message.data);
  } else {
    attackData = message.data;
  }

  const { gameId, indexPlayer, x, y } = attackData;
  console.log(`Player ${indexPlayer} attacks (${x}, ${y}) in game ${gameId}`);

  const currentPlayer = getCurrentPlayer(gameId);
  if (currentPlayer !== indexPlayer) {
    console.log(`Not player ${indexPlayer}'s turn`);
    return;
  }

  const gameSession = getGameSession(gameId);
  if (!gameSession) return;

  const attackResult = processAttack(gameSession, indexPlayer, x, y);

  recordAttack(gameId, indexPlayer, x, y);

  const attackResponse = {
    type: 'attack',
    data: JSON.stringify({
      position: { x, y },
      currentPlayer: indexPlayer,
      status: attackResult.status,
    }),
    id: 0,
  };

  gameSession.players.forEach((player) => {
    sendToPlayer(player.ws, attackResponse);
  });

  console.log(`Attack result: ${attackResult.status}`);

  if (attackResult.status === 'miss') {
    const gameSession = getGameSession(gameId);
    if (!gameSession) return;
    const playerIndexes = gameSession.players.map((p) => p.index);
    const nextPlayer = switchTurn(gameId, playerIndexes);

    const turnMessage = {
      type: 'turn',
      data: JSON.stringify({
        currentPlayer: nextPlayer,
      }),
      id: 0,
    };

    gameSession.players.forEach((player) => {
      sendToPlayer(player.ws, turnMessage);
    });

    console.log(`Turn switched to player ${nextPlayer}`);
  }

  if (attackResult.status === 'killed' && attackResult.surroundingCells) {
    attackResult.surroundingCells.forEach((cell) => {
      const surroundingMissMessage = {
        type: 'attack',
        data: JSON.stringify({
          position: cell,
          currentPlayer: indexPlayer,
          status: 'miss',
        }),
        id: 0,
      };

      gameSession.players.forEach((player) => {
        sendToPlayer(player.ws, surroundingMissMessage);
      });
    });
  }

  if (checkGameFinished(gameSession, indexPlayer)) {
    console.log(`Game ${gameId} finished! Player ${indexPlayer} wins!`);

    const finishMessage = {
      type: 'finish',
      data: JSON.stringify({
        winPlayer: indexPlayer,
      }),
      id: 0,
    };
    gameSession.players.forEach((player) => {
      sendToPlayer(player.ws, finishMessage);
    });
  }
}

export function handleRandomAttack(ws: WebSocket, message: WSMessage): void {
  console.log('Handling random attack command');
  console.log('WebSocket:', ws);
  console.log('Message:', message);
}
