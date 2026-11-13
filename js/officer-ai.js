import { state } from './state.js';
import { SECOND_OFFICER_LEVEL } from './constants.js';

export function isTwoPolicemenLevel() {
    return (state.currLevel >= SECOND_OFFICER_LEVEL);
}

// Officer 0 always chases; officer 1 only once the second officer level is reached.
export function activeOfficers() {
    return state.officers.slice(0, isTwoPolicemenLevel() ? 2 : 1);
}

// Moves the officer one step towards the thief and returns the horizontal
// direction it moved in ('left' or 'right'), or undefined if it moved vertically.
export function nextOfficerPos(whichOfficer, scale) {
    const relativePositions = getRelativePositions(whichOfficer);
    const limit = state.MAPSIZE - state.CHARSIZE;
    const moveRate = state.officers[whichOfficer].moveRate * scale;
    if (movingAxis(whichOfficer) == 'horizontal') {
        let nextVal;
        switch (relativePositions[0]) {
            case 'right':
                nextVal = state.officers[whichOfficer].pos[0] + moveRate;
                if (nextVal > limit) nextVal = limit;
                state.officers[whichOfficer].pos[0] = nextVal;
                return 'right';
            case 'left':
                nextVal = state.officers[whichOfficer].pos[0] - moveRate;
                if (nextVal < 0) nextVal = 0;
                state.officers[whichOfficer].pos[0] = nextVal;
                return 'left';
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

// Officer 0 closes the biggest gap first; officer 1 deliberately does the
// opposite (closes the smallest gap first), so the two flank the thief instead
// of stacking on the same path. Equal gaps are broken at random.
function movingAxis(officer) {
    const diffX = Math.abs(state.officers[officer].pos[0] - state.thiefPosArr[0]),
        diffY = Math.abs(state.officers[officer].pos[1] - state.thiefPosArr[1]);
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
