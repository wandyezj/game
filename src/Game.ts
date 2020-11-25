import { getRandomNamedColor } from "./utility/getRandomNamedColor";
import { getRandomHexColor } from "./utility/getRandomHexColor";
import { Coordinate } from "./Coordinate";
import { CanvasClick } from "./CanvasClick";
import { ImageLibrary } from "./ImageLibrary";
import { CanvasGrid } from "./CanvasGrid";
import { targetImage } from "./constants";
import { CanvasPaint } from "./CanvasPaint";

export class Game {
    private width: number = 600;
    private height: number = 600;
    private context: CanvasRenderingContext2D;
    private clickAreas = new CanvasClick();

    private paint: CanvasPaint;
    private grid: CanvasGrid;
 
    constructor(
        private canvas: HTMLCanvasElement,
        private library: ImageLibrary
    ) {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext("2d");
        this.paint = new CanvasPaint(this.context);
    }

        /**
     * Things that should happen once
     */
    setup() {
        this.grid = this.createGrid();
        this.registerSquareCallbacks(this.grid, this.context);
    }

    createGrid() {
        const separation = 1;
        const size = 36;
        const border = 1;
        
        const count = 16;

        function centeredOffset(
            dimension: number,
            border: number,
            size: number,
            separation: number
        ) {
            const step = size + separation;
            const count = Math.floor((dimension - border * 2) / step);
            return Math.floor(
                (dimension - (size * count + separation * (count - 1))) / 2
            );
        }

        const offsetX = centeredOffset(this.width, border, size, separation);
        const offsetY = centeredOffset(this.height, border, size, separation);

        return new CanvasGrid(
            offsetX,
            offsetY,
            count,
            count,
            size,
            separation
        );
    }

    /**
     * called when the canvas needs to be drawn
     */
    draw() {
        // black out the canvas
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.width, this.height);

       // Draw all squares in the grid
        this.context.fillStyle = "green";
        this.grid.draw(this.context);

