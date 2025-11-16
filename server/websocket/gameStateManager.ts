import { GameState, Position } from "./types.js";

const gameStates = new Map<number, GameState>();

export function initGameState(gameId: number, firstPlayer: number, players: number[]): void {
  gameStates.set(gameId, {
    currentPlayer: firstPlayer,
    attackedCells: new Map(),
    playerIndexes: players, 
  });
}

export function getCurrentPlayer(gameId: number): number | undefined {
  return gameStates.get(gameId)?.currentPlayer;
}

export function switchTurn(gameId: number, players: number[]): number {
  const state = gameStates.get(gameId);
  if (!state) return -1;

   const currentIndex = players.indexOf(state.currentPlayer);
   const nextIndex = (currentIndex + 1) % players.length;

  state.currentPlayer = players[nextIndex];
  return state.currentPlayer;
}

export function recordAttack(gameId: number, playerIndex: number, x: number, y: number): void {
  const state = gameStates.get(gameId);
  if (!state) return;

  const position: Position = { x, y };

  if (!state.attackedCells.has(playerIndex)) {
    state.attackedCells.set(playerIndex, []);
  }
  state.attackedCells.get(playerIndex)?.push(position);
}
