import { WebSocket } from 'ws';
import { RegRequestData, WSMessage } from './types.js';
import { gameStorage, getNextPlayerId } from './storage.js';
import { handleAddUserToRoom, handleCreateRoom } from './roomHandler.js';
import { sendToPlayer, sendUpdateRoomToAll } from './messageSender.js';
import { handleAddShips } from './gameHandler.js';

export function handleMessage(ws: WebSocket, message: WSMessage): void {
  switch (message.type) {
    case 'reg':
      handleRegCommand(ws, message);
      break;
    case 'create_room':
      handleCreateRoom(ws);
      break;
    case 'add_user_to_room':
      handleAddUserToRoom(ws, message);
      break;
    case 'add_ships':
      handleAddShips(ws, message);
      break;
    default:
      console.log('Unknown message type:', message.type);
  }
}

function handleRegCommand(ws: WebSocket, message: WSMessage): void {
  let userData: RegRequestData;

  if (typeof message.data === 'string') {
    userData = JSON.parse(message.data);
  } else {
    userData = message.data as RegRequestData;
  }
  console.log('Processing registration for:', userData.name);

  const playerIndex = getNextPlayerId();
  const player = {
    ws,
    name: userData.name,
    index: playerIndex,
  };

  gameStorage.players.set(ws, player);

  const response = {
    type: 'reg',
    data: JSON.stringify({
      name: userData.name,
      index: Math.random(),
      error: false,
      errorText: '',
    }),
    id: 0,
  };

  
  console.log('Sending response:', response);
  sendToPlayer(ws, response);
  sendUpdateRoomToAll();

  console.log(`Total players registered: ${gameStorage.players.size}`);
  console.log('Current players:');
  gameStorage.players.forEach((player) => {
    console.log(`- ${player.name} (index: ${player.index})`);
  });
}




