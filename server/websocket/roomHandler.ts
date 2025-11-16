import { WebSocket } from 'ws';
import { findPlayerByWs, gameStorage, isPlayerInAnyRoom } from './storage.js';
import { sendUpdateRoomToAll } from './messageSender.js';
import { AddUserToRoomRequestData, WSMessage } from './types.js';

export function handleCreateRoom(ws: WebSocket): void {
  const player = findPlayerByWs(ws);

  if (!player) {
    console.log('Player not found for create_room');
    return;
  }

  if (isPlayerInAnyRoom(player.index)) {
    console.log(`Player ${player.name} is already in room`);
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

  sendUpdateRoomToAll();
}

export function handleAddUserToRoom(ws: WebSocket, message: WSMessage): void {
  console.log('Handing add_user_to_room');
  const player = findPlayerByWs(ws);

  if (!player) {
    console.log('Player not found for add_user_to_room');
    return;
  }

  let roomData: AddUserToRoomRequestData;
  if (typeof message.data === 'string') {
    roomData = JSON.parse(message.data);
  } else {
    roomData = message.data as AddUserToRoomRequestData;
  }

  console.log(`Player ${player.name} wants to join room ${roomData.indexRoom}`);

  const targetRoom = gameStorage.rooms.find(r => r.roomId === roomData.indexRoom);
  if (!targetRoom) return;

  if (targetRoom.roomUsers.some(user => user.index === player.index)) {
    console.log(`Playr ${player.name} is alrady in this room`);
    return;
  }

  if (targetRoom.roomUsers.length >=2) return;

  gameStorage.rooms = gameStorage.rooms.filter(room => {
    if (room.roomUsers.some(user => user.index === player.index)) {
      console.log(`Removing player ${player.name} from room ${room.roomId}`);
      room.roomUsers = room.roomUsers.filter(user => user.index !== player.index);
      return room.roomUsers.length > 0;
    }
    return true;
  })

  targetRoom.roomUsers.push(player);
  console.log(`Player ${player.name} joined room ${targetRoom.roomId}`);
}

