import { CanvasGrid } from "./CanvasGrid";
import { CanvasPaint } from "./CanvasPaint";
import { Coordinate } from "./Coordinate";
import { GamePiece } from "./GamePiece";

export class GamePieceArrow implements GamePiece {

    coordinates: Coordinate  = {x:0, y:0};
    directionDegrees: number = 90;
    show: boolean = true;
    constructor(private grid: CanvasGrid) {

    }

    draw(context: CanvasRenderingContext2D): void {
        if (this.show) {
            CanvasPaint.arrow(context, 
            this.grid.squareCenter(this.coordinates), 
            this.grid.squareSize/ 1.3,
            { circleColor: "cyan", lightsOn: true })
        }
    }

    moveTo(to: Coordinate) {
        this.coordinates = to;
    }

}