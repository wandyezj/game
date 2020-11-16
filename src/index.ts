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

        const image = library.getBitmap(targetImage);
        this.context.drawImage(image, 0, 0);
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

const targetImage = "./pictures/target36.png";

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
