import { Coordinate } from "./Coordinate";

export interface GamePiece {
    readonly coordinates: Coordinate;
    draw(context: CanvasRenderingContext2D): void;
}
