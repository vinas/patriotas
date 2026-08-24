import { state } from './state.js';
import { TWOPOLICEMENLEVEL } from './constants.js';
import { mirrorObj } from './display.js';

export function isTwoPolicemenLevel() {
    return (state.currLevel >= TWOPOLICEMENLEVEL);
}

export function nextOfficerPos(whichOfficer, scale) {
    const officer = state.officers[whichOfficer].element;
    const relativePositions = getRelativePositions(whichOfficer);
    const limit = state.MAPSIZE - state.CHARSIZE;
    const moveRate = state.officers[whichOfficer].moveRate * scale;
    if (movingAxis(whichOfficer) == 'horizontal') {
        let nextVal;
        switch (relativePositions[0]) {
            case 'right':
                mirrorObj(officer, '-1');
                nextVal = state.officers[whichOfficer].pos[0] + moveRate;
                if (nextVal > limit) nextVal = limit;
                state.officers[whichOfficer].pos[0] = nextVal;
                break;
            case 'left':
                mirrorObj(officer, '1');
                nextVal = state.officers[whichOfficer].pos[0] - moveRate;
                if (nextVal < 0) nextVal = 0;
                state.officers[whichOfficer].pos[0] = nextVal;
        }
        return;
    }
    let nextVal;
    switch (relativePositions[1]) {
        case 'up':
            nextVal = state.officers[whichOfficer].pos[1] - moveRate;
            if (nextVal < 0) nextVal = 0;
            state.officers[whichOfficer].pos[1] = nextVal;
            break;
        case 'down':
            nextVal = state.officers[whichOfficer].pos[1] + moveRate;
            if (nextVal > limit) nextVal = limit;
            state.officers[whichOfficer].pos[1] = nextVal;
    }

}

export function officer2StartPos() {
    const midMap = state.MAPSIZE / 2,
        tolerance = state.MAPSIZE - state.CHARSIZE;
    state.officers[1].pos[0] = (state.thiefPosArr[0] >= midMap) ? 0 : tolerance;
    state.officers[1].pos[1] = (state.thiefPosArr[1] >= midMap) ? 0 : tolerance;
}

function getRelativePositions(officer) {
    return [
        getTargetHorRelPos(officer),
        getTargetVerRelPos(officer)
    ];
}

function getTargetHorRelPos(officer) {
    if (state.officers[officer].pos[0] > state.thiefPosArr[0])
        return 'left';
    if (state.officers[officer].pos[0] < state.thiefPosArr[0])
        return 'right';
    return 'same';
}

function getTargetVerRelPos(officer) {
    if (state.officers[officer].pos[1] > state.thiefPosArr[1])
       return 'up';
    if (state.officers[officer].pos[1] < state.thiefPosArr[1])
        return 'down';
    return 'same';
}

function movingAxis(officer) {
    const diffX = getAbsoluteDiff(state.officers[officer].pos[0], state.thiefPosArr[0]),
        diffY = getAbsoluteDiff(state.officers[officer].pos[1], state.thiefPosArr[1]);
    if (diffX != diffY) {
        if (officer == 0) {
            if (diffX > diffY)
                return 'horizontal';
            if (diffX < diffY)
                return 'vertical';
        }
        if (diffX > diffY)
            return 'vertical';
        if (diffX < diffY)
            return 'horizontal';
    }
    if (Math.floor((Math.random() * 2) + 1) == 1)
        return 'horizontal';
    return 'vertical';
}

function getAbsoluteDiff(firstObjCoord, secondObjCoord) {
    return Math.abs(firstObjCoord - secondObjCoord);
}
