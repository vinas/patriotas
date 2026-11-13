import { state } from './state.js';
import { MONEY_BONUS_TIME, MOLOTOV_FREEZE_TIME, CLOCK_BONUS_TIME } from './constants.js';
import { reached } from './geometry.js';
import { endGame, scorePoints, changeLevel } from './game.js';
import { flash, spawnMoney, hideClock, showClockBonus, throwMolotov, throwBomb, renderLevel, showBustedScreen } from './display.js';
import { activeOfficers } from './officer-ai.js';

export function checkGotBusted() {
    if (state.molotovTime <= 0 && isThiefCaught()) endGame(showBustedScreen);
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
    if (reached(state.thiefPos, state.charSize, state.moneyPos, state.itemSize)) {
        state.coinSound.play();
        scorePoints();
        state.time = state.time + MONEY_BONUS_TIME;
        flash(state.timeEl);
        spawnMoney();
    }
}

function gotClock() {
    if (reached(state.thiefPos, state.charSize, state.clockPos, state.itemSize)) {
        state.time = state.time + CLOCK_BONUS_TIME;
        hideClock();
        showClockBonus();
    }
}

function gotMolotov() {
    if (state.isMolotovThrown) return;
    if (reached(state.thiefPos, state.charSize, state.molotovPos, state.itemSize)) {
        state.isMolotovThrown = true;
        state.molotovTime = MOLOTOV_FREEZE_TIME;
        throwMolotov();
    }
}

function gotBomb() {
    if (state.isBombThrown) return;
    if (reached(state.thiefPos, state.charSize, state.bombPos, state.itemSize)) {
        state.isBombThrown = true;
        throwBomb();
        if (state.currLevel > 1) {
            changeLevel(-1);
            renderLevel();
        }
    }
}

function isThiefCaught() {
    return activeOfficers().some(function(officer) {
        return reached(
            officer.pos,
            (state.charSize - state.catchTolerance),
            state.thiefPos,
            (state.charSize - state.catchTolerance)
        );
    });
}
