function Motion() {

    this.moveItAll = moveItAll;
    this.throwItem = throwItem;
    this.changePoliceMoveRate = changePoliceMoveRate;

    return this;

    function moveItAll(scale) {
        moveThief(scale);
        movePolice(scale);
    }

    function throwItem(item, itemPos, targetPos, callback) {
        const shooterPosX = itemPos[0],
            shooterPosY = itemPos[1],
            inclination = projectileMath.inclination(itemPos, targetPos),
            variationRate = projectileMath.variationRate(THROWSPEED, inclination);
        let lastFrameTime;

        requestAnimationFrame(moveItem);

        function moveItem(timestamp) {
            if (lastFrameTime === undefined) lastFrameTime = timestamp;
            const elapsed = timestamp - lastFrameTime;
            lastFrameTime = timestamp;
            const scale = Math.min(elapsed / THROWFRAMERATE, MAX_FRAME_SCALE);

            if ((!geometry.reached(itemPos, ITEMSIZE, targetPos, CHARSIZE)) && (!isNaN(variationRate))) {
                itemPos = projectileMath.setNewThrowItemPos(
                        shooterPosX,
                        shooterPosY,
                        itemPos,
                        targetPos,
                        inclination,
                        variationRate * scale
                    );
                display.objectAt(item, itemPos);
                requestAnimationFrame(moveItem);
                return;
            }
            callback();
        }
    }

    function changePoliceMoveRate() {
        officers[0].moveRate = SPEEDTABLE[currLevel][0];
        officers[1].moveRate = SPEEDTABLE[currLevel][1];
    }

    function moveThief(scale) {
        const direction = getDirection();
        setThiefHorDirection(direction);
        thiefPosArr = geometry.nextThiefPosition(
                thiefPosArr,
                thiefMoveRate * scale,
                direction
            );
        display.objectAt(Thief, thiefPosArr);
    }

    function movePolice(scale) {
        if (molotovTime <= 0) {
            moveOfficer(0, scale);
            if (officerAI.isTwoPolicemenLevel()) moveOfficer(1, scale);
        }
    }

    function moveOfficer(whichOfficer, scale) {
        officerAI.nextOfficerPos(whichOfficer, scale);
        display.objectAt(officers[whichOfficer].element, officers[whichOfficer].pos);
    }

    function setThiefHorDirection(direction) {
        switch (direction) {
            case 'left':
                display.mirrorObj(Thief, '1');
                break;
            case 'right':
                display.mirrorObj(Thief, '-1');
                break;
        }
    }

    function getDirection() {
        let pressedKeyBump;
        switch (pressedKey) {
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
                if ((pressedKey != pressedKeyBump)) {
                    game.resetGame();
                    pressedKeyBump = pressedKey;
                }
                break;
            default:
                pressedKeyBump = false;
                return false;
        }
    }

}