        this.paint.arrow(this.grid.squareCenter({x:5, y:6}), this.grid.squareSize / 1.3, {circleColor: "pink", lightsOn: true});
    }



    private registerSquareCallbacks(grid: CanvasGrid, context: CanvasRenderingContext2D) {
        // Register Every Square with a Callback
        for (let x = 0; x < grid.countX; x++) {
            for (let y = 0; y < grid.countY; y++) {
                const area = grid.square({ x, y });
                const squareSize = grid.squareSize;
                const callback = () => {
                    console.log(`${x} ${y}`);
                    const color = getRandomNamedColor();
                    console.log(color);
                    context.fillStyle = color;
                    context.fillRect(area.x, area.y, squareSize, squareSize);
                };
                this.clickAreas.addSquare(
                    `square_${x}_${y}`,
                    area,
                    squareSize,
                    callback
                );
            }
        }
    }

    /**
     * to be called when the canvas is clicked where it was clicked
     * @param x
     * @param y
     */
    click(x: number, y: number) {
        // technically should only pass if within the bounding rect of the game
        // if (x >= 0 && y >= 0 && x <= canvas.width && y <= canvas.height) {
        //     console.log("game canvas click")
        //     game.click(x, y);
        // } else {
        //     console.log(`${x} ${y} not in 0 0 ${canvas.width} ${canvas.height}`);
        // }

        // Translate to canvas coordinates
        const rect = this.canvas.getBoundingClientRect();
        const offsetX = rect.x;
        const offsetY = rect.y;

        const canvasX = x - offsetX;
        const canvasY = y - offsetY;

        // check if inside canvas
        if (
            canvasX > 0 &&
            canvasY > 0 &&
            canvasX < this.width &&
            canvasY < this.height
        ) {
            this.clickCanvas(canvasX, canvasY);
        } else {
            console.log("click not in canvas");
        }
    }

    private clickCanvas(x: number, y: number) {
        // create a red square centered on where the board was clicked
        this.context.fillStyle = "red";
        const size = 10;
        const offset = size / 2;
        this.context.fillRect(x - offset, y - offset, size, size);

        // Click the Click Areas
        this.clickAreas.click({ x, y });
    }



    // EXAMPLES

    private exampleSizes() {
        let start = 1;
        for (let length of [1, 10, 100]) {
            this.context.fillStyle = "blue";
            this.context.fillRect(start, start, length, length);
            start += length + 1;
        }

    }

    private exampleDrawGrid() {
        const offsetX = 0;
        const offsetY = 0;

        const squareSize = 10;
        const separation =2;
        const step = squareSize + separation;

        let idX = 0;
        let idY = 0;
        for (let y = offsetY; y < this.height - step; y += step) {
            idX = 0;
            for (let x = offsetX; x < this.width - step; x += step) {
                this.context.fillStyle = "pink";
                this.context.fillRect(x, y, squareSize, squareSize);

                this.context.fillStyle = "black";
                this.context.fillText(
                    `${idX.toString(16).toUpperCase()} ${idY
                        .toString(16)
                        .toUpperCase()}`,
                    x + 5,
                    y + 10
                );
                idX++;
            }

            idY = idY + 1;
        }
    }

    
    private exampleImageRotation(grid: CanvasGrid) {
        let { x, y } = grid.square({ x: 0, y: 0 });
        const image = this.library.getBitmap(targetImage);
        this.context.drawImage(image, x, y);

        //this.drawExampleTransform(context);
        //this.context.rotate(45);
        // default transformation (none)
        //this.transform(1, 1, 0, 0, 0, 0);
        //this.transform(1,1,)
        //this.context.rotate(Math.PI /4);
        // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Transformations
        //this.context.transform(1, 0.5, -0.5, 1, 30, 10)
        const square = grid.square({ x: 1, y: 1 });
        const centerX = square.x + image.width / 2;
        const centerY = square.y + image.height / 2;
        const degrees = 45;
        this.context.save();
        this.paint.rotate({ x: centerX, y: centerY }, degrees);
        this.paint.image(image, square);
        this.context.restore();

        const imageCenter = { x: image.width / 2, y: image.height / 2 };

        this.paint.imageAtPositionWithRotation(
            image,
            imageCenter,
            grid.square({ x: 2, y: 2 }),
            90
        );

        [
            { coordinates: { x: 2, y: 2 }, degrees: 90 },
            { coordinates: { x: 3, y: 3 }, degrees: 135 },
            { coordinates: { x: 4, y: 4 }, degrees: 270 },
            { coordinates: { x: 5, y: 5 }, degrees: 315 },
        ].forEach(({ coordinates, degrees }) => {
            this.paint.imageAtPositionWithRotation(
                image,
                imageCenter,
                grid.square(coordinates),
                degrees
            );
        });
    }

    private exampleClickSquare(grid: CanvasGrid, size: number, context: CanvasRenderingContext2D) {
        const firstSquare = grid.square({ x: 0, y: 0 });
        this.clickAreas.addSquare("square_0-0", firstSquare, size, () => {
            const { x, y } = firstSquare;
            // Make this a random color to make it more interactive
            const color = getRandomHexColor();
            console.log(color);
            context.fillStyle = color;
            context.fillRect(x, y, size, size);
        });
    }

    private exampleTransform(context: CanvasRenderingContext2D) {
        context.save();
        // right rectangles, rotate from rectangle center
        // draw blue rect
        context.fillStyle = "#0095DD";
        context.fillRect(150, 30, 100, 100);

        context.translate(200, 80); // translate to rectangle center


        // x = x + 0.5 * width
        // y = y + 0.5 * height
        context.rotate((Math.PI / 180) * 25); // rotate
        context.translate(-200, -80); // translate back


        // draw grey rect
        context.fillStyle = "#4D4E53";
        context.fillRect(150, 30, 100, 100);
        context.restore();
    }

}
