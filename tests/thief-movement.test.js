import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { bootGame, shutdown, startGame, pressKey, swipe, swipeDirection, advance, frame, FRAME_SCALE } from './helpers/game.js';

const START = [200, 200];

// Which coordinate each direction changes, and its sign.
const DIRECTIONS = {
    up: { key: 'ArrowUp', axis: 1, sign: -1 },
    down: { key: 'ArrowDown', axis: 1, sign: 1 },
    left: { key: 'ArrowLeft', axis: 0, sign: -1 },
    right: { key: 'ArrowRight', axis: 0, sign: 1 }
};

describe('playable character movement', () => {
    let game;

    beforeEach(async () => {
        game = await bootGame();
        startGame();
        game.state.thiefPosArr = [...START];
    });
    afterEach(shutdown);

    it('stands still until a command is given', () => {
        advance(500);

        expect(game.state.thiefPosArr).toEqual(START);
    });

    it('a tap without movement does not start the thief moving', () => {
        const tap = (type) => {
            const event = new Event(type, { bubbles: true });
            Object.defineProperty(event, 'touches', { value: [{ clientX: 200, clientY: 300 }] });
            document.body.dispatchEvent(event);
        };
        tap('touchstart');
        document.body.dispatchEvent(new Event('touchend', { bubbles: true }));
        advance(200);

        expect(game.state.thiefPosArr).toEqual(START);
    });

    it('a tiny swipe does not start the thief moving', () => {
        swipe([200, 300], [203, 302]);
        advance(200);

        expect(game.state.thiefPosArr).toEqual(START);
    });

    describe.each(Object.entries(DIRECTIONS))('%s', (name, { key, axis, sign }) => {
        const expectMovedOnlyAlongAxis = () => {
            const pos = game.state.thiefPosArr;
            expect((pos[axis] - START[axis]) * sign).toBeGreaterThan(0);
            expect(pos[1 - axis]).toBe(START[1 - axis]);
        };

        it('moves with the keyboard arrow', () => {
            pressKey(key);
            advance(200);

            expectMovedOnlyAlongAxis();
        });

        it('moves with a swipe', () => {
            swipeDirection(name);
            advance(200);

            expectMovedOnlyAlongAxis();
        });

        it('moves at the thief speed', () => {
            pressKey(key);
            frame();

            const expected = game.state.thiefMoveRate * FRAME_SCALE;
            expect((game.state.thiefPosArr[axis] - START[axis]) * sign).toBeCloseTo(expected, 5);
        });
    });

    it('keeps going in the last direction commanded until a new one is given', () => {
        pressKey('ArrowRight');
        advance(200);
        const afterRight = [...game.state.thiefPosArr];
        advance(200);
        expect(game.state.thiefPosArr[0]).toBeGreaterThan(afterRight[0]);

        pressKey('ArrowDown');
        advance(200);
        const afterDown = [...game.state.thiefPosArr];
        advance(200);
        expect(game.state.thiefPosArr[1]).toBeGreaterThan(afterDown[1]);
        expect(game.state.thiefPosArr[0]).toBe(afterDown[0]);
    });
});

describe('playable character crossing the map limits', () => {
    let game;
    let map;

    beforeEach(async () => {
        game = await bootGame();
        startGame();
        map = game.state.MAPSIZE;
    });
    afterEach(shutdown);

    // Places the thief just inside one edge, away from the officers' corner, and walks it out.
    const walkOutOf = (key, from) => {
        game.state.thiefPosArr = from;
        pressKey(key);
        advance(1000);
        return game.state.thiefPosArr;
    };

    it('leaving through the left edge reappears on the right side', () => {
        const [x, y] = walkOutOf('ArrowLeft', [-30, 100]);

        expect(x).toBeGreaterThan(map / 2);
        expect(y).toBe(100);
    });

    it('leaving through the right edge reappears on the left side', () => {
        const [x, y] = walkOutOf('ArrowRight', [map - 5, 100]);

        expect(x).toBeLessThan(map / 2);
        expect(y).toBe(100);
    });

    it('leaving through the top edge reappears at the bottom', () => {
        const [x, y] = walkOutOf('ArrowUp', [100, -30]);

        expect(y).toBeGreaterThan(map / 2);
        expect(x).toBe(100);
    });

    it('leaving through the bottom edge reappears at the top', () => {
        const [x, y] = walkOutOf('ArrowDown', [100, map - 5]);

        expect(y).toBeLessThan(map / 2);
        expect(x).toBe(100);
    });

    it('is not blocked at the edge: it goes past the limit before it wraps', () => {
        game.state.thiefPosArr = [5, 100];
        pressKey('ArrowLeft');
        advance(200);

        expect(game.state.thiefPosArr[0]).toBeLessThan(0);
    });
});
