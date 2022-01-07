import { off } from "process";
import { Coordinate } from "./Coordinate";
import { degreesToRadians } from "./utility/degreesToRadians";

/**
 * Class to control drawing on the canvas
 */
export class CanvasPaint {
    constructor(private context: CanvasRenderingContext2D) {}

    static arrow(
        context: CanvasRenderingContext2D,
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

        context.beginPath();
        context.lineWidth = 2;
        context.lineJoin = "round";
        context.strokeStyle = "black";
        // left ->  tip -> right
        context.moveTo(left.x, left.y);
        context.lineTo(tip.x, tip.y);
        context.lineTo(right.x, right.y);
        // right -> tip -> left
        context.arcTo(tip.x, tip.y, left.x, left.y, height / 4);
        // need to draw the line
        context.stroke();

        // Center Circle
        context.lineWidth = 2;
        CanvasPaint.circle(context, center, 6, { color: circleColor });

        // debug
        if (lightsOn) {
            context.lineWidth = 1;
            const point = 1;
            // https://en.wikipedia.org/wiki/Navigation_light
            const points: [Coordinate, string][] = [
                [tip, "white"],
                [right, "red"],
                [left, "lime"],
            ];

            points.forEach(([coordinate, color]) => {
                CanvasPaint.circle(context, coordinate, point, {
                    color,
                    fill: true,
                });
            });
            // this.drawCircle(tip, point, {fill: "white"});
            // this.drawCircle(right, point, {fill: "red"});
            // this.drawCircle(left, point, {fill: "lime"});
        }
    }

    static circle(
        context: CanvasRenderingContext2D,
        center: Coordinate,
        radius: number,
        options: { color?: string; fill?: boolean } = {}
    ) {
        CanvasPaint.circularArc(context, center, radius, {
            ...options,
            startRadians: 0,
            endRadians: Math.PI * 2,
        });
    }

    static circularArc(
        context: CanvasRenderingContext2D,
        center: Coordinate,
        radius: number,
        options: {
            color?: string;
            fill?: boolean;
            startRadians?: number;
            endRadians?: number;
        } = { startRadians: 0, endRadians: 0 }
    ) {
        const { color, fill, startRadians, endRadians } = options;

        context.beginPath();
        context.ellipse(
            center.x,
            center.y,
            radius,
            radius,
            0,
            startRadians,
            endRadians
        );
        if (color) {
            context.strokeStyle = color;
            context.fillStyle = color;
        }

        if (fill) {
            context.fill();
        } else {
            context.stroke();
        }
    }

    /**
     * Draw a doughnut
     * @param context
     * @param values
     */
    static doughnut(
        context: CanvasRenderingContext2D,
        center: Coordinate,
        radius: number,
        values: { value: number; color: string }[]
    ) {
        const total = values
            .map((item) => item.value)
            .reduce((previous, current) => previous + current, 0);

        //CanvasPaint.circle(context, center, radius, {color: ordered[0].color})
        // Position so that it starts at the top and goes clockwise
        let current = -Math.PI / 2;
        values.forEach((value) => {
            const percentage = value.value / total;
            const color = value.color;
            const increase = percentage * 2 * Math.PI;
            const previous = current;
            current = previous + increase;

            const startRadians = previous;
            const endRadians = current;

            //console.log(`${color} ${percentage} ${startRadians} ${endRadians}`);
            context.lineWidth = 5;
            CanvasPaint.circularArc(context, center, radius, {
                color,
                startRadians,
                endRadians,
            });
        });

        // draw each percentage
        // Draw color based on percentage of whole
    }

    static square(
        context: CanvasRenderingContext2D,
        center: Coordinate,
        size: number,
        options: {
            color?: string;
        } = {}
    ) {
        const { color } = options;

        const offset = size / 2;
        const x = center.x - offset;
        const y = center.y - offset;

        context.beginPath();
        if (color) {
            context.strokeStyle = color;
            context.lineWidth = 5;
        }

        context.rect(x, y, size, size);
        context.stroke();
    }

    static spiralArchimedean(context: CanvasRenderingContext2D, center: Coordinate) {
        
    }

    static spiralFibonacci(context: CanvasRenderingContext2D, center: Coordinate) {

        const scale  = 10;
        let {x, y} = center;
        let radius = 1;
        const rotation = 0;
        let angleStart = 3* (Math.PI * 2) /4;
        let angleEnd = Math.PI * 2; 
        const arcs = 9

        context.beginPath();

        // figure out centers
        context.strokeStyle = "black"
        context.lineWidth = 1;
        
        // graw ellipse
        //context.ellipse(x, y, radius, radius, rotation, angleStart, angleEnd);

        // fibonacci
        let previous = 0
        let current = 1

        let offsetX = 0;
        let offsetY = 0;

        for (let i = 0; i < arcs; i++) {
            
            const radius = current * scale;
            const delta = previous * scale;

            angleStart = angleEnd;
            angleEnd += Math.PI /2;

            console.log(`(${offsetX}, ${offsetY}) ${radius} ${delta}`);
            const centerX = x + offsetX;
            const centerY = y + offsetY;

            //CanvasPaint.circle(context, {x: centerX, y: centerY}, radius, {color: "pink"})
            //context.lineTo(centerX, centerY);
            context.ellipse(centerX, centerY, radius, radius, rotation, angleStart, angleEnd);
            
            
            // direction is one of the following
            const direction = i % 4

            switch(direction) {
                case 0:
                    offsetY -= delta;
                    break;
                case 1:
                    offsetX += delta;
                    break;
                case 2:
                    offsetY += delta;
                    break;
                case 3:
                    offsetX -= delta;
                    break;
            }

            //drawArc(x,y, radius, 


            // calculate next number in the fibonacci sequence
            let next = previous + current;
            previous = current;
            current = next;


        }

        context.stroke();
    }

    imageAtPositionWithRotation(
        image: ImageBitmap,
        imageCenter: { x: number; y: number },
        position: { x: number; y: number },
        degrees: number
    ) {
        const context = this.context;
        context.save();
        const centerX = position.x + imageCenter.x;
        const centerY = position.y + imageCenter.y;
        const center = { x: centerX, y: centerY };

        CanvasPaint.rotate(context, center, degrees);
        this.image(image, position);
        context.restore();
    }

    /**
     * rotates around a center point
     * @param centerX
     * @param centerY
     * @param degrees
     */
    static rotate(
        context: CanvasRenderingContext2D,
        center: { x: number; y: number },
        degrees: number
    ) {
        const radians = degreesToRadians(degrees);
        context.translate(center.x, center.y);
        context.rotate(radians);
        context.translate(0 - center.x, 0 - center.y);
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
