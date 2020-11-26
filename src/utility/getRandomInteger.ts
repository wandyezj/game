/**
 * get integer within [min, max] includes min and max as possibilities
 * @param min
 * @param max
 */
export function getRandomInteger(min: number, max: number) {
    if (min > max) {
        throw `min must be < max, min ${min} max: ${max}`;
    }

    const size = Math.abs(max - min) + 1;
    return Math.floor(Math.random() * size) + min;
}
