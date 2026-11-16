import { state } from './state.js';
import { preloadAssets, useLoadedImages, assetUrl } from './assets.js';
import { START_TIME, THIEF_MOVE_RATE } from './constants.js';
import { scaleToMap } from './geometry.js';
import { showStartButton, showLoadProgress } from './display.js';
import { changePoliceMoveRate } from './motion.js';
import { isTwoPolicemenLevel } from './officer-ai.js';
import { applyMusicVolume } from './sounds.js';

export function isMobilePortrait() {
    const ua = navigator.userAgent || '';
    const isMobile = /Android|iPhone|iPad|iPod|Mobile|Silk|Kindle|BlackBerry|Opera Mini|IEMobile/i.test(ua)
        || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1); // iPadOS reports as a Mac
    return isMobile && isPortrait();
}

function isPortrait() {
    return window.innerWidth <= window.innerHeight;
}

// Downloads every image and sound into memory, then shows the Start button.
export async function loadAssets() {
    await preloadAssets(showLoadProgress);
    useLoadedImages();
    createSounds();
    showStartButton();
}

function createSounds() {
    state.fastTheme = new Audio(assetUrl('audio/8bit_sparks.mp3'));
    state.slowTheme = new Audio(assetUrl('audio/hino_nacional.mp3'));
    state.endGameSound = new Audio(assetUrl('audio/endGame.mp3'));
    state.loadingTheme = new Audio(assetUrl('audio/hino_independencia.mp3'));
    state.bombSound = new Audio(assetUrl('audio/bomb.mp3'));
    state.clockSound = new Audio(assetUrl('audio/crank-1.mp3'));
    state.coinSound = new Audio(assetUrl('audio/coin1.mp3'));
}

export function cacheDomElements() {
    setCharacters();
    setGameItems();
    setDisplayItems();
}

export function clearGameValues() {
    state.time = 0;
    state.isClockVisible = false;
    state.isMolotovVisible = false;
    state.isBombVisible = false;
    state.isBombThrown = false;
    state.isMolotovThrown = false;
    state.currLevel = 1;
    state.points = 0;
    state.molotovTime = 0;
}

export function resetAllValues() {
    clearGameValues();
    setOfficersStartCoords();
    state.time = START_TIME;
    state.pressedKey = false;
    state.thiefMoveRate = scaleToMap(THIEF_MOVE_RATE);
    changePoliceMoveRate();
    state.thiefPos[0] = 0;
    state.thiefPos[1] = 0;
    state.pointsAtLastLevelUp = 0;
}

export function installFocusHandlers() {
    window.addEventListener('blur', function() {
        [state.fastTheme, state.slowTheme, state.loadingTheme, state.endGameSound].forEach(function(sound) {
            sound.pause();
        });
    });

    window.addEventListener('focus', function() {
        const levelTheme = isTwoPolicemenLevel() ? state.fastTheme : state.slowTheme;
        const theme = state.gameOn ? levelTheme : state.loadingTheme;
        theme.play().catch(function() {});
        applyMusicVolume();
    });
}

function setCharacters() {
    state.thiefEl = document.getElementById('thief');
    state.officers[0].element = document.getElementById('officer1');
    state.officers[1].element = document.getElementById('officer2');
}

function setGameItems() {
    state.molotovEl = document.getElementById('molotov');
    state.clockEl = document.getElementById('clock');
    state.bombEl = document.getElementById('bomb');
    state.officers[0].counter = document.getElementById('counter1');
    state.officers[1].counter = document.getElementById('counter2');
}

function setDisplayItems() {
    state.backgroundEl = document.getElementById('backgroundImage');
    state.levelEl = document.getElementById('level');
    state.timeEl = document.getElementById('time');
}

function setOfficersStartCoords()
{
    const coord = state.mapSize - state.charSize;
    state.officers[0].pos[0] = coord;
    state.officers[0].pos[1] = coord;
    state.officers[1].pos[0] = coord;
    state.officers[1].pos[1] = coord;
}
