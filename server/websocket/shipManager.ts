import { Ship } from "./types.js";

export function validateShipPlacement(ships: Ship[]): boolean {
  console.log('Validating ship placement...');

  if (ships.length !== 10) return false;

  const shipTypes = ships.map(ship => ship.type);
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

// export function checkShipOverlap(ships: Ship[]): boolean {
//   return false;
// }