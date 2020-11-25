export function radiansToDegrees(radians) {
    const degrees = ((radians * 180) / Math.PI) % 360;
    return degrees;
}
