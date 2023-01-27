// App Objects
var setup,
    events,
    calc,
    display,
    sounds,
    motion,
    controls,
    resizer,
    game,
    login;

// Login
var user = {
    firstName: 'User'
};

// Characters
var Thief,
    Officer1,
    Officer2;

// Game Items
var Molotov,
    Clock,
    Bomb;

// Display Items
var Counter1,
    Counter2,
    BackgroundImg,
    CurrLevel,
    Time;

// Dimentional Constants
var MAPSIZE = 500,
    CHARSIZE = 75,
    ITEMSIZE = 40,
    CATCHTOLERANCE = 15,
    CROSSBORDERTOLERANCE = 20;

// Other game constant settings
var STANDARDTIME = 20,
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
    THROWSPEED = 40,
    SPEEDTABLE;

// Sounds
var musicTheme = new Audio('audio/8bit_sparks.mp3'),
    endGameSound = new Audio('audio/endGame.mp3'),
    loadingTheme = new Audio('audio/looperman.mp3'),
    bombSound = new Audio('audio/bomb.mp3'),
    clockSound = new Audio('audio/crank-1.mp3'),
    coinSound = new Audio('audio/coin1.wav');

// Functional game variables
var gameOn = false,
    pressedKey,
    points,
    isClockVisible,
    isMolotovVisible,
    isBombVisible,
    thiefMoveRate,
    officerMoveRate = new Array(0, 0),
    currLevel,
    time,
    molotovTime,
    lastChangedLevel;

// Game elements' position arrays
var officerPosArr = new Array(new Array(0, 0), new Array(0, 0)),
    thiefPosArr = new Array(0, 0),
    moneyPos = new Array(0, 0),
    clockPos = new Array(0, 0),
    molotovPos = new Array(0, 0),
    bombPos = new Array(0, 0);
