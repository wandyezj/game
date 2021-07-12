import { Point } from "./Point";

/**
 *
 *
 *
 *
 *
 * Represent a grid
 */
export class Grid {
    /**
     * Represents a grid of squares
     * Does not have boarders
     * @param sizeX number of squares on the x axis
     * @param sizeY number of squares on the y axis
     * @param lineSize size of the line
     */
    constructor(
        readonly sizeX: number,
        readonly sizeY: number,
        readonly squareSize: number,
        readonly lineSize: number
    ) {}

    /**
     * squares are ordered from left to right, top down. Square zero is upper lef, highest square is lower right.
     * @param index
     * @returns the x y index of the specified square
     */
    getSquareByIndex(index: number): Point {
        const x = index % this.sizeX;
        const y = (index - x) / this.sizeY;

        return { x, y };
    }

    /**
     * Gets the upper left corner coordinates of the specified square
     * @param index
     * @returns
     */
    getSquareUpperLeftCorner(index: number): Point {
        const point = this.getSquareByIndex(index);

        const offset = this.squareSize + this.lineSize;
        const x = point.x * offset;
        const y = point.y * offset;
        return { x, y };
    }

    /**
     * Gets the center coordinate of the specified square
     * @param index
     * @returns
     */
    getSquareCenter(index: number) {
        const point = this.getSquareUpperLeftCorner(index);
        const offset = this.squareSize / 2;
        const x = point.x + offset;
        const y = point.y + offset;
        return { x, y };
    }

    // Point in square
    // index square the point is in (what if the point is on the line) return undefined?
    getSquareIndexContainingPoint(point: Point): number | undefined {
        const offset = this.squareSize + this.lineSize;

        const {x,y}= point;

        // check if outside the grid
        // over max x and y

        // note: technically this offset is over but previous case handles collision outside
        const minX = 0;
        const minY = 0;

        const maxX = offset * this.sizeX;
        const maxY = offset * this.sizeY;

        if (x < minX || y < minY) {
            return undefined;
        }

        if (x > maxX || y > maxY) {
            return undefined;
        }

        // check if outside a square
        const squareX = x % offset;
        const squareY = y % offset;

        if (squareX > this.squareSize || squareY > this.squareSize) {
            // Outside the square space
            // On a line
            return undefined;
        }

        // isolate to a square index

        const indexX = (x - squareX) / offset;
        const indexY = (y - squareY) / offset;

        const index = indexY * this.sizeX + indexX

        return index;
    }
}
