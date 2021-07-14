export interface Point {
    /**
     * x coordinate
     */
    x: number;

    /**
     * y coordinate
     */
    y: number;
}

export function addPoints(a: Point, b:Point): Point {

    const c = {x: a.x + b.x, y: a.y + b.y};
    return c;
}