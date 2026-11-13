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

The game deliberately only runs on **mobile devices in portrait orientation** — on anything else it shows an "only on mobile, portrait" message instead of starting. See `setup.js`'s `isMobilePortrait()`.

## Running it

There's no build step and the game has no runtime dependencies (the `package.json` only exists for the test tooling, see [Testing](#testing)). It's a static site — but the JS is loaded as native ES modules (`<script type="module">`), which browsers refuse to load over `file://` (CORS). You need a local static server:

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
tests/                 Automated tests (Vitest + jsdom) and their helpers
font/, img/, audio/    Static assets (Silkscreen font, sprites/backgrounds, sound effects)

js/
  state.js             Shared mutable game state (one exported object: officers, positions, DOM refs, audio, level/time/points, etc.)
  constants.js         Tuning constants that are never reassigned (timings, sizes, key codes)
  start-app.js         Entry point — on DOMContentLoaded, checks isMobilePortrait() and kicks off game.init()

  setup.js             Mobile/portrait detection, startup asset loading, DOM element binding, reset logic
  assets.js            Downloads every image and sound into memory once, up front, and hands out in-memory (blob:) URLs
  resizer.js           Scales the whole UI to the actual screen size (everything is designed at a 500px baseline and scaled via scaleToMap)
  dom.js               Tiny generic show/hide/getElementById helpers, framework-free

  game.js              The core game loop (via requestAnimationFrame) and game clock (1s countdown timer); level-up/level-down orchestration
  motion.js            Per-frame movement: reads swipe/keyboard input, moves the thief, moves the officer(s), animates thrown items
  events.js            Collision checks each frame: did the thief grab an item, get caught, etc.
  display.js           Everything DOM-rendering related: positioning sprites, showing/hiding UI, flashing/feedback text, busted-screen messages
  controls.js          Input handling: touch/swipe gesture detection, keyboard, buttons

  geometry.js          Generic position/size/collision math (scaleToMap scaling, bounding-box "reached" checks, thief movement)
  officer-ai.js         Officer movement AI and the "is there a second officer yet" level check
  projectile-math.js    Trajectory math for thrown items (bomb/molotov arcing toward a target)
  spawn-chance.js       Random-chance rolls for whether a bomb/molotov should appear

  sounds.js            Music/SFX playback and the mute toggle
```

Several module pairs import each other (`display.js`↔`motion.js`, `game.js`↔`events.js`/`controls.js`) — safe in ES modules as long as no module uses another's export at its own top level, only inside functions called later, which holds throughout this codebase.

The `officers` array (in `state.js`) models both police officers as `{ element, counter, pos, moveRate }` objects rather than parallel index-based arrays — officer 0 always exists, officer 1 is conditionally shown once the player reaches a high enough level.

## Asset preloading

Browsers don't reliably keep images and sounds around: audio is streamed in pieces and re-requested when the game rewinds or replays it, and whether a swapped image comes from the cache depends on the server's caching headers. So the game doesn't leave this to the browser. On startup `assets.js` downloads every image and sound once (`fetch`), keeps the files in memory and turns each into a `blob:` URL. The loader and a "carregando NN%" label stay up until everything has arrived, then the Start button appears. From then on the game only uses those in-memory URLs, so it never asks the server for an image or sound again, whatever the caching headers are.

- Every `<img>` already in `index.html` is repointed to its in-memory copy (`useLoadedImages`), and the sounds are created from `assetUrl(...)`.
- Any code that changes an image's `src` goes through `assetUrl(path)`, which returns the in-memory URL, or the plain path for a file that couldn't be preloaded (that file then loads from the server when needed, and the game still starts).
- **Adding an image or sound:** add its path to the lists at the top of `js/assets.js`. A test fails if the page or the scripts refer to an `img/` or `audio/` file that isn't in the lists.
- `img/loader.gif` and the favicon are deliberately not preloaded: they're needed before the preload can start.
- The first visit downloads about 9 MB (mostly the two anthem MP3s) before Start appears, and that memory is held for the whole session.

## Testing

The main game rules are covered by automated tests that run the real `js/` modules and `index.html` markup in a simulated phone (390x844, portrait, iPhone user agent) using [Vitest](https://vitest.dev) and jsdom. Audio is replaced by a recorder and time is faked, so the whole suite runs in a couple of seconds and never needs a browser or a server.

```bash
npm install     # once, installs the dev-only test tooling
npm test        # run the suite once
npm run test:watch
```

Requires Node 20 or newer (jsdom is pinned to 26 because 27 needs Node 22.12+).

What is covered, one file per area in `tests/`:

| File | Rules |
| --- | --- |
| `game-start.test.js` | the game starts (Start button, instructions, round begins, countdown) |
| `music.test.js` | music can be muted and unmuted; the right soundtrack resumes when the tab is refocused or the game restarts |
| `thief-movement.test.js` | thief moves up/down/left/right by keyboard and swipe (a tap or tiny swipe does nothing); leaving the map reappears on the opposite side |
| `officer-ai.test.js` | officer 0 chases along the axis with the biggest gap; speed per level, up and down |
| `second-officer.test.js` | officer 1 appears at level 3 and disappears below it |
| `pickups.test.js` | bomb lowers the level once, molotov burns and freezes the officers for 3s (thrown once), clock adds time |
| `game-over.test.js` | caught by officer 0, caught by officer 1, time is up |
| `background.test.js` | a level-up always shows a different background |
| `assets.test.js` | every image and sound is downloaded once and served from memory; progress; failed downloads fall back to the server URL; the asset list covers everything the game refers to |
| `preload.test.js` | Start waits for the downloads; sounds and images use the in-memory copies; a whole round (levels, items, game over, restart) makes no new requests |
| `positions.test.js` | sprite positions are written with `px` units and follow the game state |
| `resizer.test.js` | sizes are scaled once from the 500px baseline, even if measured again |

`tests/helpers/game.js` boots the game and provides the player-like actions (`startGame`, `pressKey`, `swipeDirection`, `collectMoney`, `catchItem`, `advance`...). `tests/helpers/fake-assets.js` replaces `fetch`, `Blob` and `URL.createObjectURL` so the asset preload runs without a network (a file's in-memory URL is just `blob:<its path>`).

## Assets & credits

- Font: [Silkscreen](https://fonts.google.com/specimen/Silkscreen) (SIL Open Font License 1.1), chosen for being legible at small sizes while fully supporting Portuguese accented characters.
- Sprites, backgrounds, and audio are project-original/curated assets under `img/` and `audio/`.
