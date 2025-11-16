import { AttackResult, GameSession, Position, Ship } from './types.js';

const shipHits = new Map<string, Position[]>();

export function processAttack(
  gameSession: GameSession,
  attackerIndex: number,
  x: number,
  y: number
): AttackResult {
  const opponent = gameSession.players.find((p) => p.index !== attackerIndex);
  if (!opponent) {
    return { status: 'miss' };
  }

  for (let i = 0; i < opponent.ships.length; i++) {
    const ship = opponent.ships[i];
    const hit = checkShipHit(ship, x, y);
    if (hit) {
      return handleShipHit(gameSession.gameId, opponent.index, i, ship, x, y);
    }
  }
  return { status: 'miss' };
}

function checkShipHit(ship: Ship, x: number, y: number): boolean {
  if (ship.direction) {
    const hit = y === ship.position.y && x >= ship.position.x && x < ship.position.x + ship.length;
    console.log(`Horizontal check: ${hit}`);
    return hit;
  } else {
    const hit = x === ship.position.x && y >= ship.position.y && y < ship.position.y + ship.length;
    console.log(`Vertical check: ${hit}`);
    return hit;
  }
}

function handleShipHit(
  gameId: number,
  opponentIndex: number,
  shipIndex: number,
  ship: Ship,
  x: number,
  y: number
): AttackResult {
  const hitKey = `${gameId}-${opponentIndex}-${shipIndex}`;

  if (!shipHits.has(hitKey)) {
    shipHits.set(hitKey, []);
  }
  const hits = shipHits.get(hitKey)!;
  hits.push({ x, y });

  console.log(`Ship hits: ${hits.length}/${ship.length}`);

  if (hits.length === ship.length) {
    console.log(`Ship destroyed!`);
    const surroundingCells = getSurroundingCells(ship);
    return {
      status: 'killed',
      hitShip: ship,
      surroundingCells,
    };
  }

  return { status: 'shot', hitShip: ship };
}

function getSurroundingCells(ship: Ship): Position[] {
  const cells: Position[] = [];
  const startX = ship.position.x - 1;
  const startY = ship.position.y - 1;
  const endX = ship.direction ? ship.position.x + ship.length : ship.position.x + 1;
  const endY = ship.direction ? ship.position.y + 1 : ship.position.y + ship.length;

  for (let x = startX; x <= endX; x++) {
    for (let y = startY; y <= endY; y++) {
      if (x >= 0 && x <= 9 && y >= 0 && y <= 9) {
        cells.push({ x, y });
      }
    }
  }

  return cells;
}

export function checkGameFinished(gameSession: GameSession, attackerIndex: number): boolean {
  const opponent = gameSession.players.find((p) => p.index !== attackerIndex);
  if (!opponent) return false;

  for (let i = 0; i < opponent.ships.length; i++) {
    const ship = opponent.ships[i];
    const hitKey = `${gameSession.gameId}-${opponent.index}-${i}`;

    if (!shipHits.has(hitKey) || shipHits.get(hitKey)!.length < ship.length) {
      return false;
    }
  }
  return true;
}