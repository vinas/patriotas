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
export function moveOfficerTowardThief(whichOfficer, scale) {
    const officer = state.officers[whichOfficer],
        axis = movingAxis(whichOfficer) == 'horizontal' ? 0 : 1,
        sign = Math.sign(state.thiefPos[axis] - officer.pos[axis]);
    if (sign === 0) return;
    const limit = state.mapSize - state.charSize,
        next = officer.pos[axis] + sign * officer.moveRate * scale;
    officer.pos[axis] = Math.min(limit, Math.max(0, next));
    if (axis === 0) return sign > 0 ? 'right' : 'left';
}

export function officer2StartPos() {
    const midMap = state.mapSize / 2,
        tolerance = state.mapSize - state.charSize;
    state.officers[1].pos[0] = (state.thiefPos[0] >= midMap) ? 0 : tolerance;
    state.officers[1].pos[1] = (state.thiefPos[1] >= midMap) ? 0 : tolerance;
}

// Officer 0 closes the biggest gap first; officer 1 deliberately does the
// opposite (closes the smallest gap first), so the two flank the thief instead
// of stacking on the same path. Equal gaps are broken at random.
function movingAxis(officer) {
    const diffX = Math.abs(state.officers[officer].pos[0] - state.thiefPos[0]),
        diffY = Math.abs(state.officers[officer].pos[1] - state.thiefPos[1]);
    if (diffX != diffY)
        return (diffX > diffY) === (officer === 0) ? 'horizontal' : 'vertical';
    return Math.floor((Math.random() * 2) + 1) == 1 ? 'horizontal' : 'vertical';
}
