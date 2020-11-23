export function getHexColor(red: number, green: number, blue: number) {
    const min = 0;
    const max = 255;

    const hexColor = [red, green, blue]
        .map((c) => {
            const bounded = Math.floor(bound(c, min, max));
            const hex = bounded.toString(16).padStart(2, "0");
            return hex;
        })
        .join("");
    // const r = Math.floor(bound(red, min, max));
    // const g = Math.floor(bound(green, min, max));
    // const b = Math.floor(bound(blue, min, max));

    // const redHex = r.toString(16).padStart(2, "0");
    // const greenHex = g.toString(16).padStart(2, "0");
    // const blueHex = b.toString(16).padStart(2, "0");

    const hex = `#${hexColor}`; //`#${redHex}${greenHex}${blueHex}`;
    return hex;
}

function bound(n: number, min: number, max: number): number {
    if (n > max) {
        return max;
    }

    if (n < min) {
        return min;
    }

    return n;
}
