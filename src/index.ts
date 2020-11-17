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

    square(x: number, y: number): { x: number; y: number } {
        return this.squareCoordinates[x][y];
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

        let start = 1;
        for (let length of [1, 10, 100]) {
            this.context.fillStyle = "blue";
            this.context.fillRect(start, start, length, length);
            start += length + 1;
        }

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

        const image = this.library.getBitmap(targetImage);
        this.context.drawImage(image, 0, 0);

        this.context.fillStyle = "green";
        const grid = new CanvasGrid(0, 0, 10, 10, 50, 1);
        grid.draw(this.context);
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
