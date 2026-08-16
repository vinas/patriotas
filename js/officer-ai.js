function OfficerAI()
{
    this.isTwoPolicemenLevel = isTwoPolicemenLevel;
    this.nextOfficerPos = nextOfficerPos;
    this.officer2StartPos = officer2StartPos;

    return this;

    function isTwoPolicemenLevel() {
        return (currLevel >= TWOPOLICEMENLEVEL);
    }

    function nextOfficerPos(whichOfficer, scale) {
        const officer = officers[whichOfficer].element;
        const relativePositions = getRelativePositions(whichOfficer);
        const limit = MAPSIZE - CHARSIZE;
        const moveRate = officers[whichOfficer].moveRate * scale;
        if (movingAxis(whichOfficer) == 'horizontal') {
            let nextVal;
            switch (relativePositions[0]) {
                case 'right':
                    display.mirrorObj(officer, '-1');
                    nextVal = officers[whichOfficer].pos[0] + moveRate;
                    if (nextVal > limit) nextVal = limit;
                    officers[whichOfficer].pos[0] = nextVal;
                    break;
                case 'left':
                    display.mirrorObj(officer, '1');
                    nextVal = officers[whichOfficer].pos[0] - moveRate;
                    if (nextVal < 0) nextVal = 0;
                    officers[whichOfficer].pos[0] = nextVal;
            }
            return;
        }
        let nextVal;
        switch (relativePositions[1]) {
            case 'up':
                nextVal = officers[whichOfficer].pos[1] - moveRate;
                if (nextVal < 0) nextVal = 0;
                officers[whichOfficer].pos[1] = nextVal;
                break;
            case 'down':
                nextVal = officers[whichOfficer].pos[1] + moveRate;
                if (nextVal > limit) nextVal = limit;
                officers[whichOfficer].pos[1] = nextVal;
        }

    }

    function officer2StartPos() {
        const midMap = MAPSIZE / 2,
            tolerance = MAPSIZE - CHARSIZE;
        officers[1].pos[0] = (thiefPosArr[0] >= midMap) ? 0 : tolerance;
        officers[1].pos[1] = (thiefPosArr[1] >= midMap) ? 0 : tolerance;
    }

    function getRelativePositions(officer) {
        return [
            getTargetHorRelPos(officer),
            getTargetVerRelPos(officer)
        ];
    }

    function getTargetHorRelPos(officer) {
        if (officers[officer].pos[0] > thiefPosArr[0])
            return 'left';
        if (officers[officer].pos[0] < thiefPosArr[0])
            return 'right';
        return 'same';
    }

    function getTargetVerRelPos(officer) {
        if (officers[officer].pos[1] > thiefPosArr[1])
           return 'up';
        if (officers[officer].pos[1] < thiefPosArr[1])
            return 'down';
        return 'same';
    }

    function movingAxis(officer) {
        const diffX = getAbsoluteDiff(officers[officer].pos[0], thiefPosArr[0]),
            diffY = getAbsoluteDiff(officers[officer].pos[1], thiefPosArr[1]);
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
}
