import { getHexColor } from "./getHexColor";
import { randomWhole } from "./random";

export function getRandomHexColor() {
    const min = 0;
    const max = 255;
    const r = randomWhole(min, max);
    const g = randomWhole(min, max);
    const b = randomWhole(min, max);

    const color = getHexColor(r, g, b);
    return color;
}
