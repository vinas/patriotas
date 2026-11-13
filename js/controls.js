import { state } from './state.js';
import { KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_DOWN, KEY_ENTER, MIN_SWIPE_DISTANCE } from './constants.js';
import { startPressedTimer } from './display.js';
import { resetGame } from './game.js';
import { toggleMusic, handleSounds } from './sounds.js';

const pos = {};
let touchUpPos = {};
let introShown = false;

export function loadControlsHandlers() {
    handlePressedKey();
    handleResetButton();
    handleMusicToggle();
    handleControlSwipes();
}

function handlePressedKey() {
    document.addEventListener('keydown', function(e) {
        state.pressedKey = e.key;
        if (e.key === KEY_ENTER && state.gameOn) resetGame();
    });
}

function handleResetButton() {
    document.getElementById('resetGame').addEventListener('click', function() {
        if (!introShown) {
            handleSounds();
            document.getElementById('presentationImage')
                .setAttribute('src', 'img/detalhes.png');
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

function handleControlSwipes() {
    document.addEventListener("touchstart", function(obj) {
        if (isControlTarget(obj.target)) return;
        fingerHandler(
            'down',
            {
                x: obj.touches[0].clientX,
                y: obj.touches[0].clientY
            }
        );
    });
    document.addEventListener("mousedown", function(obj) {
        if (isControlTarget(obj.target)) return;
        fingerHandler('down', obj);
    });
    document.addEventListener("touchend", function(obj) {
        if (isControlTarget(obj.target)) return;
        fingerHandler('up', touchUpPos, handleSwipe);
        touchUpPos = {};
    });
    document.addEventListener("touchmove", function(obj) {
        touchUpPos.x = obj.touches[0].clientX;
        touchUpPos.y = obj.touches[0].clientY;
    });
    document.addEventListener("mouseup", function(obj) {
        if (isControlTarget(obj.target)) return;
        fingerHandler('up', obj, handleSwipe);
    });

}

function isControlTarget(target) {
    return target.closest('#musicToggle, #resetGame') !== null;
}

function handleSwipe() {
    if (pos.up.x === undefined || pos.up.y === undefined) return;
    if (Math.max(Math.abs(pos.up.x - pos.down.x), Math.abs(pos.up.y - pos.down.y)) < MIN_SWIPE_DISTANCE) return;
    if (pos.up.time - pos.down.time < 500) {
        if (Math.abs(pos.up.x - pos.down.x) > Math.abs(pos.up.y - pos.down.y)) {
            if (pos.up.x > pos.down.x) {
                // console.log('identified: right');
                state.pressedKey = KEY_RIGHT;
            } else {
                // console.log('identified: left');
                state.pressedKey = KEY_LEFT;
            }
        } else {
            if (pos.up.y > pos.down.y) {
                // console.log('identified: down');
                state.pressedKey = KEY_DOWN;
            } else {
                // console.log('identified: up');
                state.pressedKey = KEY_UP;
            }
        }

    }
}

function fingerHandler(action, obj, callback) {
    const x = obj.x;
    const y = obj.y;
    pos[action] = {
        x: x,
        y: y,
        time: Date.now()
    };
    if (callback) callback();
}
