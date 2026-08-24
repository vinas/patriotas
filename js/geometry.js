import { state } from './state.js';

export function crossMultiply(actual) {
    return Math.floor((actual / 500) * state.MAPSIZE);
}

export function messagePos(objPosArr) {
    const ninety = crossMultiply(90),
        thirty = crossMultiply(30);
    let leftPos = parseInt(objPosArr[0]),
        topPos = parseInt(objPosArr[1]) + state.CHARSIZE;
    if ((leftPos + ninety) >= state.MAPSIZE)
        leftPos = parseInt(objPosArr[0]) - ((leftPos + ninety) - state.MAPSIZE);
    if ((topPos + thirty) >= state.MAPSIZE)
        topPos = parseInt(objPosArr[1]) - thirty;
    return [leftPos, topPos];
}

export function nextThiefPosition(posArr, movRate, direction) {
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
            Math.floor((Math.random() * (state.MAPSIZE - state.ITEMSIZE))),
            Math.floor((Math.random() * (state.MAPSIZE - state.ITEMSIZE)))
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
    if (pos > state.MAPSIZE)
        return -state.CROSSBORDERTOLERANCE;
    if (pos <= (-state.CHARSIZE + state.CROSSBORDERTOLERANCE))
        return state.MAPSIZE - state.CROSSBORDERTOLERANCE;
    return pos;
}
