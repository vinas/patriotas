import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
    bootGame, shutdown, startGame, advance, frame, FRAME_SCALE,
    reachLevel, placeOfficer, catchItem
} from './helpers/game.js';

describe('officer 0 chase behaviour', () => {
    let game;

    beforeEach(async () => {
        game = await bootGame();
        startGame();
    });
    afterEach(shutdown);

    // Thief stays still at `thief`; officer 0 starts at `officer`. After 10 frames
    // only the expected coordinate may have moved, in the expected direction.
    it.each([
        ['left', [300, 200], [50, 180], 0, -1],
        ['right', [50, 200], [300, 180], 0, 1],
        ['up', [200, 300], [190, 40], 1, -1],
        ['down', [200, 50], [190, 300], 1, 1]
    ])('moves %s when the thief is much further away on that axis', (_, officer, thief, axis, sign) => {
        game.state.thiefPos = [...thief];
        placeOfficer(game, 0, officer);

        advance(160);

        const pos = game.state.officers[0].pos;
        expect((pos[axis] - officer[axis]) * sign).toBeGreaterThan(0);
        expect(pos[1 - axis]).toBe(officer[1 - axis]);
    });

    it('keeps closing the biggest gap first before touching the smaller one', () => {
        game.state.thiefPos = [100, 250];
        placeOfficer(game, 0, [300, 300]); // gap: 200 horizontal, 50 vertical

        advance(2000);

        const [x, y] = game.state.officers[0].pos;
        expect(x).toBeLessThan(300);
        expect(x - 100).toBeGreaterThan(50); // horizontal gap still the bigger one
        expect(y).toBe(300);
    });

    it('moves at the speed given for the current level', () => {
        game.state.thiefPos = [100, 150];
        placeOfficer(game, 0, [300, 300]);
        const before = [...game.state.officers[0].pos];

        frame();

        const moved = Math.abs(game.state.officers[0].pos[0] - before[0]) + Math.abs(game.state.officers[0].pos[1] - before[1]);
        expect(moved).toBeCloseTo(game.state.officers[0].moveRate * FRAME_SCALE, 5);
        expect(moved).toBeGreaterThan(0);
    });
});

function collectToNextLevel(game) {
    reachLevel(game, game.state.currLevel + 1);
}

// How far an officer travels per unit of game time, measured by watching it move.
function measuredSpeed(game, index) {
    const { state } = game;
    state.thiefPos = [100, 150];
    placeOfficer(game, 0, [300, 300]);
    placeOfficer(game, 1, [300, 300]);
    const before = [...state.officers[index].pos];

    frame();

    const after = state.officers[index].pos;
    return (Math.abs(after[0] - before[0]) + Math.abs(after[1] - before[1])) / FRAME_SCALE;
}

describe('officer speed as the player levels up', () => {
    let game;

    beforeEach(async () => {
        game = await bootGame();
        startGame();
    });
    afterEach(shutdown);

    it.each([1, 2, 3, 4, 5, 6])('officer 0 moves at the speed table rate at level %i', (level) => {
        reachLevel(game, level);

        expect(game.state.currLevel).toBe(level);
        expect(measuredSpeed(game, 0)).toBeCloseTo(game.state.speedTable[level][0], 5);
    });

    // Currently fails on a 390px-wide phone: the speed table adds scaleToMap(1)
    // for level 2, and that rounds down to 0 below 500px, so level 1 and 2 are equally fast.
    it('officer 0 is faster at level 2 than at level 1', () => {
        const level1 = measuredSpeed(game, 0);
        reachLevel(game, 2);
        const level2 = measuredSpeed(game, 0);

        expect(level2).toBeGreaterThan(level1);
    });

    it('officer 0 gets faster at level 3 and again at level 4', () => {
        reachLevel(game, 2);
        const level2 = measuredSpeed(game, 0);
        collectToNextLevel(game);
        const level3 = measuredSpeed(game, 0);
        collectToNextLevel(game);
        const level4 = measuredSpeed(game, 0);

        expect(level3).toBeGreaterThan(level2);
        expect(level4).toBeGreaterThan(level3);
    });

    it('officer 0 never slows down while the player levels up', () => {
        const speeds = [measuredSpeed(game, 0)];
        for (let level = 2; level <= 8; level++) {
            collectToNextLevel(game);
            speeds.push(measuredSpeed(game, 0));
        }

        speeds.forEach((speed, i) => {
            if (i > 0) expect(speed).toBeGreaterThanOrEqual(speeds[i - 1]);
        });
        expect(speeds.at(-1)).toBeGreaterThan(speeds[0]);
    });
});

describe('officer speed when the level goes down', () => {
    let game;

    beforeEach(async () => {
        game = await bootGame();
        startGame();
    });
    afterEach(shutdown);

    it('both officers get slower when a bomb brings the level down from 3', () => {
        reachLevel(game, 3);
        expect(game.state.currLevel).toBe(3);
        const before = [measuredSpeed(game, 0), measuredSpeed(game, 1)];

        catchItem(game, 'bomb');
        advance(2000);

        expect(game.state.currLevel).toBeLessThan(3);
        const after = [measuredSpeed(game, 0), measuredSpeed(game, 1)];
        expect(after[0]).toBeLessThan(before[0]);
        expect(after[1]).toBeLessThan(before[1]);
    });

    it('speeds match the speed table for the level the player ends up on', () => {
        reachLevel(game, 4);

        catchItem(game, 'bomb');
        advance(2000);

        const level = game.state.currLevel;
        expect(level).toBeLessThan(4);
        expect(measuredSpeed(game, 0)).toBeCloseTo(game.state.speedTable[level][0], 5);
        expect(measuredSpeed(game, 1)).toBeCloseTo(game.state.speedTable[level][1], 5);
    });
});
