import { CanvasGrid } from "./CanvasGrid";
import { CanvasPaint } from "./CanvasPaint";
import { Coordinate, coordinateDifference } from "./Coordinate";
import { GamePiece } from "./GamePiece";
import { radiansToDegrees } from "./utility/radiansToDegrees";

export class GamePieceArrow implements GamePiece {
    coordinates: Coordinate = { x: 0, y: 0 };
    directionDegrees: number = 0;

    show: boolean = true;
    constructor(private grid: CanvasGrid) {}

    draw(context: CanvasRenderingContext2D): void {
        if (this.show) {
            const center = this.grid.squareCenter(this.coordinates);
            CanvasPaint.rotate(context, center, this.directionDegrees);
            CanvasPaint.arrow(context, center, this.grid.squareSize / 1.3, {
                circleColor: "cyan",
                lightsOn: true,
            });
        }
    }

    moveTo(to: Coordinate) {
        // figure out angle

        const from = this.coordinates;
        const legs = coordinateDifference(to, from);
        const radians = Math.atan2(legs.y, legs.x);
        const degrees = radiansToDegrees(radians);

        //console.log(JSON.stringify(to))
        //console.log(`${JSON.stringify(from)} -> ${JSON.stringify(to)}`);
        //console.log(radians)
        //console.log(JSON.stringify(degrees))
        //console.log(JSON.stringify(to))
        //console.log(this.directionDegrees);

        this.directionDegrees = degrees + 90;
        this.coordinates = to;
    }
}
