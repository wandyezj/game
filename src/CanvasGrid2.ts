import { Coordinate } from "./Coordinate";
import { Grid } from "./utility/Grid";
import { addPoints, Point } from "./utility/Point";

/**
 * class to figure out coordinates for drawing a grid of squares
 */
export class CanvasGrid2 {
    private gridUpperLeft: Point;
    private squaresUpperLefts: Point[] = [];
    private grid: Grid;
    /**
     *
     * @param x upper left
     * @param y upper right
     * @param countX number of squares in x
     * @param countY number of squares in y
     * @param squareSize height and width of each square
     * @param separation distance between squares
     */
    constructor(
        topLeftX: number,
        topLeftY: number,
        public countX: number,
        public countY: number,
        public squareSize: number,
        separation: number
    ) {
        this.grid = new Grid(countX, countY, squareSize, separation);
        this.gridUpperLeft = {x: topLeftX, y: topLeftY};
        
        const squareCount = this.grid.getSquareCount();
         for (let i = 0; i < squareCount; i++) {
            const upperLeft = this.grid.getSquareUpperLeftCorner(i);
            const upperLeftWithOffset = addPoints(upperLeft, this.gridUpperLeft);
            this.squaresUpperLefts.push(upperLeftWithOffset);
        }
    }

    /**
     * Get all square in the grids upper left coordinates.
     * @returns 
     */
    public getAllSquareUpperLeft(): Coordinate[] {
        return this.squaresUpperLefts.flat(1);
    }

    /**
     * Square Coordinates to Canvas Coordinates (upper left corner of the square)
     * @param coordinates
     */
    square(coordinate: Coordinate): Coordinate {
        const index = this.grid.getSquareIndex(coordinate);
        const upperLeft = this.grid.getSquareUpperLeftCorner(index);
        const upperLeftCoordinate = addPoints(upperLeft, this.gridUpperLeft);
        return upperLeftCoordinate;
    }

    

    squareCenter(coordinate: Coordinate): Coordinate {
        const square = this.square(coordinate);
        const offset = this.squareSize / 2;
        return {
            x: square.x + offset,
            y: square.y + offset,
        };
    }

    /**
     * Canvas Coordinate to Square Coordinate
     * finds where the canvas coordinate hits a square coordinate
     * @returns undefined if no square is intersected
     * @param coordinates
     */
    canvasToSquare(coordinates: Coordinate): Coordinate | undefined {
        return undefined;
    }

    contains(coordinate: Coordinate) {
        const { x, y } = coordinate;
        const inside = x < this.countX && y < this.countY && x >= 0 && y >= 0;
        return inside;
    }

    draw(context: CanvasRenderingContext2D) {
        this.squaresUpperLefts.forEach(({x, y}) => {
            context.fillRect(x, y, this.squareSize, this.squareSize);
        });
    }
}
