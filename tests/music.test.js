import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { bootGame, shutdown, startGame, byId, swipe, reachLevel, pressKey, frame } from './helpers/game.js';

const themes = (state) => [state.slowTheme, state.fastTheme, state.loadingTheme];

describe('music', () => {
    let game;

    beforeEach(async () => {
        game = await bootGame();
        startGame();
    });
    afterEach(shutdown);

    it('plays at full volume by default', () => {
        expect(game.state.musicMuted).toBe(false);
        themes(game.state).forEach((theme) => expect(theme.volume).toBe(1));
        expect(byId('musicToggle').classList.contains('muted')).toBe(false);
    });

    it('can be muted', () => {
        byId('musicToggle').click();

        expect(game.state.musicMuted).toBe(true);
        themes(game.state).forEach((theme) => expect(theme.volume).toBe(0));
        expect(byId('musicToggle').classList.contains('muted')).toBe(true);
    });

    it('can be unmuted', () => {
        byId('musicToggle').click();
        byId('musicToggle').click();

        expect(game.state.musicMuted).toBe(false);
        themes(game.state).forEach((theme) => expect(theme.volume).toBe(1));
        expect(byId('musicToggle').classList.contains('muted')).toBe(false);
    });

    it('keeps the game going while muting and unmuting', () => {
        byId('musicToggle').click();
        byId('musicToggle').click();

        expect(game.state.gameOn).toBe(true);
    });

    it('does not make the thief move when the toggle is touched (regression)', () => {
        // a finger sliding over the button must not be read as a swipe
        swipe([300, 450], [300, 350], byId('musicToggle'));
        byId('musicToggle').click();

        expect(game.state.pressedKey).toBe(false);
    });

    describe('when the player leaves the tab and comes back', () => {
        const leaveAndReturn = () => {
            window.dispatchEvent(new Event('blur'));
            window.dispatchEvent(new Event('focus'));
        };

        it('pauses all music while the tab is not focused', () => {
            window.dispatchEvent(new Event('blur'));

            themes(game.state).forEach((theme) => expect(theme.paused).toBe(true));
        });

        it('resumes the slow theme at level 1', () => {
            leaveAndReturn();

            expect(game.state.slowTheme.paused).toBe(false);
            expect(game.state.fastTheme.paused).toBe(true);
        });

        it('resumes the fast theme once the second officer is on the map', () => {
            reachLevel(game, 3);
            expect(game.state.fastTheme.paused).toBe(false);

            leaveAndReturn();

            expect(game.state.fastTheme.paused).toBe(false);
            expect(game.state.slowTheme.paused).toBe(true);
        });
    });

    it('restarting with Enter at a high level leaves only the slow theme playing', () => {
        reachLevel(game, 3);
        expect(game.state.fastTheme.paused).toBe(false);

        pressKey('Enter');
        frame();

        expect(game.state.currLevel).toBe(1);
        expect(game.state.fastTheme.paused).toBe(true);
        expect(game.state.slowTheme.paused).toBe(false);
    });
});
