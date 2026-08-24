import { state } from './state.js';
import { THROWFRAMERATE, MAX_FRAME_SCALE, KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_DOWN, KEY_ENTER } from './constants.js';
import { inclination, variationRate, setNewThrowItemPos } from './projectile-math.js';
import { reached, nextThiefPosition } from './geometry.js';
import { objectAt, mirrorObj } from './display.js';
import { isTwoPolicemenLevel, nextOfficerPos } from './officer-ai.js';
import { resetGame } from './game.js';

export function moveItAll(scale) {
    moveThief(scale);
    movePolice(scale);
}

export function throwItem(item, itemPos, targetPos, callback) {
    const shooterPosX = itemPos[0],
        shooterPosY = itemPos[1],
        itemInclination = inclination(itemPos, targetPos),
        itemVariationRate = variationRate(state.THROWSPEED, itemInclination);
    let lastFrameTime;

    requestAnimationFrame(moveItem);

    function moveItem(timestamp) {
        if (lastFrameTime === undefined) lastFrameTime = timestamp;
        const elapsed = timestamp - lastFrameTime;
        lastFrameTime = timestamp;
        const scale = Math.min(elapsed / THROWFRAMERATE, MAX_FRAME_SCALE);

        if ((!reached(itemPos, state.ITEMSIZE, targetPos, state.CHARSIZE)) && (!isNaN(itemVariationRate))) {
            itemPos = setNewThrowItemPos(
                    shooterPosX,
                    shooterPosY,
                    itemPos,
                    targetPos,
                    itemInclination,
                    itemVariationRate * scale
                );
            objectAt(item, itemPos);
            requestAnimationFrame(moveItem);
            return;
        }
        callback();
    }
}

export function changePoliceMoveRate() {
    state.officers[0].moveRate = state.SPEEDTABLE[state.currLevel][0];
    state.officers[1].moveRate = state.SPEEDTABLE[state.currLevel][1];
}

function moveThief(scale) {
    const direction = getDirection();
    setThiefHorDirection(direction);
    state.thiefPosArr = nextThiefPosition(
            state.thiefPosArr,
            state.thiefMoveRate * scale,
            direction
        );
    objectAt(state.Thief, state.thiefPosArr);
}

function movePolice(scale) {
    if (state.molotovTime <= 0) {
        moveOfficer(0, scale);
        if (isTwoPolicemenLevel()) moveOfficer(1, scale);
    }
}

function moveOfficer(whichOfficer, scale) {
    nextOfficerPos(whichOfficer, scale);
    objectAt(state.officers[whichOfficer].element, state.officers[whichOfficer].pos);
}

function setThiefHorDirection(direction) {
    switch (direction) {
        case 'left':
            mirrorObj(state.Thief, '1');
            break;
        case 'right':
            mirrorObj(state.Thief, '-1');
            break;
    }
}

function getDirection() {
    let pressedKeyBump;
    switch (state.pressedKey) {
        case KEY_LEFT:
            return 'left';
        case KEY_UP:
            return 'up';
        case KEY_RIGHT:
            return 'right';
        case KEY_DOWN:
            return 'down';
            break;
        case KEY_ENTER:
            if ((state.pressedKey != pressedKeyBump)) {
                resetGame();
                pressedKeyBump = state.pressedKey;
            }
            break;
        default:
            pressedKeyBump = false;
            return false;
    }
}
