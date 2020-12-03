import { countReset } from "console";
import { CanvasGrid } from "./CanvasGrid";
import { CanvasPaint } from "./CanvasPaint";
import {
    Coordinate,
    coordinateDifference,
    coordinateEqual,
} from "./Coordinate";
import { GamePiece, GamePieceKind } from "./GamePiece";
import { radiansToDegrees } from "./utility/radiansToDegrees";

export class GamePieceSelect implements GamePiece {
    coordinates: Coordinate = { x: 0, y: 0 };

    show: boolean = true;
    constructor(private grid: CanvasGrid) {}

    get kind() {
        return GamePieceKind.Select;
    }

    draw(context: CanvasRenderingContext2D, center: Coordinate): void {
        if (this.show) {
            console.log("Draw GamePieceSelect");
            CanvasPaint.square(context, center, this.grid.squareSize, {
                color: "red",
            });
        }
    }

    moveTo(to: Coordinate) {
        // figure out angle

        const from = this.coordinates;

        if (coordinateEqual(from, to)) {
            return;
        }

        this.coordinates = to;
    }
}
