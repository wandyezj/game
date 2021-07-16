import { Coordinate } from "./Coordinate";

type Callback = () => void;
type InsideCoordinateCallback = (coordinate: Coordinate) => boolean;

export class CanvasClick {
    /**
     * Order that the clicks are called in matters
     */
    private tests: {
        id: string;
        test: InsideCoordinateCallback;
        callback: Callback;
    }[] = [];

    add(id: string, test: InsideCoordinateCallback, callback: Callback) {
        this.tests.push({
            id,
            test,
            callback,
        });
    }

    addSquare(
        id: string,
        upperLeftCoordinate: Coordinate,
        size: number,
        callback: Callback
    ) {
        const test = (coordinate: Coordinate) => {
            const { x, y } = coordinate;
            const lowerY = upperLeftCoordinate.y;
            const upperY = lowerY + size;
            const lowerX = upperLeftCoordinate.x;
            const upperX = lowerX + size;

            // test that it is within the bounds of the rectangle
            const insideBounds =
                x >= lowerX && x <= upperX && y >= lowerY && y <= upperY;

            return insideBounds;
        };
        this.add(id, test, callback);
    }

    click(coordinate: Coordinate) {
        this.tests.forEach(({ test, callback }) => {
            if (test(coordinate)) {
                callback();
            }
        });
    }
}
