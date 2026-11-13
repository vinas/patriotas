import { state } from './state.js';
import { BASE_MAP_SIZE } from './constants.js';

export function crossMultiply(actual) {
    return Math.floor(crossMultiplyExact(actual));
}

// Same scaling without rounding, for small steps that would otherwise vanish on narrow maps.
export function crossMultiplyExact(actual) {
    return (actual / BASE_MAP_SIZE) * state.mapSize;
}

export function messagePos(objPosArr) {
    const ninety = crossMultiply(90),
        thirty = crossMultiply(30);
    let leftPos = objPosArr[0],
        topPos = objPosArr[1] + state.charSize;
    if ((leftPos + ninety) >= state.mapSize)
        leftPos = objPosArr[0] - ((leftPos + ninety) - state.mapSize);
    if ((topPos + thirty) >= state.mapSize)
        topPos = objPosArr[1] - thirty;
    return [leftPos, topPos];
}

export function nextThiefPosition(posArr, movRate, direction) {
    if (!direction) return posArr;
    let level;
    switch (direction) {
        case 'left':
            posArr[0] = posArr[0] - movRate;
            level = 0;
            break;
        case 'right':
            posArr[0] = posArr[0] + movRate;
            level = 0;
            break;
        case 'up':
            posArr[1] = posArr[1] - movRate;
            level = 1;
            break;
        case 'down':
            posArr[1] = posArr[1] + movRate;
            level = 1;
    }
    posArr[level] = adjustCrossBorder(posArr[level])
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
