export function randomWhole(min: number, max: number): number {
    return Math.random() * (max + 1) + min;
}
