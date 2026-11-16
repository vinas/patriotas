import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { bootGame, shutdown, byId } from './helpers/game.js';

const DESKTOP_CHROME = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

describe('devices that are not a phone', () => {
    beforeEach(async () => { await bootGame(); });
    afterEach(shutdown);

    it('a desktop browser gets the "only on mobile" message', () => {
        Object.defineProperty(window.navigator, 'userAgent', { value: DESKTOP_CHROME, configurable: true });

        document.dispatchEvent(new Event('DOMContentLoaded'));

        expect(byId('background').textContent).toContain('Apenas no celular');
    });
});
