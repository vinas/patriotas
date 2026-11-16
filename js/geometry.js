import { state } from './state.js';
import { BASE_MAP_SIZE } from './constants.js';

export function scaleToMap(actual) {
    return Math.floor(scaleToMapExact(actual));
}

// Same scaling without rounding, for small steps that would otherwise vanish on narrow maps.
export function scaleToMapExact(actual) {
    return (actual / BASE_MAP_SIZE) * state.mapSize;
}

export function messagePos(objPosArr) {
    const subtitleWidth = scaleToMap(90),
        subtitleHeight = scaleToMap(30);
    let leftPos = objPosArr[0],
        topPos = objPosArr[1] + state.charSize;
    if ((leftPos + subtitleWidth) >= state.mapSize)
        leftPos = objPosArr[0] - ((leftPos + subtitleWidth) - state.mapSize);
    if ((topPos + subtitleHeight) >= state.mapSize)
        topPos = objPosArr[1] - subtitleHeight;
    return [leftPos, topPos];
}

// Direction -> [axis, sign]: axis 0 is horizontal (x), 1 is vertical (y).
const STEPS = { left: [0, -1], right: [0, 1], up: [1, -1], down: [1, 1] };

export function moveThiefPosition(posArr, movRate, direction) {
    if (!direction) return posArr;
    const [axis, sign] = STEPS[direction];
    posArr[axis] = adjustCrossBorder(posArr[axis] + sign * movRate);
    return posArr;
}

export function randomCoords() {
    return [
            Math.floor((Math.random() * (state.mapSize - state.itemSize))),
            Math.floor((Math.random() * (state.mapSize - state.itemSize)))
        ];
}

export function reached(hunter, hunterSize, prey, preySize) {
    return (
            (
                (hunter[0] >= (prey[0] - hunterSize))
                && (hunter[0] < (prey[0] + preySize))
            )
            && (
                (hunter[1] >= (prey[1] - hunterSize))
                && (hunter[1] < (prey[1] + preySize))
            )
        );
}

function adjustCrossBorder(pos) {
    if (pos > state.mapSize)
        return -state.crossBorderTolerance;
    if (pos <= (-state.charSize + state.crossBorderTolerance))
        return state.mapSize - state.crossBorderTolerance;
    return pos;
}
