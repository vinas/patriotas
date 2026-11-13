import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { bootGame, shutdown, startGame, byId, reachLevel } from './helpers/game.js';

describe('background', () => {
    let game;

    beforeEach(async () => {
        game = await bootGame();
        startGame();
    });
    afterEach(shutdown);

    const background = () => byId('backgroundImage').getAttribute('src');

    // Math.random is pinned to 0.5 by the test harness, which would pick bkg_07.jpg
    // out of the 13 backgrounds. Make that the one already on screen.
    it('changes to a different image on level up', () => {
        game.state.currentBackground = 'img/bkg_07.jpg';

        reachLevel(game, 2);

        const shown = game.state.currentBackground;
        expect(game.state.currLevel).toBe(2);
        expect(shown).not.toBe('img/bkg_07.jpg');
        expect(shown).toMatch(/^img\/(bkg_\d\d|background_v2)\.jpg$/);
        expect(background()).toContain(shown);
    });
});
