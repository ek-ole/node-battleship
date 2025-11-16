import { WebSocket } from 'ws';
import { findPlayerByWs, gameStorage } from './storage.js';
import { sendUpdateRoomToAll } from './messageSender.js';
import { AddUserToRoomRequestData, WSMessage } from './types.js';
import { startGame } from './gameHandler.js';
import { createRoom, isRoomFull, removeRoom } from './roomManager.js';
import { addPlayerToRoom, isPlayerInRoom, removePlayerFromAllRooms } from './playerManager.js';

export function handleCreateRoom(ws: WebSocket): void {
  const player = findPlayerByWs(ws);

  if (!player) {
    console.log('Player not found for create_room');
    return;
  }

  removePlayerFromAllRooms(player.index);

  const newRoom = createRoom(player);

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

  const targetRoom = gameStorage.rooms.find((r) => r.roomId === roomData.indexRoom);
  if (!targetRoom) return;

  if (isPlayerInRoom(player.index, targetRoom)) {
    console.log(`Playr ${player.name} is already in this room`);
    return;
  }

  if (isRoomFull(targetRoom)) return;

  removePlayerFromAllRooms(player.index);

  addPlayerToRoom(player, targetRoom);
  console.log(`Player ${player.name} joined room ${targetRoom.roomId}`);

  if (isRoomFull(targetRoom)) {
    console.log(`Room ${targetRoom.roomId} is full, starting game`);

    startGame(targetRoom);

    removeRoom(targetRoom.roomId);

    sendUpdateRoomToAll();
  }
}
