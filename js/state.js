export const state = {
    // Characters
    thiefEl: undefined,

    // Officers
    officers: [
        { element: null, counter: null, pos: [0, 0], moveRate: 0, sprite: 'img/guarda.gif', fireSprite: 'img/guarda_fogo_02.gif' },
        { element: null, counter: null, pos: [0, 0], moveRate: 0, sprite: 'img/juiz.gif', fireSprite: 'img/juiz_fogo.gif' }
    ],

    // Game Items
    molotovEl: undefined,
    clockEl: undefined,
    bombEl: undefined,

    // Display Items
    backgroundEl: undefined,
    levelEl: undefined,
    timeEl: undefined,

    // Dimensional values (set by resizer.js once the actual screen size is known)
    mapSize: 0,
    charSize: 0,
    itemSize: 0,
    catchTolerance: 0,
    crossBorderTolerance: 0,
    throwSpeed: 0,
    speedTable: undefined,

    // Sounds
    fastTheme: undefined,
    slowTheme: undefined,
    endGameSound: undefined,
    loadingTheme: undefined,
    bombSound: undefined,
    clockSound: undefined,
    coinSound: undefined,

    // Functional game variables
    gameOn: false,
    musicMuted: false,
    pressedKey: undefined,
    points: undefined,
    isClockVisible: undefined,
    isMolotovVisible: undefined,
    isBombVisible: undefined,
    isBombThrown: false,
    isMolotovThrown: false,
    thiefMoveRate: undefined,
    currLevel: undefined,
    time: undefined,
    molotovTime: undefined,
    pointsAtLastLevelUp: undefined,

    // Game elements' position arrays
    thiefPos: [0, 0],
    moneyPos: [0, 0],
    clockPos: [0, 0],
    molotovPos: [0, 0],
    bombPos: [0, 0]
};
