import { Coordinate } from "./Coordinate";

/**
 * class to figure out coordinates for drawing a grid of squares
 */
export class CanvasGrid {
    private squareCoordinates: Coordinate[][];
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
        private topLeftX: number,
        private topLeftY: number,
        public countX: number,
        public countY: number,
        public squareSize: number,
        private separation: number
    ) {
        const coordinates = [];

        let coordinateX = this.topLeftX;
        for (let x = 0; x < this.countX; x++) {
            const column = [];

            let coordinateY = this.topLeftY;
            for (let y = 0; y < this.countY; y++) {
                column.push({ x: coordinateX, y: coordinateY });

                coordinateY += this.squareSize + this.separation;
            }
            coordinates.push(column);

            coordinateX += this.squareSize + this.separation;
        }

        this.squareCoordinates = coordinates;
    }

    public get squares(): Coordinate[] {
        return this.squareCoordinates.flat(1);
    }

    /**
     * Square Coordinates to Canvas Coordinates
     * @param coordinates
     */
    square(coordinates: Coordinate): Coordinate {
        return this.squareCoordinates[coordinates.x][coordinates.y];
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
        this.squareCoordinates.forEach((column) => {
            column.forEach((square) => {
                const { x, y } = square;
                context.fillRect(x, y, this.squareSize, this.squareSize);
            });
        });
    }
}
