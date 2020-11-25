export interface Coordinate {
    x: number;
    y: number;
}

/**
 * a - b
 * @param a
 * @param b
 */
export function coordinateDifference(a: Coordinate, b: Coordinate): Coordinate {
    const x = a.x - b.x;
    const y = a.y - b.y;
    return { x, y };
}
