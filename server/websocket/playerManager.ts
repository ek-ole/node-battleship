import { gameStorage } from "./storage.js";
import { Player, Room } from "./types.js";

export function addPlayerToRoom(player: Player, room: Room): void {
  room.roomUsers.push(player);
}

export function removePlayerFromAllRooms(playerIndex: number): Room[] {
  const removedFromRooms: Room[] = [];

   gameStorage.rooms = gameStorage.rooms.filter((room) => {
    const wasPlayerInRoom = room.roomUsers.some((user) => user.index === playerIndex)
      if (wasPlayerInRoom) {
        room.roomUsers = room.roomUsers.filter((user) => user.index !== playerIndex);
        removedFromRooms.push(room);
      }
      return room.roomUsers.length > 0;
    });
    return removedFromRooms;
}

export function isPlayerInRoom(playerIndex: number, room: Room): boolean {
  return room.roomUsers.some(user => user.index === playerIndex);
}

export function isPlayerInAnyRoom(playerIndex: number): boolean {
  return gameStorage.rooms.some(room => 
    room.roomUsers.some(user => user.index === playerIndex)
  )
}