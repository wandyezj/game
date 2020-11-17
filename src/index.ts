/**
 * class to figure out coordinates for drawing a grid of squares
 */
class CanvasGrid {
    private squareCoordinates: { x: number; y: number }[][];
    /**
     *
     * @param x upper left
     * @param y upper right
     * @param countX squares in x
     * @param countY squares in y
     * @param size of squares
     * @param separation distance between squares
     */
    constructor(
        private topLeftX: number,
        private topLeftY: number,
        private countX: number,
        private countY: number,
        private size: number,
        private separation: number
    ) {
        const coordinates = [];

        let coordinateX = this.topLeftX;
        for (let x = 0; x < this.countX; x++) {
            const column = [];

            let coordinateY = this.topLeftY;
            for (let y = 0; y < this.countY; y++) {
                column.push({ x: coordinateX, y: coordinateY });

                coordinateY += this.size + this.separation;
            }
            coordinates.push(column);

            coordinateX += this.size + this.separation;
        }

        this.squareCoordinates = coordinates;
    }

    square(coordinates: { x: number; y: number }): { x: number; y: number } {
        return this.squareCoordinates[coordinates.x][coordinates.y];
    }

    draw(context: CanvasRenderingContext2D) {
        this.squareCoordinates.forEach((column) => {
            column.forEach((square) => {
                const { x, y } = square;
                context.fillRect(x, y, this.size, this.size);
            });
        });
    }
}

class Game {
    private width: number = 600;
    private height: number = 600;
    private context: CanvasRenderingContext2D;
    constructor(
        private canvas: HTMLCanvasElement,
        private library: ImageLibrary
    ) {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext("2d");
    }

    draw() {
        // black out the canvas
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.width, this.height);

        // let start = 1;
        // for (let length of [1, 10, 100]) {
        //     this.context.fillStyle = "blue";
        //     this.context.fillRect(start, start, length, length);
        //     start += length + 1;
        // }

        const separation = 1;
        const size = 36;
        const border = 1;
        const step = size + separation;

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

        // Draw all squares in the grid
        let idX = 0;
        let idY = 0;
        for (let y = offsetY; y < this.height - step; y += step) {
            idX = 0;
            for (let x = offsetX; x < this.width - step; x += step) {
                this.context.fillStyle = "pink";
                this.context.fillRect(x, y, size, size);

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

        this.context.fillStyle = "green";
        const count = 16;
        const grid = new CanvasGrid(
            offsetX,
            offsetY,
            count,
            count,
            size,
            separation
        );
        grid.draw(this.context);

        let { x, y } = grid.square({ x: 0, y: 0 });
        const image = this.library.getBitmap(targetImage);
        this.context.drawImage(image, x, y);

        const context = this.context;
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
        this.rotate({ x: centerX, y: centerY }, degrees);
        this.drawImage(image, square);
        this.context.restore();

        const imageCenter = { x: image.width / 2, y: image.height / 2 };

        this.drawImageAtPositionWithRotation(
            image,
            imageCenter,
            grid.square({ x: 2, y: 2 }),
            90
        );

        [
            //{coordinates: {x:2, y:2}, degrees: 90},
            { coordinates: { x: 3, y: 3 }, degrees: 135 },
            { coordinates: { x: 4, y: 4 }, degrees: 270 },
            { coordinates: { x: 5, y: 5 }, degrees: 315 },
        ].forEach(({ coordinates, degrees }) => {
            this.drawImageAtPositionWithRotation(
                image,
                imageCenter,
                grid.square(coordinates),
                degrees
            );
        });
    }

    drawImageAtPositionWithRotation(
        image: ImageBitmap,
        imageCenter: { x: number; y: number },
        position: { x: number; y: number },
        degrees: number
    ) {
        this.context.save();
        const centerX = position.x + imageCenter.x;
        const centerY = position.y + imageCenter.y;
        const center = { x: centerX, y: centerY };

        this.rotate(center, degrees);
        this.drawImage(image, position);
        this.context.restore();
    }

    /**
     * rotates around a center point
     * @param centerX
     * @param centerY
     * @param degrees
     */
    rotate(center: { x: number; y: number }, degrees: number) {
        const radians = (Math.PI / 180) * (degrees % 360);
        this.context.translate(center.x, center.y);
        this.context.rotate(radians);
        this.context.translate(0 - center.x, 0 - center.y);
    }

    drawImage(image: ImageBitmap, coordinates: { x: number; y: number }) {
        const { x, y } = coordinates;
        this.context.drawImage(image, x, y);
    }

    transform(
        horizontalScaling: number,
        verticalScaling: number,

        horizontalSkewing: number,
        verticalSkewing: number,

        horizontalMoving: number,
        verticalMoving: number
    ) {
        /*
        Parameter   Description
        a           Horizontal scaling	
        b           Horizontal skewing	
        c           Vertical skewing	
        d           Vertical scaling	
        e           Horizontal moving	
        f           Vertical moving
        */
        const a = horizontalScaling;
        const b = horizontalSkewing;
        const c = verticalSkewing;
        const d = verticalScaling;
        const e = horizontalMoving;
        const f = verticalMoving;
        this.context.transform(a, b, c, d, e, f);
    }
}

class ImageLibrary {
    readonly images = new Map<string, HTMLImageElement>();
    readonly bitmaps = new Map<string, ImageBitmap>();
    constructor() {}

    async load(src: string) {
        // should really do it in bulk
        console.log(`loadImage ${src}`);
        const image = await loadImage(src);
        this.images.set(src, image);
        console.log(`createBitmap ${src}`);
        const bitmap = await createImageBitmap(image);
        this.bitmaps.set(src, bitmap);
    }

    getBitmap(src: string) {
        const image = this.bitmaps.get(src);
        return image;
        // if (image) {
        //     return image;
        // }
        // or should return a default image
        //throw `Image not found: [${src}]`;
    }
}

let game: Game;
let library = new ImageLibrary();

const targetImage = "./pictures/target36transparent.png";

document.onload = () => {
    console.log("document onload");
};

document.body.onload = () => {
    console.log("body onload");
    start();
};

export async function start() {
    console.log("start");
    const canvas = document.getElementById("game") as HTMLCanvasElement;
    await library.load(targetImage);
    game = new Game(canvas, library);
    game.draw();
}

async function loadImage(src: string): Promise<HTMLImageElement> {
    let resolvePromise = undefined;
    const promise = new Promise<HTMLImageElement>((resolve) => {
        resolvePromise = resolve;
    });

    const image = new Image();
    image.onload = (event) => {
        debugger;
        resolvePromise(image);
    };
    image.src = src;

    return promise;
}
