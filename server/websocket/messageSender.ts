import { gameStorage } from "./storage.js";
import { RoomInfo } from "./types.js";
import { WebSocket } from 'ws';

export function sendUpdateRoomToAll(): void {
  const roomsData: RoomInfo[] = gameStorage.rooms.map((room) => ({
        roomId: room.roomId,
        roomUsers: room.roomUsers.map((user) => ({
          name: user.name,
          index: user.index,
        })),
      }))

      
        const updateMessage = {
          type: 'update_room',
          data: JSON.stringify(roomsData),
          id: 0,
        };
      
        gameStorage.players.forEach((player) => {
          player.ws.send(JSON.stringify(updateMessage));
        });
        console.log('Sent update_room to all clients');
      
  };

  export function sendToPlayer(ws: WebSocket, message: object): void {
    ws.send(JSON.stringify(message));
  }