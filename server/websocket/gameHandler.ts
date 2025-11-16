import { Room } from "./types.js";

export function startGame(room: Room) {
  console.log(`Starting game for room ${room.roomId}`);

  room.roomUsers.forEach((player) => {
        const createGameMessage = {
          type: 'create_game',
          data: JSON.stringify({
            idGame: room.roomId,
            idPlayer: player.index,
          }),
          id: 0,
        };
        player.ws.send(JSON.stringify(createGameMessage));
        console.log(`Sent create_game to player ${player.name}`);
      });
}