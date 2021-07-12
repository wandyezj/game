import { Grid } from "../src/utility/Grid";
import {Point} from "../src/utility/Point";

test("basic", () => {
    const sizeX = 3;
    const sizeY = 2;
    const squareSize = 5;
    const lineSize = 5;
    const grid = new Grid(sizeX, sizeY, squareSize, lineSize);
    
    const index = grid.getSquareByIndex(0);
    expect(index).toEqual({x:0, y:0});

    const center = grid.getSquareCenter(0);
    expect(center).toEqual({x:2.5, y: 2.5});

    const tests: [string, Point, number | undefined][]  = [
        ["inside" ,{x:2, y: 2}, 0],
        ["outside x left", {x:-1, y: 1}, undefined],
        ["outside y top",{x:1, y: -1}, undefined],
        ["outside x right", {x:9999, y:1}, undefined],
        ["outside y bottom",{x:1, y:9999}, undefined],
    ];

    tests.forEach(([name, point, expected]) => {
        const actual = grid.getSquareIndexContainingPoint(point);
        expect(actual).toEqual(expected);
    });
});