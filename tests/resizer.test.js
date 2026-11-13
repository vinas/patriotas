import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { bootGame, shutdown } from './helpers/game.js';

describe('map scaling', () => {
    let game;

    beforeEach(async () => {
        game = await bootGame();
    });
    afterEach(shutdown);

    it('scales the sizes from the 500px baseline to the phone width', () => {
        expect(game.state.mapSize).toBe(390);
        expect(game.state.charSize).toBe(58); // floor(75 * 390 / 500)
        expect(game.state.itemSize).toBe(42); // floor(55 * 390 / 500)
    });

    it('measuring again does not scale the sizes a second time', async () => {
        const { resizeMapAndItems } = await import('../js/resizer.js');
        const before = {
            charSize: game.state.charSize,
            itemSize: game.state.itemSize,
            catchTolerance: game.state.catchTolerance,
            crossBorderTolerance: game.state.crossBorderTolerance,
            throwSpeed: game.state.throwSpeed
        };

        resizeMapAndItems();

        expect(game.state).toMatchObject(before);
    });
});
