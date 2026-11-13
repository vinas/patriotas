import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { installFakeAssets, removeFakeAssets, inMemoryUrl } from './helpers/fake-assets.js';

const root = resolve(import.meta.dirname, '..');

describe('asset preloading', () => {
    let assets;
    let fakeFetch;

    async function loadAssetsModule(options) {
        vi.resetModules();
        fakeFetch = installFakeAssets(vi, options);
        assets = await import('../js/assets.js');
    }

    afterEach(() => {
        removeFakeAssets();
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    describe('when every download works', () => {
        beforeEach(() => loadAssetsModule());

        it('downloads each image and sound exactly once', async () => {
            await assets.preloadAssets();

            expect([...fakeFetch.requests].sort()).toEqual([...assets.ASSET_PATHS].sort());
            expect(new Set(fakeFetch.requests).size).toBe(fakeFetch.requests.length);
        });

        it('hands out the in-memory URL for a downloaded file', async () => {
            await assets.preloadAssets();

            expect(assets.assetUrl('img/bkg_03.jpg')).toBe(inMemoryUrl('img/bkg_03.jpg'));
            expect(assets.assetUrl('audio/coin1.wav')).toBe(inMemoryUrl('audio/coin1.wav'));
        });

        it('hands out the original path for a file that is not preloaded', async () => {
            await assets.preloadAssets();

            expect(assets.assetUrl('img/loader.gif')).toBe('img/loader.gif');
        });

        it('reports a percentage that never goes down and ends at exactly 100', async () => {
            const reported = [];

            await assets.preloadAssets((percent) => reported.push(percent));

            expect(reported.length).toBeGreaterThan(1);
            expect(reported).toEqual([...reported].sort((a, b) => a - b));
            expect(reported.slice(0, -1).every((percent) => percent < 100)).toBe(true);
            expect(reported.at(-1)).toBe(100);
        });

        it('points the images already on the page at their in-memory copies', async () => {
            document.body.innerHTML = '<img id="a" src="img/clock.png"><img id="b" src="img/loader.gif">';
            await assets.preloadAssets();

            assets.useLoadedImages();

            expect(document.getElementById('a').getAttribute('src')).toBe(inMemoryUrl('img/clock.png'));
            expect(document.getElementById('b').getAttribute('src')).toBe('img/loader.gif');
        });
    });

    describe('when a download fails', () => {
        beforeEach(() => loadAssetsModule({ failing: ['img/bkg_05.jpg', 'audio/bomb.mp3'] }));

        it('still finishes, and the failed files fall back to the server URL', async () => {
            vi.spyOn(console, 'warn').mockImplementation(() => {});
            const reported = [];

            await assets.preloadAssets((percent) => reported.push(percent));

            expect(reported.at(-1)).toBe(100);
            expect(assets.assetUrl('img/bkg_05.jpg')).toBe('img/bkg_05.jpg');
            expect(assets.assetUrl('audio/bomb.mp3')).toBe('audio/bomb.mp3');
            expect(assets.assetUrl('img/bkg_06.jpg')).toBe(inMemoryUrl('img/bkg_06.jpg'));
        });
    });

    describe('when the server does not say how big the files are', () => {
        beforeEach(() => loadAssetsModule({ sizeKnown: false }));

        it('counts finished files instead and still ends at 100', async () => {
            const reported = [];

            await assets.preloadAssets((percent) => reported.push(percent));

            expect(reported).toEqual([...reported].sort((a, b) => a - b));
            expect(reported.at(-1)).toBe(100);
        });
    });

    // Guards against adding an image or sound to the game and forgetting to preload it.
    describe('the list of assets', () => {
        beforeEach(() => loadAssetsModule());

        const sources = ['index.html', ...readdirSync(resolve(root, 'js')).map((file) => `js/${file}`)]
            .filter((file) => !file.endsWith('assets.js'))
            .map((file) => readFileSync(resolve(root, file), 'utf8'))
            .join('\n');
        const NOT_PRELOADED = ['img/loader.gif', 'img/favicon.ico'];

        it('covers every image and sound the page and the scripts refer to', () => {
            const referred = new Set(sources.match(/(?:img|audio)\/[\w.-]+\.(?:png|jpg|gif|mp3|wav)/g));
            // display.js lists the backgrounds by file name only.
            sources.match(/(?:bkg_\d\d|background_v2)\.jpg/g).forEach((name) => referred.add(`img/${name}`));
            NOT_PRELOADED.forEach((path) => referred.delete(path));

            const missing = [...referred].filter((path) => !assets.ASSET_PATHS.includes(path));

            expect(missing).toEqual([]);
        });
    });
});
