// App Objects
let setup,
    events,
    geometry,
    officerAI,
    projectileMath,
    spawnChance,
    dateUtils,
    display,
    sounds,
    motion,
    controls,
    resizer,
    game,
    dom;

// Login
const user = {
    firstName: 'User'
};

// Characters
let Thief;

// Officers
const officers = [
    { element: null, counter: null, pos: [0, 0], moveRate: 0 },
    { element: null, counter: null, pos: [0, 0], moveRate: 0 }
];

// Game Items
let Molotov,
    Clock,
    Bomb;

// Display Items
let BackgroundImg,
    CurrLevel,
    Time;

// Dimentional Constants (reassigned at runtime by resizer.js once actual screen size is known)
let MAPSIZE = 500,
    CHARSIZE = 75,
    ITEMSIZE = 55,
    CATCHTOLERANCE = 15,
    CROSSBORDERTOLERANCE = 20;

// Other game constant settings
const STANDARDTIME = 20,
    PTSTOCHANGELEVEL = 5,
    POINTUNITY = 1,
    BONUSTIME = 3,
    MOLOTOVPAUSE = 4,
    DISPLAYCLOCKAT = 7,
    TWOPOLICEMENLEVEL = 3,
    MINMOVINGRATE = 3,
    STANDTHIEFMOVRATE = 6,
    STANDGAMEREFRESHRATE = 40,
    SWIPEDISTANCE = 20,
    THROWFRAMERATE = 10,
    MAX_FRAME_SCALE = 5;
let THROWSPEED = 40,
    SPEEDTABLE;

// Key codes
const KEY_LEFT = 'ArrowLeft',
    KEY_UP = 'ArrowUp',
    KEY_RIGHT = 'ArrowRight',
    KEY_DOWN = 'ArrowDown',
    KEY_ENTER = 'Enter';

// Sounds
let fastTheme,
    slowTheme,
    endGameSound,
    loadingTheme,
    bombSound,
    clockSound,
    coinSound;

// Functional game variables
let gameOn = false,
    musicMuted = false,
    pressedKey,
    points,
    isClockVisible,
    isMolotovVisible,
    isBombVisible,
    thiefMoveRate,
    currLevel,
    time,
    molotovTime,
    lastChangedLevel;

// Game elements' position arrays
let thiefPosArr = [0, 0],
    moneyPos = [0, 0],
    clockPos = [0, 0],
    molotovPos = [0, 0],
    bombPos = [0, 0];
