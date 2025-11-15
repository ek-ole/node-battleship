import { WebSocket } from 'ws';
import { WSMessage } from '../game/types.js';
import { gameStorage, getNextPlayerId } from './storage.js';

export function handleMessage(ws: WebSocket, message: WSMessage): void {
  switch (message.type) {
    case 'reg':
      handleRegCommand(ws, message);
      break;
    case 'create_room':
      handleCreateRoom(ws);
      break;
    default:
      console.log('Unknown message type:', message.type);
  }
}

function handleRegCommand(ws: WebSocket, message: WSMessage): void {
  let userData;
  if (typeof message.data === 'string') {
    userData = JSON.parse(message.data);
  } else {
    userData = message.data;
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

  const responseString = JSON.stringify(response);
  console.log('Sending response:', responseString);
  ws.send(responseString);

  console.log(`Total players registered: ${gameStorage.players.size}`);
  console.log('Current players:');
  gameStorage.players.forEach((player) => {
    console.log(`- ${player.name} (index: ${player.index})`);
  });
}

function handleCreateRoom(ws: WebSocket): void {
  const player = gameStorage.players.get(ws);

  if (!player) {
    console.log('Player not found for create_room');
    return;
  }

  console.log(`Creating room for player: ${player.name}`);

  const newRoom = {
    roomId: gameStorage.rooms.length + 1,
    roomUsers: [player],
  };

  gameStorage.rooms.push(newRoom);

  console.log(`Room created: ${newRoom.roomId} with player ${player.name}`);
  console.log(`Total rooms: ${gameStorage.rooms.length}`);
}
