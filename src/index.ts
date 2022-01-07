import { ImageLibrary } from "./ImageLibrary";
import { GameCanvas } from "./GameCanvas";
import { targetImage } from "./constants";

let game: GameCanvas;
let library = new ImageLibrary();

document.onload = () => {
    console.log("document onload");
};

document.body.onload = () => {
    console.log("body onload");
    start();
};

let gameRefreshInterval: any;

/**
 * Interval between game ticks
 */
const tickIntervalMilliseconds = 500;

// Only have game proceed so many ticks
const maxTicks = 2;
let currentTicks = 0;
async function gameTick() {
    if (currentTicks < maxTicks || maxTicks < 0) {
        game.tick();
    }
    currentTicks++;
}

export async function start() {
    console.log("start");
    const canvas = document.getElementById("game") as HTMLCanvasElement;
    // const rect = canvas.getBoundingClientRect();
    // const offsetX = rect.x;
    // const offsetY = rect.y;

    await library.load(targetImage);
    game = new GameCanvas(canvas, library);
    game.setup();
    game.draw();

    gameRefreshInterval = setInterval(gameTick, tickIntervalMilliseconds);

    window.addEventListener("click", function (e) {
        // event reports general screen coordinates
        // translate general coordinates to the canvas coordinates
        // The upper Right corner of the canvas in screen coordinates

        // const x = e.pageX - offsetX;
        // const y = e.pageY - offsetY;

        const x = e.pageX;
        const y = e.pageY;

        console.log(`${x} ${y}`);
        game.click(x, y);

        // // technically should only pass if within the bounding rect of the game
        // if (x >= 0 && y >= 0 && x <= canvas.width && y <= canvas.height) {
        //     console.log("game canvas click")
        //     game.click(x, y);
        // } else {
        //     console.log(`${x} ${y} not in 0 0 ${canvas.width} ${canvas.height}`);
        // }
    });
}
