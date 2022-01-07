import { CanvasGrid } from "./CanvasGrid";
import { CanvasPaint } from "./CanvasPaint";
import { Coordinate } from "./Coordinate";
import { GamePiece, GamePieceKind } from "./GamePiece";
import { GamePieceArrow } from "./GamePieceArrow";
import { GamePieceSelect } from "./GamePieceSelect";
import { GamePieceTest } from "./GamePieceTest";

/**
 * Class to manage the game,
 * game board is based on a grid system
 */
export class GameEngine {
    private arrow: GamePieceArrow;

    private arrows = new Map<string, GamePieceArrow>();
    private pieces: GamePiece[] = [];

    // technically not a game piece
    private select: GamePieceSelect;

    constructor(private grid: CanvasGrid) {

        // Piece for testing out drawings
        const test = new GamePieceTest({x:5, y:5});

        const arrowOne = new GamePieceArrow(grid, "Chartreuse");
        const arrowTwo = new GamePieceArrow(grid, "Crimson");
        const arrowThree = new GamePieceArrow(grid, "Cyan");
        const arrow = new GamePieceArrow(grid, "Blue");
        

        const select = new GamePieceSelect(grid);

        this.arrows.set("one", arrowOne);
        this.arrows.set("two", arrowTwo);
        this.arrows.set("three", arrowThree);

        this.arrow = arrow;
        this.select = select;

        const allPieces = [test, arrow, arrowOne, arrowTwo, arrowThree, select];
        this.pieces.push(...allPieces);
    }

    getPiecesAtPositions(): GamePiece[][][] {
        const positions: GamePiece[][][] = [];

        // initialize with empty
        for (let x = 0; x < this.grid.countX; x++) {
            const column = [];
            for (let y = 0; y < this.grid.countY; y++) {
                column.push([]);
            }
            positions.push(column);
        }

        // place all pieces at positions
        // could be faster with a map?
        this.pieces.forEach((piece) => {
            const { x, y } = piece.coordinates;
            positions[x][y].push(piece);
        });

        // get all pieces at positions

        return positions;
    }

    // Draw the state of the engine
    draw(context: CanvasRenderingContext2D) {
        // Draw all squares in the grid
        context.fillStyle = "Azure"; //"DeepSkyBlue"; //"DarkBlue";
        this.grid.draw(context);
        // Is there a quick way to tell if pieces are intersecting?

        const positions = this.getPiecesAtPositions();

        for (let x = 0; x < positions.length; x++) {
            const column = positions[x];
            for (let y = 0; y < column.length; y++) {
                const pieces = column[y];

                if (pieces) {
                    // Might be convenient to have a special structure that stores pieces
                    const arrows: GamePieceArrow[] = pieces.filter(
                        (x) => x.kind === GamePieceKind.Arrow
                    ) as GamePieceArrow[];
                    const others = pieces.filter(
                        (x) => x.kind !== GamePieceKind.Arrow
                    );
                    const center = this.grid.squareCenter({ x, y });

                    others.forEach((piece) => {
                        GameEngine.drawPiece(context, center, piece);
                        console.log(
                            `draw other ${x} ${y} ${GamePieceKind[piece.kind]}`
                        );
                    });

                    if (arrows.length === 1) {
                        GameEngine.drawPiece(context, center, arrows[0]);
                    } else if (arrows.length > 1) {
                        const colorCountMap: { [key: string]: number } = {};
                        arrows
                            .map((a) => a.color)
                            .forEach((color) => {
                                if (colorCountMap[color] === undefined) {
                                    colorCountMap[color] = 0;
                                }
                                colorCountMap[color] += 1;
                            });

                        const values = Object.getOwnPropertyNames(
                            colorCountMap
                        ).map((color) => {
                            return {
                                color: color,
                                value: colorCountMap[color],
                            };
                        });

                        // Order the values
                        values.sort((a, b) => {
                            return a.value - b.value;
                        });

                        // Draw circle thing instead
                        CanvasPaint.doughnut(
                            context,
                            center,
                            this.grid.squareSize / 3,
                            values
                        );
                    }

                    // if multiple arrows of kind then do something else
                    // need to order the drawing layer

                    // draw circle of multiple colors
                }
            }
        }
    }

    static drawPiece(
        context: CanvasRenderingContext2D,
        center: Coordinate,
        piece: GamePiece
    ) {
        context.save();
        piece.draw(context, center);
        context.restore();
    }

    moveArrowTo(to: Coordinate) {
        if (this.grid.contains(to)) {
            this.arrow.moveTo(to);
        }
    }

    clickSquare(to: Coordinate) {
        // Is to valid?
        if (this.grid.contains(to)) {
            this.moveArrowTo(to);
            this.select.moveTo(to);
        } else {
            console.log("Attempted to move outside");
        }
    }

    getArrowPosition(): Coordinate {
        return this.arrow.coordinates;
    }
}
