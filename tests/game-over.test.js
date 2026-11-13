import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { bootGame, shutdown, startGame, advance, frame, byId, isShown, reachLevel, placeOfficer } from './helpers/game.js';

const THIEF = [60, 250];

// Everything a player sees when a round ends.
const expectRoundEnded = (game) => {
    expect(game.state.gameOn).toBe(false);
    expect(isShown('resetGame')).toBe(true);
    expect(game.state.endGameSound.paused).toBe(false);
    expect(game.state.slowTheme.paused).toBe(true);
    expect(game.state.fastTheme.paused).toBe(true);
};

describe('game over: caught by an officer', () => {
    let game;

    beforeEach(async () => {
        game = await bootGame();
        startGame();
        game.state.thiefPos = [...THIEF];
    });
    afterEach(shutdown);

    it('is not over while the officers are still far away', () => {
        advance(1000);

        expect(game.state.gameOn).toBe(true);
    });

    it('is over when officer 0 reaches the thief', () => {
        placeOfficer(game, 0, [THIEF[0] + 10, THIEF[1] + 10]);

        frame();

        expectRoundEnded(game);
        expect(byId('busted').style.display).toBe('block');
        expect(byId('timeUp').style.display).not.toBe('block');
    });

    it('is over when officer 0 chases down a thief that stays put', () => {
        advance(14000);

        expectRoundEnded(game);
        expect(byId('busted').style.display).toBe('block');
    });

    it('is over when officer 1 reaches the thief', () => {
        reachLevel(game, 3);
        game.state.thiefPos = [...THIEF];
        placeOfficer(game, 0, [330, 330]); // officer 0 far away: only officer 1 can have caught the thief
        placeOfficer(game, 1, [THIEF[0] + 10, THIEF[1] + 10]);

        frame();

        expectRoundEnded(game);
        expect(byId('busted').style.display).toBe('block');
    });

    it('is not over for an officer 1 that is not on the map yet (level below 3)', () => {
        reachLevel(game, 2);
        game.state.thiefPos = [...THIEF];
        placeOfficer(game, 0, [330, 330]);
        placeOfficer(game, 1, [THIEF[0] + 10, THIEF[1] + 10]);

        frame();

        expect(game.state.gameOn).toBe(true);
    });

    it('shows one of the busted messages', () => {
        placeOfficer(game, 0, [THIEF[0] + 10, THIEF[1] + 10]);

        frame();

        expect(byId('endGameMessage').innerHTML.length).toBeGreaterThan(0);
        expect(byId('endGameMessage').innerHTML).not.toContain('{user}');
    });

    it('lets the player start a new round afterwards', () => {
        placeOfficer(game, 0, [THIEF[0] + 10, THIEF[1] + 10]);
        frame();
        expect(game.state.gameOn).toBe(false);

        byId('resetGame').click();

        expect(game.state.gameOn).toBe(true);
        expect(game.state.currLevel).toBe(1);
        expect(game.state.points).toBe(0);
        expect(byId('busted').style.display).toBe('none');
    });
});

describe('game over: time is up', () => {
    let game;

    beforeEach(async () => {
        game = await bootGame();
        startGame();
    });
    afterEach(shutdown);

    it('is not over while there is time left', () => {
        game.state.time = 3;

        advance(2000);

        expect(game.state.gameOn).toBe(true);
    });

    it('is over when the time runs out', () => {
        // keep the thief far from the officers so only the clock can end the round
        game.state.time = 2;

        advance(5000);

        expectRoundEnded(game);
        expect(byId('timeUp').style.display).toBe('block');
        expect(byId('busted').style.display).not.toBe('block');
    });

    it('runs out after the starting time when the player collects nothing', () => {
        const { state } = game;
        // officers need ~11s to walk down a motionless thief, so freeze them to isolate the clock
        state.officers[0].moveRate = 0;

        advance(18000);
        expect(state.gameOn).toBe(true);

        advance(5000);
        expect(state.gameOn).toBe(false);
        expect(byId('timeUp').style.display).toBe('block');
    });
});
