import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { bootGame, shutdown, startGame, advance, byId, isShown, isHidden } from './helpers/game.js';

describe('the game starts', () => {
    let game;

    beforeEach(async () => { game = await bootGame(); });
    afterEach(shutdown);

    it('boots on a phone showing only the Start button, with no game running', () => {
        expect(game.state.gameOn).toBe(false);
        expect(isShown('resetGame')).toBe(true);
        expect(isHidden('musicToggle')).toBe(true);
        expect(isHidden('loading')).toBe(true);
    });

    it('first tap on Start only dismisses the instructions', () => {
        byId('resetGame').click();

        expect(game.state.gameOn).toBe(false);
        expect(byId('presentationImage').getAttribute('src')).toBe('img/detalhes.png');
    });

    it('second tap on Start begins a round: level 1, 0 points, thief and officer 0 on the map', () => {
        startGame();
        const { state } = game;

        expect(state.gameOn).toBe(true);
        expect(state.currLevel).toBe(1);
        expect(state.points).toBe(0);
        expect(state.time).toBe(20);
        expect(byId('level').innerHTML).toBe('1');
        expect(byId('points').innerHTML).toBe('0');
        expect(isShown('thief')).toBe(true);
        expect(isShown('officer1')).toBe(true);
        expect(isHidden('officer2')).toBe(true);
        expect(isShown('money')).toBe(true);
        expect(isShown('musicToggle')).toBe(true);
        expect(isHidden('resetGame')).toBe(true);
        expect(state.slowTheme.paused).toBe(false);
    });

    it('the countdown runs once the game is on', () => {
        startGame();
        const timeAtStart = game.state.time;

        advance(3000);

        expect(game.state.time).toBeLessThanOrEqual(timeAtStart - 2);
        expect(game.state.gameOn).toBe(true);
    });
});
