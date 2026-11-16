import { state } from './state.js';
import { assetUrl } from './assets.js';
import { KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_DOWN, KEY_ENTER, MIN_SWIPE_DISTANCE } from './constants.js';
import { startPressedTimer } from './display.js';
import { resetGame } from './game.js';
import { toggleMusic, unlockAudio } from './sounds.js';

const pos = {};
let touchUpPos = {};
let introShown = false;

export function registerControls() {
    trackPressedKey();
    handleStartButton();
    handleMusicToggle();
    trackSwipes();
}

function trackPressedKey() {
    document.addEventListener('keydown', function(e) {
        state.pressedKey = e.key;
        if (e.key === KEY_ENTER && state.gameOn) resetGame();
    });
}

function handleStartButton() {
    document.getElementById('resetGame').addEventListener('click', function() {
        if (!introShown) {
            unlockAudio();
            document.getElementById('presentationImage')
                .setAttribute('src', assetUrl('img/detalhes.png'));
            introShown = true;
            return;
        }
        startPressedTimer();
        resetGame();
    });
}

function handleMusicToggle() {
    document.getElementById('musicToggle').addEventListener('click', function() {
        toggleMusic();
    });
}

function trackSwipes() {
    document.addEventListener("touchstart", function(obj) {
        if (isControlTarget(obj.target)) return;
        recordPointer(
            'down',
            {
                x: obj.touches[0].clientX,
                y: obj.touches[0].clientY
            }
        );
    });
    document.addEventListener("mousedown", function(obj) {
        if (isControlTarget(obj.target)) return;
        recordPointer('down', obj);
    });
    document.addEventListener("touchend", function(obj) {
        if (isControlTarget(obj.target)) return;
        recordPointer('up', touchUpPos);
        handleSwipe();
        touchUpPos = {};
    });
    document.addEventListener("touchmove", function(obj) {
        touchUpPos.x = obj.touches[0].clientX;
        touchUpPos.y = obj.touches[0].clientY;
    });
    document.addEventListener("mouseup", function(obj) {
        if (isControlTarget(obj.target)) return;
        recordPointer('up', obj);
        handleSwipe();
    });
}

function isControlTarget(target) {
    return target.closest('#musicToggle, #resetGame') !== null;
}

function handleSwipe() {
    const { up, down } = pos;
    if (up.x === undefined || up.y === undefined) return;
    const dx = up.x - down.x,
        dy = up.y - down.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < MIN_SWIPE_DISTANCE) return;
    if (up.time - down.time >= 500) return;
    if (Math.abs(dx) > Math.abs(dy)) {
        state.pressedKey = dx > 0 ? KEY_RIGHT : KEY_LEFT;
    } else {
        state.pressedKey = dy > 0 ? KEY_DOWN : KEY_UP;
    }
}

function recordPointer(action, obj) {
    pos[action] = {
        x: obj.x,
        y: obj.y,
        time: Date.now()
    };
}
