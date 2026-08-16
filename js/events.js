function Events()
{
    this.checkGotItem = checkGotItem;
    this.checkGotBusted = checkGotBusted;

    return this;

    function checkGotBusted() {
        if (molotovTime <= 0 && wasThiefCought()) game.endGame('busted');
    }

    function checkGotItem() {
        gotMoney();
        if (isClockVisible)
            gotClock();
        if (isMolotovVisible)
            gotMolotov();
        if (isBombVisible)
            gotBomb();
    }

    function gotMoney() {
        if (geometry.reached(thiefPosArr, CHARSIZE, moneyPos, ITEMSIZE)) {
            coinSound.play();
            game.scorePoints();
            time = time + BONUSTIME;
            display.flash(Time);
            display.money();
        }
    }

    function gotClock() {
        if (geometry.reached(thiefPosArr, CHARSIZE, clockPos, ITEMSIZE)) {
            time = time + 10;
            display.hideClock();
            display.clockFeedback();
        }
    }

    function gotMolotov() {
        if (geometry.reached(thiefPosArr, CHARSIZE, molotovPos, ITEMSIZE)) {
            molotovTime = MOLOTOVPAUSE;
            display.molotovFeedback();
        }
    }

    function gotBomb() {
        if (geometry.reached(thiefPosArr, CHARSIZE, bombPos, ITEMSIZE)) {
            display.bombFeedback();
            if (currLevel > 1) {
                game.changeLevel(-1);
                CurrLevel.innerHTML = currLevel;
            }
        }
    }

    function wasThiefCought() {
        return (geometry.reached(
                    officers[0].pos,
                    (CHARSIZE - CATCHTOLERANCE),
                    thiefPosArr,
                    (CHARSIZE - CATCHTOLERANCE)
                )
            )
            || (
                (officerAI.isTwoPolicemenLevel())
                && (geometry.reached(
                        officers[1].pos,
                        (CHARSIZE - CATCHTOLERANCE),
                        thiefPosArr,
                        (CHARSIZE - CATCHTOLERANCE)
                    )
                )
            );
    }

}
