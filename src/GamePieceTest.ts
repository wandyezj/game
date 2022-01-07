import { CanvasPaint } from "./CanvasPaint";
import { Coordinate } from "./Coordinate";
import { GamePiece, GamePieceKind } from "./GamePiece";

export class GamePieceTest implements GamePiece {
    readonly kind: GamePieceKind = GamePieceKind.Test;
    constructor(readonly coordinates: Coordinate) {
        
    }

    draw(context: CanvasRenderingContext2D, center: Coordinate) {
        CanvasPaint.spiralFibonacci(context, center);
    }
}