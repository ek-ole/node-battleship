import { Position, Ship } from './types.js';

export function validateShipPlacement(ships: Ship[]): boolean {
  console.log('Validating ship placement...');

  if (ships.length !== 10) return false;

  const shipTypes = ships.map((ship) => ship.type);
  const expectedTypes = [
    'huge',
    'large',
    'large',
    'medium',
    'medium',
    'medium',
    'small',
    'small',
    'small',
    'small',
  ].sort();

  const actualTypes = [...shipTypes].sort();
  if (JSON.stringify(actualTypes) !== JSON.stringify(expectedTypes)) return false;

  return true;
}

export function checkShipOverlap(ships: Ship[]): boolean {
  const occupiedCells = new Set<string>();

  for (const ship of ships) {
    const cells = getShipCells(ship);

    for (const cell of cells) {
      const cellKey = `${cell.x},${cell.y}`;
      if (occupiedCells.has(cellKey)) {
        return true; 
      }
      occupiedCells.add(cellKey);
    }
  }

  return false;
}

function getShipCells(ship: Ship): Position[] {
  const cells: Position[] = [];

  if (ship.direction) {
    for (let i = 0; i < ship.length; i++) {
      cells.push({ x: ship.position.x + i, y: ship.position.y });
    }
  } else {
    for (let i = 0; i < ship.length; i++) {
      cells.push({ x: ship.position.x, y: ship.position.y + i });
    }
  }

  return cells;
}