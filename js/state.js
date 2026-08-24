export const state = {
    // Login
    user: {
        firstName: 'User'
    },

    // Characters
    Thief: undefined,

    // Officers
    officers: [
        { element: null, counter: null, pos: [0, 0], moveRate: 0 },
        { element: null, counter: null, pos: [0, 0], moveRate: 0 }
    ],

    // Game Items
    Molotov: undefined,
    Clock: undefined,
    Bomb: undefined,

    // Display Items
    BackgroundImg: undefined,
    CurrLevel: undefined,
    Time: undefined,

    // Dimentional Constants (reassigned at runtime by resizer.js once actual screen size is known)
    MAPSIZE: 500,
    CHARSIZE: 75,
    ITEMSIZE: 55,
    CATCHTOLERANCE: 15,
    CROSSBORDERTOLERANCE: 20,
    THROWSPEED: 40,
    SPEEDTABLE: undefined,

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
    thiefMoveRate: undefined,
    currLevel: undefined,
    time: undefined,
    molotovTime: undefined,
    lastChangedLevel: undefined,

    // Game elements' position arrays
    thiefPosArr: [0, 0],
    moneyPos: [0, 0],
    clockPos: [0, 0],
    molotovPos: [0, 0],
    bombPos: [0, 0]
};
