import { state } from './state.js';
import { THROW_BASE_FRAME_MS, MAX_FRAME_SCALE, KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_DOWN } from './constants.js';
import { slope, stepAlongX, setNewThrowItemPos } from './projectile-math.js';
import { reached, moveThiefPosition } from './geometry.js';
import { placeElement, faceDirection } from './display.js';
import { activeOfficers, moveOfficerTowardThief } from './officer-ai.js';

const DIRECTION_OF_KEY = { [KEY_LEFT]: 'left', [KEY_UP]: 'up', [KEY_RIGHT]: 'right', [KEY_DOWN]: 'down' };

// The scaleX that turns a sprite towards each side.
const FACING = { left: '1', right: '-1' };

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
    const scaleX = FACING[moveOfficerTowardThief(whichOfficer, scale)];
    const element = state.officers[whichOfficer].element;
    if (scaleX) faceDirection(element, scaleX);
    placeElement(element, state.officers[whichOfficer].pos);
}

function setThiefHorDirection(direction) {
    if (FACING[direction]) faceDirection(state.thiefEl, FACING[direction]);
}

function getDirection() {
    return DIRECTION_OF_KEY[state.pressedKey] || false;
}
