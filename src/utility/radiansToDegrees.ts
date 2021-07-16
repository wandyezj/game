export function radiansToDegrees(radians: number): number {
    const degrees = ((radians * 180) / Math.PI) % 360;
    return degrees;
}
