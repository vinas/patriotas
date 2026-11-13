import { state } from './state.js';
import { BONUSTIME, MOLOTOVPAUSE } from './constants.js';
import { reached } from './geometry.js';
import { endGame, scorePoints, changeLevel } from './game.js';
import { flash, money, hideClock, clockFeedback, molotovFeedback, bombFeedback } from './display.js';
import { activeOfficers } from './officer-ai.js';

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
    if (state.isMolotovThrown) return;
    if (reached(state.thiefPosArr, state.CHARSIZE, state.molotovPos, state.ITEMSIZE)) {
        state.isMolotovThrown = true;
        state.molotovTime = MOLOTOVPAUSE;
        molotovFeedback();
    }
}

function gotBomb() {
    if (state.isBombThrown) return;
    if (reached(state.thiefPosArr, state.CHARSIZE, state.bombPos, state.ITEMSIZE)) {
        state.isBombThrown = true;
        bombFeedback();
        if (state.currLevel > 1) {
            changeLevel(-1);
            state.CurrLevel.innerHTML = state.currLevel;
        }
    }
}

function wasThiefCought() {
    return activeOfficers().some(function(officer) {
        return reached(
            officer.pos,
            (state.CHARSIZE - state.CATCHTOLERANCE),
            state.thiefPosArr,
            (state.CHARSIZE - state.CATCHTOLERANCE)
        );
    });
}
