import { Coordinate } from "./Coordinate";

export interface GamePiece {
    readonly coordinates: Coordinate;
    readonly kind: GamePieceKind;
    draw(context: CanvasRenderingContext2D, center: Coordinate): void;
}

export enum GamePieceKind {
    Arrow,
    Select,
    Test,
}
