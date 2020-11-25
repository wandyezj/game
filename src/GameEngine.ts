import { CanvasGrid } from "./CanvasGrid";
import { Coordinate } from "./Coordinate";
import { GamePiece } from "./GamePiece";
import { GamePieceArrow } from "./GamePieceArrow";

/**
 * Class to manage the game,
 * game board is based on a grid system
 */
export class GameEngine {

    private arrow: GamePieceArrow;

    private pieces: GamePiece[] = [];

    constructor(private grid: CanvasGrid) {
        const arrow = new GamePieceArrow(grid);
        this.arrow = arrow 
        this.pieces.push(arrow);
    }

    // Draw the state of the engine
    draw(context: CanvasRenderingContext2D) {

        // Draw all squares in the grid
        context.fillStyle = "green";
        this.grid.draw(context);
        this.pieces.forEach((piece) => {
            piece.draw(context);
        })
    }

    moveArrowTo(to: Coordinate) {
        this.arrow.moveTo(to);
    }


}
