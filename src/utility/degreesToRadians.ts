export function degreesToRadians(degrees: number) {
    const radians = (Math.PI / 180) * (degrees % 360);
    return radians;
}
