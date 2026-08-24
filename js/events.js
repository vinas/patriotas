import { state } from './state.js';
import { BONUSTIME, MOLOTOVPAUSE } from './constants.js';
import { reached } from './geometry.js';
import { endGame, scorePoints, changeLevel } from './game.js';
import { flash, money, hideClock, clockFeedback, molotovFeedback, bombFeedback } from './display.js';
import { isTwoPolicemenLevel } from './officer-ai.js';

export function checkGotBusted() {
    if (state.molotovTime <= 0 && wasThiefCought()) endGame('busted');
}

export function checkGotItem() {
    gotMoney();
    if (state.isClockVisible)
        gotClock();
    if (state.isMolotovVisible)
        gotMolotov();
    if (state.isBombVisible)
        gotBomb();
}

function gotMoney() {
    if (reached(state.thiefPosArr, state.CHARSIZE, state.moneyPos, state.ITEMSIZE)) {
        state.coinSound.play();
        scorePoints();
        state.time = state.time + BONUSTIME;
        flash(state.Time);
        money();
    }
}

function gotClock() {
    if (reached(state.thiefPosArr, state.CHARSIZE, state.clockPos, state.ITEMSIZE)) {
        state.time = state.time + 10;
        hideClock();
        clockFeedback();
    }
}

function gotMolotov() {
    if (reached(state.thiefPosArr, state.CHARSIZE, state.molotovPos, state.ITEMSIZE)) {
        state.molotovTime = MOLOTOVPAUSE;
        molotovFeedback();
    }
}

function gotBomb() {
    if (reached(state.thiefPosArr, state.CHARSIZE, state.bombPos, state.ITEMSIZE)) {
        bombFeedback();
        if (state.currLevel > 1) {
            changeLevel(-1);
            state.CurrLevel.innerHTML = state.currLevel;
        }
    }
}

function wasThiefCought() {
    return (reached(
                state.officers[0].pos,
                (state.CHARSIZE - state.CATCHTOLERANCE),
                state.thiefPosArr,
                (state.CHARSIZE - state.CATCHTOLERANCE)
            )
        )
        || (
            (isTwoPolicemenLevel())
            && (reached(
                    state.officers[1].pos,
                    (state.CHARSIZE - state.CATCHTOLERANCE),
                    state.thiefPosArr,
                    (state.CHARSIZE - state.CATCHTOLERANCE)
                )
            )
        );
}
