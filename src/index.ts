import { ImageLibrary } from "./ImageLibrary";
import { Game } from "./Game";
import { targetImage } from "./constants";

let game: Game;
let library = new ImageLibrary();

document.onload = () => {
    console.log("document onload");
};

document.body.onload = () => {
    console.log("body onload");
    start();
};

let gameRefreshInterval: any;


async function gameTick(){
    game.tick();
}

export async function start() {
    console.log("start");
    const canvas = document.getElementById("game") as HTMLCanvasElement;
    // const rect = canvas.getBoundingClientRect();
    // const offsetX = rect.x;
    // const offsetY = rect.y;

    await library.load(targetImage);
    game = new Game(canvas, library);
    game.setup();
    game.draw();

    gameRefreshInterval = setInterval(gameTick, 1000);

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
