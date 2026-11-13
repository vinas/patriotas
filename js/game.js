import { state } from './state.js';
import { POINTS_PER_MONEY, BASE_FRAME_MS, MAX_FRAME_SCALE, LOW_TIME_WARNING, CLOCK_APPEARS_AT, SECOND_OFFICER_LEVEL, POINTS_PER_LEVEL } from './constants.js';
import { setVisualElements, installFocusHandlers, resetAllValues, loadContent, clearGameValues } from './setup.js';
import { resizeMapAndItems } from './resizer.js';
import { loadControlsHandlers } from './controls.js';
import {
    hideGameValues, startButton, hideInGameElements, relocateCharacters, showInGameElements,
    money, gameInfo, updatePointsDisplay, flash, clock, restorePolicemen, molotov, hideMolotov,
    molotovCounter, updateDifficultyDisplay, setNewBackground, show2ndPoliceman, hideOfficer2,
    timeUp, bomb, hideBomb
} from './display.js';
import { moveItAll, changePoliceMoveRate } from './motion.js';
import { checkGotItem, checkGotBusted } from './events.js';
import { sortBombAppears, sortBombVanishes, sortMolotov } from './spawn-chance.js';

let lastFrameTime;

export function init() {
    setVisualElements();
    resizeMapAndItems();
    installFocusHandlers();
    loadControlsHandlers();
    loadContent();
    requestAnimationFrame(gameLoop);
    gameClock();
}

// showEndScreen is the display function for the way the game ended (busted or timeUp).
export function endGame(showEndScreen) {
    state.gameOn = false;
    state.fastTheme.pause();
    state.slowTheme.pause();
    state.endGameSound.currentTime = 0;
    state.endGameSound.play();
    showEndScreen();
    hideGameValues();
    startButton();
    clearGameValues();
}

export function resetGame() {
    resetAllValues();
    hideInGameElements();
    relocateCharacters();
    showInGameElements();
    money();
    gameInfo();
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
    handleTwoPolicemenTransition(delta);
}

/**** PRIVATE METHODS ****/

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
            endGame(timeUp);
            return;
        }
        state.Time.innerHTML = state.time
        if (state.time <= LOW_TIME_WARNING) flash(state.Time);
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
        clock();
    }
}

function handleMolotov() {
    handleMolotovDisplay();
    handleMolotovTime();
    if (state.molotovTime == 0) restorePolicemen();
}

function handleMolotovDisplay() {
    if (sortMolotov()) {
        if (state.isMolotovVisible) {
            hideMolotov();
        } else {
            molotov();
        }
    }
}

function handleMolotovTime() {
    if (state.molotovTime > 1) {
        state.molotovTime = state.molotovTime - 1;
        molotovCounter();
        return;
    }
    state.molotovTime = 0;
}

function handleBombDisplay() {
    if (state.currLevel > 1) {
        if (sortBombAppears()) bomb();
        else if (sortBombVanishes()) hideBomb();
    }
}

function handleLevelChange() {
    if (isLevelChange()) {
        state.lastChangedLevel = state.points;
        changeLevel(1);
        updateDifficultyDisplay();
        setNewBackground();
    }
}

function handleTwoPolicemenTransition(delta) {
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

function isLevelChange() {
    return (state.points >= (state.lastChangedLevel + POINTS_PER_LEVEL));
}
