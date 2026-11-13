import { describe, it, expect, afterEach, vi } from 'vitest';
import {
    bootGame, shutdown, assetsLoaded, startGame, advance, frame, byId, isShown,
    reachLevel, catchItem, placeOfficer
} from './helpers/game.js';
import { inMemoryUrl } from './helpers/fake-assets.js';
import { FakeAudio } from './helpers/fake-audio.js';

const NOT_PRELOADED = ['img/loader.gif', 'img/favicon.ico'];

describe('preloading the assets', () => {
    afterEach(shutdown);

    describe('while the downloads are still running', () => {
        it('shows no Start button and has created no sounds yet', async () => {
            const release = Promise.withResolvers();
            const game = await bootGame({ assets: { gate: release.promise }, waitForAssets: false });

            expect(isShown('resetGame')).toBe(false);
            expect(game.state.loadingTheme).toBeUndefined();
            expect(FakeAudio.instances).toHaveLength(0);

            release.resolve();
            await assetsLoaded();

            expect(isShown('resetGame')).toBe(true);
            expect(game.state.loadingTheme).toBeDefined();
        });

        it('survives the tab losing and regaining focus', async () => {
            const release = Promise.withResolvers();
            await bootGame({ assets: { gate: release.promise }, waitForAssets: false });

            expect(() => {
                window.dispatchEvent(new Event('blur'));
                window.dispatchEvent(new Event('focus'));
            }).not.toThrow();

            release.resolve();
            await assetsLoaded();
        });
    });

    describe('once the downloads are done', () => {
        it('builds every sound from the in-memory copy', async () => {
            await bootGame();

            expect(FakeAudio.instances).toHaveLength(7);
            FakeAudio.instances.forEach((sound) => {
                expect(sound.src).toMatch(/^blob:audio\//);
            });
        });

        it('shows the images already on the page from their in-memory copies, except the loader', async () => {
            await bootGame();

            expect(byId('presentationImage').getAttribute('src')).toBe(inMemoryUrl('img/title.png'));
            expect(byId('thief').getAttribute('src')).toBe(inMemoryUrl('img/thief_01.gif'));
            expect(byId('loading').getAttribute('src')).toBe('img/loader.gif');
        });
    });

    describe('when a file cannot be downloaded', () => {
        it('still starts, and that one file keeps its server URL', async () => {
            vi.spyOn(console, 'warn').mockImplementation(() => {});
            const game = await bootGame({ assets: { failing: ['audio/bomb.mp3', 'img/bkg_04.jpg'] } });

            expect(isShown('resetGame')).toBe(true);
            expect(game.state.bombSound.src).toBe('audio/bomb.mp3');
            expect(game.state.coinSound.src).toBe(inMemoryUrl('audio/coin1.wav'));

            startGame();
            expect(game.state.gameOn).toBe(true);
        });
    });

    describe('while playing', () => {
        it('never asks the server for anything again: levels, items, game over and restart', async () => {
            const game = await bootGame();
            const requestedAtStart = [...game.fakeFetch.requests];

            startGame();
            reachLevel(game, 4);
            catchItem(game, 'molotov');
            advance(5000);
            catchItem(game, 'bomb', [100, 300]);
            advance(3000);
            catchItem(game, 'clock', [200, 200]);
            placeOfficer(game, 0, [...game.state.thiefPos]);
            frame();
            expect(game.state.gameOn).toBe(false);
            startGame();
            expect(game.state.gameOn).toBe(true);

            expect(game.fakeFetch.requests).toEqual(requestedAtStart);
            document.querySelectorAll('img[src]').forEach((img) => {
                const src = img.getAttribute('src');
                expect(NOT_PRELOADED.includes(src) || src.startsWith('blob:')).toBe(true);
            });
        });
    });
});
