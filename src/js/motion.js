function Motion()
{

    this.moveItAll = moveItAll;
    this.throwItem = throwItem;
    this.changePoliceMoveRate = changePoliceMoveRate;

    return this;

    function moveItAll() {
        moveThief();
        movePolice();
    }

    function throwItem(item, itemPos, targetPos, callback) {
        var shooterPosX = itemPos[0],
            shooterPosY = itemPos[1],
            inclination = calc.inclination(itemPos, targetPos),
            variationRate = calc.variationRate(THROWSPEED, inclination);

        moveItem();

        function moveItem() {
            if ((!reached(itemPos, ITEMSIZE, targetPos, CHARSIZE)) && (!isNaN(variationRate))) {
                itemPos = calc.setNewThrowItemPos(
                        shooterPosX,
                        shooterPosY,
                        itemPos,
                        targetPos,
                        inclination,
                        variationRate
                    );
                display.objectAt(item, itemPos);
                setTimeout(function() {
                    moveItem();
                }, 10);
                return;
            }
            callback();
        }
    }

    function changePoliceMoveRate() {
        officerMoveRate[0] = SPEEDTABLE[currLevel][0];
        officerMoveRate[1] = SPEEDTABLE[currLevel][1];
    }

    function moveThief() {
        var direction = getDirection();
        setThiefHorDirection(direction);
        thiefPosArr = calc.nextThiefPosition(
                thiefPosArr,
                thiefMoveRate,
                direction
            );
        display.objectAt(Thief, thiefPosArr);
    }

    function movePolice() {
        if (molotovTime <= 0) {
            moveOfficer(0);
            if (calc.isTwoPolicemenLevel()) moveOfficer(1);
        }
    }

    function moveOfficer(whichOfficer) {
        calc.nextOfficerPos(whichOfficer);
        display.objectAt((whichOfficer == 0) ? Officer1 : Officer2, officerPosArr[whichOfficer]);
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
        var pressedKeyBump;
        switch (pressedKey) {
            case 37:
                return 'left';
            case 38:
                return 'up';
            case 39:
                return 'right';
            case 40:
                return 'down';
                break;
            case 13:
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
