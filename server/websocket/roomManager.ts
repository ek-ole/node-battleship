import { gameStorage } from "./storage.js";
import { Player, Room } from "./types.js";

export function createRoom(player: Player): Room {
    const newRoom = {
        roomId: gameStorage.rooms.length + 1,
        roomUsers: [player],
      };
    
      gameStorage.rooms.push(newRoom);
      return newRoom;
}

export function findRoomById(roomId: number): Room | undefined {
  return gameStorage.rooms.find((room) => room.roomId === roomId);
}

export function removeRoom(roomId: number): void {
  gameStorage.rooms = gameStorage.rooms.filter((room) => room.roomId !== roomId);
}

export function isRoomFull(room: Room): boolean {
  return room.roomUsers.length >= 2;
}

export function getAvailableRooms(): Room[] {
  return gameStorage.rooms.filter(room => room.roomUsers.length === 1)
}