import { state } from './state.js';
import { POINTS_PER_MONEY, BASE_FRAME_MS, MAX_FRAME_SCALE, LOW_TIME_WARNING, CLOCK_APPEARS_AT, SECOND_OFFICER_LEVEL, POINTS_PER_LEVEL } from './constants.js';
import { cacheDomElements, installFocusHandlers, resetAllValues, loadAssets, clearGameValues } from './setup.js';
import { resizeMapAndItems } from './resizer.js';
import { registerControls } from './controls.js';
import {
    hideGameValues, showStartButton, hideInGameElements, relocateCharacters, showInGameElements,
    spawnMoney, resetHud, updatePointsDisplay, flash, spawnClock, restorePolicemen, spawnMolotov, hideMolotov,
    showFreezeCounters, updateDifficultyDisplay, setNewBackground, show2ndPoliceman, hideOfficer2,
    showTimeUpScreen, spawnBomb, hideBomb
} from './display.js';
import { moveItAll, changePoliceMoveRate } from './motion.js';
import { checkGotItem, checkGotBusted } from './events.js';
import { rollBombAppears, rollBombVanishes, rollMolotov } from './spawn-chance.js';

let lastFrameTime;

export async function init() {
    cacheDomElements();
    resizeMapAndItems();
    registerControls();
    requestAnimationFrame(gameLoop);
    gameClock();
    // The sounds only exist once everything is downloaded, and the focus handlers use them.
    await loadAssets();
    installFocusHandlers();
}

// showEndScreen is the display function for the way the game ended (showBustedScreen or showTimeUpScreen).
export function endGame(showEndScreen) {
    state.gameOn = false;
    state.fastTheme.pause();
    state.slowTheme.pause();
    state.endGameSound.currentTime = 0;
    state.endGameSound.play();
    showEndScreen();
    hideGameValues();
    showStartButton();
    clearGameValues();
}

export function resetGame() {
    resetAllValues();
    hideInGameElements();
    relocateCharacters();
    showInGameElements();
    spawnMoney();
    resetHud();
    state.loadingTheme.pause();
    state.endGameSound.pause();
    state.fastTheme.pause();
    state.fastTheme.currentTime = 0;
    state.slowTheme.currentTime = 0;
    state.loadingTheme.currentTime = 18;
    state.slowTheme.play();
    state.gameOn = true;
}

export function scorePoints() {
    state.points = state.points + POINTS_PER_MONEY;
    updatePointsDisplay();
    handleLevelChange();
}

export function changeLevel(delta) {
    state.currLevel = state.currLevel + delta;
    changePoliceMoveRate();
    syncSecondOfficerAndMusic(delta);
}

/**** Private helpers ****/

function gameLoop(timestamp) {
    if (lastFrameTime === undefined) lastFrameTime = timestamp;
    const elapsed = timestamp - lastFrameTime;
    lastFrameTime = timestamp;
    if (state.gameOn) {
        const scale = Math.min(elapsed / BASE_FRAME_MS, MAX_FRAME_SCALE);
        moveItAll(scale);
        checkGotItem();
        checkGotBusted();
    }
    requestAnimationFrame(gameLoop);
}

function gameClock() {
    if (state.gameOn) {
        if (state.time < 0) {
            endGame(showTimeUpScreen);
            return;
        }
        state.timeEl.innerHTML = state.time
        if (state.time <= LOW_TIME_WARNING) flash(state.timeEl);
        handleDisplayableItems();
        state.time = state.time - 1;
    }
    setTimeout(gameClock, 1000);
}

function handleDisplayableItems() {
    handleClock();
    handleMolotov();
    handleBombDisplay();
}

function handleClock() {
    if ((state.time == CLOCK_APPEARS_AT) && (!state.isClockVisible)) {
        spawnClock();
    }
}

function handleMolotov() {
    handleMolotovDisplay();
    handleMolotovTime();
    if (state.molotovTime == 0) restorePolicemen();
}

function handleMolotovDisplay() {
    if (rollMolotov()) {
        if (state.isMolotovVisible) {
            hideMolotov();
        } else {
            spawnMolotov();
        }
    }
}

function handleMolotovTime() {
    if (state.molotovTime > 1) {
        state.molotovTime = state.molotovTime - 1;
        showFreezeCounters();
        return;
    }
    state.molotovTime = 0;
}

function handleBombDisplay() {
    if (state.currLevel > 1) {
        if (rollBombAppears()) spawnBomb();
        else if (rollBombVanishes()) hideBomb();
    }
}

function handleLevelChange() {
    if (shouldLevelUp()) {
        state.pointsAtLastLevelUp = state.points;
        changeLevel(1);
        updateDifficultyDisplay();
        setNewBackground();
    }
}

function syncSecondOfficerAndMusic(delta) {
    if (delta > 0 && state.currLevel == SECOND_OFFICER_LEVEL) {
        state.slowTheme.pause();
        state.fastTheme.play();
        show2ndPoliceman();
        return;
    }
    if (delta < 0 && state.currLevel < SECOND_OFFICER_LEVEL) {
        state.fastTheme.pause();
        state.slowTheme.play();
        hideOfficer2();
    }
}

function shouldLevelUp() {
    return (state.points >= (state.pointsAtLastLevelUp + POINTS_PER_LEVEL));
}
