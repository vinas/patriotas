import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { bootGame, shutdown, startGame, advance, isShown, isHidden, reachLevel, catchItem } from './helpers/game.js';

describe('the second officer (officer 1)', () => {
    let game;

    beforeEach(async () => {
        game = await bootGame();
        startGame();
    });
    afterEach(shutdown);

    it('is not on the map at level 1', () => {
        expect(game.state.currLevel).toBe(1);
        expect(isHidden('officer2')).toBe(true);
    });

    it('is still not on the map at level 2', () => {
        reachLevel(game, 2);

        expect(game.state.currLevel).toBe(2);
        expect(isHidden('officer2')).toBe(true);
    });

    it('appears when the player reaches level 3', () => {
        reachLevel(game, 2);
        expect(isHidden('officer2')).toBe(true);

        reachLevel(game, 3);

        expect(game.state.currLevel).toBe(3);
        expect(isShown('officer2')).toBe(true);
    });

    it('switches to the faster theme when it appears', () => {
        reachLevel(game, 3);

        expect(game.state.slowTheme.paused).toBe(true);
        expect(game.state.fastTheme.paused).toBe(false);
    });

    it('stays on the map at higher levels', () => {
        reachLevel(game, 4);

        expect(game.state.currLevel).toBe(4);
        expect(isShown('officer2')).toBe(true);
    });

    it('disappears when a bomb takes the level back below 3', () => {
        reachLevel(game, 3);
        expect(isShown('officer2')).toBe(true);

        catchItem(game, 'bomb');
        advance(2000);

        expect(game.state.currLevel).toBeLessThan(3);
        expect(isHidden('officer2')).toBe(true);
    });

    it('is on the map exactly while the level is 3 or more, as bombs bring the level down from 4', () => {
        reachLevel(game, 4);

        for (let bombs = 0; bombs < 10 && game.state.currLevel > 1; bombs++) {
            catchItem(game, 'bomb');
            advance(2000);

            expect(isShown('officer2')).toBe(game.state.currLevel >= 3);
        }
        expect(isHidden('officer2')).toBe(true);
    });

    it('switches back to the slow theme when it disappears', () => {
        reachLevel(game, 3);

        catchItem(game, 'bomb');
        advance(2000);

        expect(game.state.fastTheme.paused).toBe(true);
        expect(game.state.slowTheme.paused).toBe(false);
    });
});
