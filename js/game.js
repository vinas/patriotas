import { state } from './state.js';
import { POINTUNITY, STANDGAMEREFRESHRATE, MAX_FRAME_SCALE, DISPLAYCLOCKAT, TWOPOLICEMENLEVEL, PTSTOCHANGELEVEL } from './constants.js';
import { setVisualElements, setAll, resetAllValues, loadContent, clearGameValues } from './setup.js';
import { resizeMapAndItems } from './resizer.js';
import { loadControlsHandlers } from './controls.js';
import {
    hideGameValues, startButton, hideInGameElements, relocateCharacters, showInGameElements,
    money, gameInfo, updatePointsDisplay, flash, clock, restorePolicemen, molotov, hideMolotov,
    molotovCounter, updateDifficultyDisplay, setNewBackground, show2ndPoliceman, hideOfficer2,
    busted, timeUp, bomb, hideBomb
} from './display.js';
import { moveItAll, changePoliceMoveRate } from './motion.js';
import { checkGotItem, checkGotBusted } from './events.js';
import { sortBomb, sortMolotov } from './spawn-chance.js';
import { formattedDateTime } from './date-utils.js';

let lastFrameTime;

const endGameActions = { busted, timeUp };
const bombActions = { bomb, hideBomb };

export function init() {
    setVisualElements();
    resizeMapAndItems();
    setAll();
    loadControlsHandlers();
    loadContent();
    requestAnimationFrame(gameLoop);
    gameClock();
}

export function endGame(reason) {
    state.gameOn = false;
    state.fastTheme.pause();
    state.slowTheme.pause();
    saveGameScores();
    state.endGameSound.currentTime = 0;
    state.endGameSound.play();
    endGameActions[reason]();
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
    state.fastTheme.currentTime = 0;
    state.slowTheme.currentTime = 0;
    state.loadingTheme.currentTime = 18;
    state.slowTheme.play();
    state.gameOn = true;
}

export function scorePoints() {
    state.points = state.points + POINTUNITY;
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
        const scale = Math.min(elapsed / STANDGAMEREFRESHRATE, MAX_FRAME_SCALE);
        moveItAll(scale);
        checkGotItem();
        checkGotBusted();
    }
    requestAnimationFrame(gameLoop);
}

function gameClock() {
    if (state.gameOn) {
        if (state.time < 0) {
            endGame("timeUp");
            return;
        }
        state.Time.innerHTML = state.time
        if (state.time <= 3) flash(state.Time);
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
    if ((state.time == DISPLAYCLOCKAT) && (!state.isClockVisible)) {
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
        if (!state.isMolotovVisible) {
            molotov();
            return ;
        }
        hideMolotov();
        return;
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
        const action = sortBomb();
        if (action)
            bombActions[action]();
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
    if (delta > 0 && state.currLevel == TWOPOLICEMENLEVEL) {
        state.slowTheme.pause();
        state.fastTheme.play();
        show2ndPoliceman();
        return;
    }
    if (delta < 0 && state.currLevel < TWOPOLICEMENLEVEL) {
        state.fastTheme.pause();
        state.slowTheme.play();
        hideOfficer2();
    }
}

function saveGameScores() {
    state.user.lastScore = state.points;
    state.user.lastScoreDateTime = formattedDateTime();
    state.user.gameId = 1;
    //$.post('/api/Games/saveLastScore', user);
}

function isLevelChange() {
    return ((state.points != 0) && (state.points >= (state.lastChangedLevel + PTSTOCHANGELEVEL)));
}
