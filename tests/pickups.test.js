import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
    bootGame, shutdown, startGame, advance, frame, byId,
    reachLevel, catchItem, placeOfficer
} from './helpers/game.js';

const OFFICERS = [0, 1];
// A spot well away from the money (map centre) and from the officers' corner.
const CLOCK_SPOT = [300, 60];

describe('bomb', () => {
    let game;

    beforeEach(async () => {
        game = await bootGame();
        startGame();
    });
    afterEach(shutdown);

    it('does not lower the level when the level is 1', () => {
        catchItem(game, 'bomb');
        advance(2000);

        expect(game.state.currLevel).toBe(1);
    });

    it('lowers the level when it is above 1', () => {
        reachLevel(game, 3);

        catchItem(game, 'bomb');
        advance(2000);

        expect(game.state.currLevel).toBeLessThan(3);
        expect(byId('level').innerHTML).toBe(String(game.state.currLevel));
    });

    // Currently fails: the thrown bomb keeps overlapping the thief for several
    // frames and gotBomb() lowers the level on every one of them (level 3 -> 1).
    it('lowers the level by exactly one per bomb', () => {
        reachLevel(game, 3);

        catchItem(game, 'bomb');
        advance(2000);

        expect(game.state.currLevel).toBe(2);
    });

    it('disappears from the map once it has been thrown', () => {
        reachLevel(game, 2);

        catchItem(game, 'bomb');
        advance(2000);

        expect(game.state.isBombVisible).toBe(false);
    });
});

describe('molotov', () => {
    let game;

    beforeEach(async () => {
        game = await bootGame();
        startGame();
    });
    afterEach(shutdown);

    const sprite = (index) => byId(`officer${index + 1}`).getAttribute('src');
    const isBurning = (index) => sprite(index).includes('fogo');
    const positions = () => OFFICERS.map((i) => [...game.state.officers[i].pos]);

    it('sets the officer on fire when the thief catches it (level 1: only officer 0 is on the map)', () => {
        expect(isBurning(0)).toBe(false);

        catchItem(game, 'molotov');
        advance(1000);

        expect(isBurning(0)).toBe(true);
        expect(isBurning(1)).toBe(false);
        expect(game.state.isMolotovVisible).toBe(false);
    });

    it('is thrown only once per catch', () => {
        const before = game.state.bombSound.playCount;

        catchItem(game, 'molotov');
        advance(3000);

        expect(game.state.bombSound.playCount - before).toBe(1);
    });

    it('sets both officers on fire when officer 1 is on the map too', () => {
        reachLevel(game, 3);

        catchItem(game, 'molotov');
        advance(1000);

        expect(isBurning(0)).toBe(true);
        expect(isBurning(1)).toBe(true);
    });

    it('makes the officers stand still for 3 seconds, then they chase again', () => {
        reachLevel(game, 3);
        game.state.thiefPosArr = [60, 250];
        catchItem(game, 'molotov');
        const frozenAt = positions();

        advance(2990);
        expect(positions()).toEqual(frozenAt);

        advance(1110); // freeze lasts between 3 and 4 seconds depending on the game clock tick
        expect(positions()).not.toEqual(frozenAt);
        expect(game.state.officers[0].pos).not.toEqual(frozenAt[0]);
        expect(game.state.officers[1].pos).not.toEqual(frozenAt[1]);
        expect(isBurning(0)).toBe(false);
        expect(isBurning(1)).toBe(false);
    });

    it('stops officers from catching the thief for 3 seconds', () => {
        placeOfficer(game, 0, [70, 260]); // right on top of the thief's spot
        catchItem(game, 'molotov', [60, 250]);

        advance(2990);
        expect(game.state.gameOn).toBe(true);

        advance(1110);
        expect(game.state.gameOn).toBe(false);
        expect(byId('busted').style.display).toBe('block');
    });
});

describe('clock', () => {
    let game;

    beforeEach(async () => {
        game = await bootGame();
        startGame();
    });
    afterEach(shutdown);

    it('adds 10 seconds when the thief catches it', () => {
        const before = game.state.time;

        catchItem(game, 'clock', CLOCK_SPOT);

        expect(game.state.time).toBe(before + 10);
    });

    it('is only worth 10 seconds once, then leaves the map', () => {
        const before = game.state.time;

        catchItem(game, 'clock', CLOCK_SPOT);
        advance(500);

        expect(game.state.time).toBe(before + 10);
        expect(game.state.isClockVisible).toBe(false);
    });

    it('does nothing when the thief is not on it', () => {
        const before = game.state.time;
        game.state.thiefPosArr = [0, 0];

        // spawn it far from the thief without walking onto it
        game.display.clock();
        game.state.clockPos = [300, 300];
        frame();

        expect(game.state.time).toBe(before);
        expect(game.state.isClockVisible).toBe(true);
    });
});
