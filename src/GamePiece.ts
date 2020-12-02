import { Coordinate } from "./Coordinate";

export interface GamePiece {
    readonly coordinates: Coordinate;
    readonly kind: PieceKind;
    draw(context: CanvasRenderingContext2D, center: Coordinate): void;
}

export enum PieceKind {
    Arrow,
}
