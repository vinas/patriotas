import { state } from './state.js';
import { THROW_BASE_FRAME_MS, MAX_FRAME_SCALE, KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_DOWN } from './constants.js';
import { slope, stepAlongX, setNewThrowItemPos } from './projectile-math.js';
import { reached, moveThiefPosition } from './geometry.js';
import { placeElement, faceDirection } from './display.js';
import { activeOfficers, moveOfficerTowardThief } from './officer-ai.js';

export function moveItAll(scale) {
    moveThief(scale);
    movePolice(scale);
}

export function throwItem(item, itemPos, targetPos, callback) {
    const startX = itemPos[0],
        startY = itemPos[1],
        itemInclination = slope(itemPos, targetPos),
        itemVariationRate = stepAlongX(state.throwSpeed, itemInclination);
    let lastFrameTime;

    requestAnimationFrame(moveItem);

    function moveItem(timestamp) {
        if (lastFrameTime === undefined) lastFrameTime = timestamp;
        const elapsed = timestamp - lastFrameTime;
        lastFrameTime = timestamp;
        const scale = Math.min(elapsed / THROW_BASE_FRAME_MS, MAX_FRAME_SCALE);

        if (!reached(itemPos, state.itemSize, targetPos, state.charSize)) {
            itemPos = setNewThrowItemPos(
                    startX,
                    startY,
                    itemPos,
                    targetPos,
                    itemInclination,
                    itemVariationRate * scale
                );
            placeElement(item, itemPos);
            requestAnimationFrame(moveItem);
            return;
        }
        callback();
    }
}

export function changePoliceMoveRate() {
    state.officers[0].moveRate = state.speedTable[state.currLevel][0];
    state.officers[1].moveRate = state.speedTable[state.currLevel][1];
}

function moveThief(scale) {
    const direction = getDirection();
    setThiefHorDirection(direction);
    state.thiefPos = moveThiefPosition(
            state.thiefPos,
            state.thiefMoveRate * scale,
            direction
        );
    placeElement(state.thiefEl, state.thiefPos);
}

function movePolice(scale) {
    if (state.molotovTime <= 0) {
        activeOfficers().forEach(function(officer, index) {
            moveOfficer(index, scale);
        });
    }
}

function moveOfficer(whichOfficer, scale) {
    const facing = moveOfficerTowardThief(whichOfficer, scale);
    const element = state.officers[whichOfficer].element;
    if (facing === 'right') faceDirection(element, '-1');
    if (facing === 'left') faceDirection(element, '1');
    placeElement(element, state.officers[whichOfficer].pos);
}

function setThiefHorDirection(direction) {
    switch (direction) {
        case 'left':
            faceDirection(state.thiefEl, '1');
            break;
        case 'right':
            faceDirection(state.thiefEl, '-1');
            break;
    }
}

function getDirection() {
    switch (state.pressedKey) {
        case KEY_LEFT:
            return 'left';
        case KEY_UP:
            return 'up';
        case KEY_RIGHT:
            return 'right';
        case KEY_DOWN:
            return 'down';
        default:
            return false;
    }
}
