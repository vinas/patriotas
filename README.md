# Patriotas (aka "The Chase")

A mobile-only, portrait-orientation arcade game built in vanilla JavaScript — no framework, no bundler, no build step. You play a thief dodging police officers on a city street, grabbing cash while occasionally getting a molotov or a bomb to even the odds. It's wrapped in Brazilian political-satire flavor (character sprites, backgrounds, and busted-screen one-liners referencing Brazilian politics/internet culture), but mechanically it's a straightforward top-down chase/avoidance game.

## Gameplay

- **Move** the thief around the map to dodge the police officer(s) chasing you.
- **Collect money** for points. Every few points you level up, which speeds up the officer(s) and eventually spawns a second officer.
- **Grab the clock** (appears periodically) for bonus time.
- **Grab the molotov** to set the police on fire, freezing them in place for a few seconds.
- **Grab the bomb** (appears at higher levels) to throw it at an officer, knocking a level back down (and un-spawning the second officer if you drop below the threshold).
- Get caught by an officer, or let the clock hit zero, and it's game over ("Busted!" / "Time's up!") — you're shown a random satirical message and can start again.

**Controls:** swipe in a direction on the screen, or use the arrow keys (useful for testing on desktop). Tap Start/Reset to begin or restart. There's also a music mute toggle.

The game deliberately only runs on **mobile devices in portrait orientation** — on anything else it shows an "only on mobile, portrait" message instead of starting. See `setup.js`'s `isMobile()`.

## Running it

There's no build step, no dependencies, no `package.json`. It's a static site — but the JS is loaded as native ES modules (`<script type="module">`), which browsers refuse to load over `file://` (CORS). You need a local static server:

```bash
# from the project root, any static file server works, e.g.:
npx serve .
```

Because it gates on mobile + portrait, testing in a desktop browser requires device emulation (e.g. Chrome DevTools' device toolbar, set to a phone in portrait).

## Project structure

The JS is native ES modules (`import`/`export`, no bundler) loaded via a single `<script type="module" src="js/start-app.js">` tag in `index.html` — the browser resolves the whole import graph itself. Each file exports its public functions directly (no factory wrapper, no manual instantiation); private helpers stay as plain unexported functions in the same file. Shared mutable game state lives in one exported object (`js/state.js`); values that are never reassigned live in `js/constants.js`.

```
index.html            Page structure, single module <script> tag, asset markup
css/styles.css         All styling, including the pixel-font @font-face declarations
font/, img/, audio/    Static assets (Silkscreen font, sprites/backgrounds, sound effects)

js/
  state.js             Shared mutable game state (one exported object: officers, positions, DOM refs, audio, level/time/points, etc.)
  constants.js         Tuning constants that are never reassigned (timings, sizes, key codes)
  start-app.js         Entry point — on DOMContentLoaded, checks isMobile() and kicks off game.init()

  setup.js             Mobile/portrait detection, asset preloading, DOM element binding, reset logic
  resizer.js           Scales the whole UI to the actual screen size (everything is designed at a 500px baseline and scaled via crossMultiply)
  dom.js               Tiny generic show/hide/getElementById helpers, framework-free

  game.js              The core game loop (via requestAnimationFrame) and game clock (1s countdown timer); level-up/level-down orchestration
  motion.js            Per-frame movement: reads swipe/keyboard input, moves the thief, moves the officer(s), animates thrown items
  events.js            Collision checks each frame: did the thief grab an item, get caught, etc.
  display.js           Everything DOM-rendering related: positioning sprites, showing/hiding UI, flashing/feedback text, busted-screen messages
  controls.js          Input handling: touch/swipe gesture detection, keyboard, buttons

  geometry.js          Generic position/size/collision math (crossMultiply scaling, bounding-box "reached" checks, thief movement)
  officer-ai.js         Officer movement AI and the "is there a second officer yet" level check
  projectile-math.js    Trajectory math for thrown items (bomb/molotov arcing toward a target)
  spawn-chance.js       Random-chance rolls for whether a bomb/molotov should appear
  date-utils.js         Date formatting (used for score timestamps)

  sounds.js            Music/SFX playback and the mute toggle
```

Several module pairs import each other (`display.js`↔`officer-ai.js`, `display.js`↔`motion.js`, `game.js`↔`motion.js`/`events.js`/`controls.js`) — safe in ES modules as long as no module uses another's export at its own top level, only inside functions called later, which holds throughout this codebase.

The `officers` array (in `state.js`) models both police officers as `{ element, counter, pos, moveRate }` objects rather than parallel index-based arrays — officer 0 always exists, officer 1 is conditionally shown once the player reaches a high enough level.

## Assets & credits

- Font: [Silkscreen](https://fonts.google.com/specimen/Silkscreen) (SIL Open Font License 1.1), chosen for being legible at small sizes while fully supporting Portuguese accented characters.
- Sprites, backgrounds, and audio are project-original/curated assets under `img/` and `audio/`.
