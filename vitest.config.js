import { defineConfig } from 'vitest/config';

// The game is plain browser ES modules with no build step, so the tests run the
// real modules inside a simulated page (jsdom). Phone emulation (user agent,
// screen size, audio, clock) is set up per test in tests/helpers/game.js.
export default defineConfig({
    test: {
        environment: 'jsdom',
        // jsdom only exposes requestAnimationFrame when pretending to be visible,
        // and the game loop is driven by it.
        environmentOptions: { jsdom: { pretendToBeVisual: true } },
        include: ['tests/**/*.test.js']
    }
});
