import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { bootGame, shutdown, startGame, pressKey, advance, byId } from './helpers/game.js';

describe('sprite positions on the page', () => {
    let game;

    beforeEach(async () => {
        game = await bootGame();
        startGame();
    });
    afterEach(shutdown);

    it('are written with px units', () => {
        game.display.objectAt(byId('thief'), [12.5, 30]);

        expect(byId('thief').style.left).toBe('12.5px');
        expect(byId('thief').style.top).toBe('30px');
    });

    it('the thief on the page follows the thief in the game', () => {
        game.state.thiefPos = [100, 100];
        pressKey('ArrowRight');
        advance(200);

        expect(game.state.thiefPos[0]).toBeGreaterThan(100);
        expect(parseFloat(byId('thief').style.left)).toBeCloseTo(game.state.thiefPos[0], 5);
        expect(parseFloat(byId('thief').style.top)).toBeCloseTo(game.state.thiefPos[1], 5);
    });
});
