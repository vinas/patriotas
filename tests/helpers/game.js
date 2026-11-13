import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { vi } from 'vitest';
import { FakeAudio } from './fake-audio.js';

// Phone used for every test: portrait, 390x844, iPhone user agent.
export const PHONE = {
    width: 390,
    height: 844,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
};

// Length of one animation frame in the fake clock, and the movement scale the
// game derives from it (see gameLoop in js/game.js: elapsed / 40).
export const FRAME_MS = 16;
export const FRAME_SCALE = FRAME_MS / 40;

// Math.random value that never triggers a random molotov/bomb spawn (those need
// a roll of 10% or less) and puts the money at the middle of the map.
const NEUTRAL_RANDOM = 0.5;

const bodyHtml = new DOMParser()
    .parseFromString(readFileSync(resolve(import.meta.dirname, '../../index.html'), 'utf8'), 'text/html')
    .body.innerHTML;

let removeDocumentListeners = () => {};

/**
 * Loads the real game (index.html markup + js/ modules) in the simulated phone
 * and runs its start-up exactly as a browser would on DOMContentLoaded.
 * Call it from beforeEach; call `shutdown()` from afterEach.
 */
export async function bootGame() {
    removeDocumentListeners();
    FakeAudio.instances.length = 0;

    vi.useFakeTimers({
        toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance']
    });
    vi.spyOn(Math, 'random').mockReturnValue(NEUTRAL_RANDOM);
    vi.stubGlobal('Audio', FakeAudio);

    Object.defineProperty(window.navigator, 'userAgent', { value: PHONE.userAgent, configurable: true });
    window.innerWidth = PHONE.width;
    window.innerHeight = PHONE.height;

    document.body.innerHTML = bodyHtml;
    // jsdom has no layout engine; the game sizes the whole map from this value.
    Object.defineProperty(document.getElementById('background'), 'clientWidth', { value: PHONE.width });

    // Remember the document-level listeners the game adds so each test can drop them.
    const added = [];
    const originalAdd = document.addEventListener.bind(document);
    vi.spyOn(document, 'addEventListener').mockImplementation((type, listener, options) => {
        added.push([type, listener, options]);
        originalAdd(type, listener, options);
    });
    removeDocumentListeners = () => {
        added.forEach(([type, listener, options]) => document.removeEventListener(type, listener, options));
        added.length = 0;
    };

    vi.resetModules();
    await import('../../js/start-app.js');
    document.dispatchEvent(new Event('DOMContentLoaded'));

    // The game loop's very first frame has no previous timestamp (elapsed = 0);
    // let it pass so every frame a test advances afterwards is a normal one.
    frame();

    const { state } = await import('../../js/state.js');
    return { state, ...(await loadGameModules()) };
}

export function shutdown() {
    removeDocumentListeners();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
}

async function loadGameModules() {
    const [display, constants] = await Promise.all([
        import('../../js/display.js'),
        import('../../js/constants.js')
    ]);
    return { display, constants };
}

/** Lets `ms` of game time pass (animation frames and the 1-second game clock). */
export function advance(ms) {
    vi.advanceTimersByTime(ms);
}

/** Lets exactly one animation frame pass. */
export function frame() {
    advance(FRAME_MS);
}

export const byId = (id) => document.getElementById(id);

export const isShown = (id) => byId(id).style.display === 'block';
export const isHidden = (id) => byId(id).style.display === 'none';

/** Taps Start twice (first tap only dismisses the instructions) and returns once the game is running. */
export function startGame() {
    byId('resetGame').click();
    byId('resetGame').click();
}

/** Presses a keyboard key (e.g. 'ArrowUp'). */
export function pressKey(key) {
    document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

/** Swipes a finger from one point to another (touch events, like a phone). */
export function swipe(from, to, target = document.body) {
    const touch = (type, point) => {
        const event = new Event(type, { bubbles: true });
        Object.defineProperty(event, 'touches', { value: [{ clientX: point[0], clientY: point[1] }] });
        target.dispatchEvent(event);
    };
    touch('touchstart', from);
    touch('touchmove', to);
    target.dispatchEvent(new Event('touchend', { bubbles: true }));
}

const SWIPES = {
    up: [[200, 400], [200, 300]],
    down: [[200, 300], [200, 400]],
    left: [[300, 300], [200, 300]],
    right: [[200, 300], [300, 300]]
};

export function swipeDirection(direction) {
    swipe(...SWIPES[direction]);
}

/**
 * Makes the thief grab the money `count` times, one animation frame each
 * (the money reappears at the same spot because Math.random is pinned).
 */
export function collectMoney(game, count = 1) {
    for (let i = 0; i < count; i++) {
        game.state.thiefPosArr = [...game.state.moneyPos];
        frame();
    }
}

/** Plays up to the given level the way a player does: 5 money pickups per level. */
export function reachLevel(game, level) {
    collectMoney(game, (level - 1) * game.constants.PTSTOCHANGELEVEL - game.state.points);
}

/**
 * Shows a bomb, molotov or clock on the map at `pos`, using the game's own
 * spawn function (which normally places it at a random spot).
 */
export function spawnItem(game, kind, pos) {
    const { display, state } = game;
    display[kind]();
    state[`${kind}Pos`] = [...pos];
    display.objectAt(state[kind[0].toUpperCase() + kind.slice(1)], pos);
}

/** Spawns the item and walks the thief onto it; returns after the frame that picks it up. */
export function catchItem(game, kind, pos = [60, 250]) {
    spawnItem(game, kind, pos);
    game.state.thiefPosArr = [...pos];
    frame();
}

/**
 * Puts an officer where a test needs it. Position arrays are mutated in place by
 * the game, so always hand it a fresh one.
 */
export function placeOfficer(game, index, pos) {
    game.state.officers[index].pos = [...pos];
}
