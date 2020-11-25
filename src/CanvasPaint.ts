import { Coordinate } from "./Coordinate";

/**
 * Class to control drawing on the canvas
 */
export class CanvasPaint {
    constructor(private context: CanvasRenderingContext2D) {}

    arrow(
        center: Coordinate,
        height: number,
        options: { circleColor?: string; lightsOn?: boolean } = {}
    ) {
        const { circleColor, lightsOn } = options;
        const width = height / 2;

        const tip = { x: center.x, y: center.y - height / 2 };
        const right = { x: tip.x - width / 2, y: tip.y + height };
        const left = { x: tip.x + width / 2, y: tip.y + height };

        // how wide should the circle be based on the center?

        this.context.beginPath();
        this.context.lineWidth = 2;
        this.context.lineJoin = "round";
        this.context.strokeStyle = "black";
        // left ->  tip -> right
        this.context.moveTo(left.x, left.y);
        this.context.lineTo(tip.x, tip.y);
        this.context.lineTo(right.x, right.y);
        // right -> tip -> left
        this.context.arcTo(tip.x, tip.y, left.x, left.y, height / 4);
        // need to draw the line
        this.context.stroke();

        // Center Circle
        this.context.lineWidth = 2;
        this.circle(center, 6, { color: circleColor });

        // debug
        if (lightsOn) {
            this.context.lineWidth = 1;
            const point = 1;
            // https://en.wikipedia.org/wiki/Navigation_light
            const points: [Coordinate, string][] = [
                [tip, "white"],
                [right, "red"],
                [left, "lime"],
            ];

            points.forEach(([coordinate, color]) => {
                this.circle(coordinate, point, { color, fill: true });
            });
            // this.drawCircle(tip, point, {fill: "white"});
            // this.drawCircle(right, point, {fill: "red"});
            // this.drawCircle(left, point, {fill: "lime"});
        }
    }

    circle(
        center: Coordinate,
        radius: number,
        options: { color?: string; fill?: boolean } = {}
    ) {
        const { color, fill } = options;

        this.context.beginPath();
        this.context.ellipse(
            center.x,
            center.y,
            radius,
            radius,
            0,
            0,
            Math.PI * 2
        );
        if (color) {
            this.context.strokeStyle = color;
            this.context.fillStyle = color;
        }

        if (fill) {
            this.context.fill();
        } else {
            this.context.stroke();
        }
    }

    imageAtPositionWithRotation(
        image: ImageBitmap,
        imageCenter: { x: number; y: number },
        position: { x: number; y: number },
        degrees: number
    ) {
        this.context.save();
        const centerX = position.x + imageCenter.x;
        const centerY = position.y + imageCenter.y;
        const center = { x: centerX, y: centerY };

        this.rotate(center, degrees);
        this.image(image, position);
        this.context.restore();
    }

    /**
     * rotates around a center point
     * @param centerX
     * @param centerY
     * @param degrees
     */
    rotate(center: { x: number; y: number }, degrees: number) {
        const radians = (Math.PI / 180) * (degrees % 360);
        this.context.translate(center.x, center.y);
        this.context.rotate(radians);
        this.context.translate(0 - center.x, 0 - center.y);
    }

    image(image: ImageBitmap, coordinates: { x: number; y: number }) {
        const { x, y } = coordinates;
        this.context.drawImage(image, x, y);
    }

    transform(
        horizontalScaling: number,
        verticalScaling: number,

        horizontalSkewing: number,
        verticalSkewing: number,

        horizontalMoving: number,
        verticalMoving: number
    ) {
        /*
        Parameter   Description
        a           Horizontal scaling	
        b           Horizontal skewing	
        c           Vertical skewing	
        d           Vertical scaling	
        e           Horizontal moving	
        f           Vertical moving
        */
        const a = horizontalScaling;
        const b = horizontalSkewing;
        const c = verticalSkewing;
        const d = verticalScaling;
        const e = horizontalMoving;
        const f = verticalMoving;
        this.context.transform(a, b, c, d, e, f);
    }
}
