import { state } from './state.js';
import { THROW_BASE_FRAME_MS, MAX_FRAME_SCALE, KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_DOWN } from './constants.js';
import { inclination, variationRate, setNewThrowItemPos } from './projectile-math.js';
import { reached, nextThiefPosition } from './geometry.js';
import { objectAt, mirrorObj } from './display.js';
import { activeOfficers, nextOfficerPos } from './officer-ai.js';

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
        const scale = Math.min(elapsed / THROW_BASE_FRAME_MS, MAX_FRAME_SCALE);

        if (!reached(itemPos, state.ITEMSIZE, targetPos, state.CHARSIZE)) {
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
        activeOfficers().forEach(function(officer, index) {
            moveOfficer(index, scale);
        });
    }
}

function moveOfficer(whichOfficer, scale) {
    const facing = nextOfficerPos(whichOfficer, scale);
    const element = state.officers[whichOfficer].element;
    if (facing === 'right') mirrorObj(element, '-1');
    if (facing === 'left') mirrorObj(element, '1');
    objectAt(element, state.officers[whichOfficer].pos);
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
