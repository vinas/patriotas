# Refactoring Guide

An initial pass over the codebase, grouped by theme. Each item notes what's there today (with file references), why it's worth revisiting, and a possible direction — not a final design. Pick items off this list incrementally; nothing here assumes a full rewrite.

## 1. Architecture / state management

- **Global-variable soup.** `js/globals.js` declares ~40 `var`s at global scope — game state (`points`, `time`, `currLevel`...), DOM element refs (`Thief`, `Officer1`...), position arrays (`officerPosArr`, `thiefPosArr`...), and tuning constants. Every "module" reads and writes these directly instead of receiving them as arguments or through an owned state object. This breaks encapsulation, makes the modules impossible to unit test in isolation, and makes the `<script>` order in `index.html` load-bearing (a module can reference a global before it's assigned if the tags are reordered).
  - *Direction:* introduce a single `GameState` object/class that owns the mutable state, and have modules accept it (or the specific pieces they need) as constructor arguments instead of closing over globals.

- **Homegrown module pattern.** Every file follows `function Setup() { this.x = x; return this; function x(){...} }` — assigning public methods to `this` before the (hoisted) function declarations exist below. This is a pre-ES6 manual dependency-injection idiom from an era without real modules. All ten "modules" (`setup`, `events`, `calc`, `display`, `sounds`, `motion`, `controls`, `resizer`, `game`, `login`) are instantiated as globals in `js/start-app.js` and then reference each other by those global names, creating circular coupling (`motion` ↔ `display` ↔ `calc` ↔ `game`).
  - *Direction:* migrate to ES modules with explicit `import`/`export`, or at minimum switch to a plain object-literal export at the bottom of each factory function for clarity. Longer term, pass collaborators in explicitly rather than reaching for globals.

## 2. Duplication

- **`setThiefHorDirection` defined twice**, identically, in `js/motion.js` and `js/display.js`. Only the `motion.js` copy is ever called — the one in `display.js` is dead code.
- **Level-change logic implemented twice, and diverging.** Leveling *up* happens in `js/game.js` (`handleLevelChange`), leveling *down* happens in `js/events.js` (`gotBomb`). Both re-derive `currLevel`, re-read `SPEEDTABLE` into `officerMoveRate`, and toggle the second officer / theme music, but with slightly different code paths for each direction.
  - *Direction:* consolidate into one `changeLevel(delta)` function used by both call sites.
- **Sounds constructed twice.** The same seven `new Audio(...)` calls appear once at top level in `js/globals.js`, then again in `setup.js`'s `setSounds()` — the first set is created and immediately discarded. Keep one.

## 3. Dead / vestigial code

- Commented-out jQuery Mobile config in `setup.js` (`applySettings`).
- Commented-out Facebook login flow spread across `setup.js`, `controls.js`, `login.js`, `index.html`, and `resizer.js` (login button styling, ranking button, OAuth calls).
- Dead ranking feature: markup in `index.html`, CSS in `styles.css`, and `display.js`'s `ranking()`/`setOrdinal()` methods — nothing currently wires this up.
- `handleSwipePresentation` in `controls.js` is a stack of `// TO DO` comments wrapping a large commented-out jQuery swipe handler.
- `<!-- build:css -->` / `<!-- build:js -->` markers in `index.html` reference a `gulp-usemin`-style build step, but no `gulpfile`/`package.json` exists in the repo — these are scaffolding left over from a removed build system.
  - *Direction:* delete rather than comment out; git history keeps it recoverable if any of it turns out to still be wanted (especially the FB login and ranking features, if there's a plan to bring those back — worth confirming before deleting those two).

## 4. Single-responsibility violations (god objects)

- **`Calculator` (`js/calculator.js`) mixes four unrelated concerns:**
  - geometry/collision: `reached`, `randomCoords`, `crossMultiply`
  - officer AI: `nextOfficerPos`, `movingAxis`, `getRelativePositions`
  - projectile math: `setNewThrowItemPos`, `variationRate`, `inclination`
  - spawn probability: `sortBomb`, `sortMolotov`, `areChancesAmoung`
  - date formatting: `formattedDateTime` (its own, unrelated, category)
  - *Direction:* split into `GeometryUtils`, `OfficerAI`, `ProjectileMath`, `SpawnChance`, `DateUtils`.

- **`Display` (`js/display.js`, 472 lines, ~35 public methods) mixes:**
  - generic DOM helpers: `showElements`/`hideElements`/`element`/`isString` — genuinely reusable and framework-free, good candidates for their own small `dom.js`
  - game-specific rendering: character/item positioning, background swapping
  - transient feedback/messaging: `flash`, `showFeedback`/`blinkMsg`
  - UI button state: `startButton`/`loadingButton`/`loginButton`
  - a dead ranking renderer (see §3)
  - *Direction:* pull the generic DOM helpers out first (lowest risk, clearest win), then split the rest along the lines above.

## 5. Data modeling

- **Officers as array indices.** Both officers are represented as index `0`/`1` into parallel arrays (`officerPosArr`, `officerMoveRate`), with repeated ternaries like `whichOfficer == 0 ? Officer1 : Officer2` showing up in `motion.js` (and mirrored implicitly in `calculator.js`/`display.js`). This is probably the highest-value single structural change available: model each officer as an object (`{el, pos, moveRate}`) held in an array, and iterate instead of branching on index.
- **`SPEEDTABLE`** is a 2D array built in `resizer.js` (`setSpeedTable`) and consumed by index-per-level in `motion.js`, `events.js`, and `game.js`, with no explanation at the point of use — a comment or a named accessor (`speedTable.forLevel(currLevel)`) would help.

## 6. Correctness bugs found in passing

- **Invalid, silently-ignored CSS.** Several rules in `css/styles.css` use unitless numeric values where CSS requires a unit, so they do nothing: `.background { height: 500; }`, `.presentation { height: 500; }`, `.personagem { width: 50; height: 50; }`, `.item { width: 25; height: 25; }`, `.title { font-size: 40; }`. Actual sizing for all of these is done via inline styles set at runtime in `js/resizer.js`, so these rules are misleading dead weight rather than an active bug — but worth fixing (add `px`) or removing so the CSS reflects reality.
- **Implicit global loop variable `i`.** Used without `var`/`let` in `setup.js` (`preloadImages`) and `display.js` (`ranking()`, `showElements`, `hideElements`). This creates one shared global `i` across all of these — currently harmless since none of these loops overlap in time, but it's a latent bug if that ever changes (e.g. two of them triggered inside overlapping `setTimeout` callbacks).

## 7. Modernization opportunities

- No `let`/`const` anywhere — everything is `var`. No ES6 classes or modules. `new Array(...)` is used pervasively instead of `[]` literals. All mechanical, low-risk, high-volume changes.
- `e.which` (deprecated) used for key handling in `controls.js` and `motion.js`, with magic key codes `37/38/39/40/13` and no named constants (`KEY_LEFT`, `KEY_ENTER`, etc.). Consider `e.key` and named constants.
- `display.js`'s `mirrorObj` manually sets `MozTransform`, `webkitTransform`, `OTransform`, and `msFilter` alongside `transform` — vendor prefixes are dead weight on any browser this game plausibly still targets. A plain `transform: scaleX(...)` is sufficient today.
- **Recursive `setTimeout` instead of `requestAnimationFrame`** in at least five independent places: `game.js`'s `gameLoop` (40ms) and `gameClock` (1000ms), `motion.js`'s `throwItem` → `moveItem` (10ms), and `display.js`'s `flash` → `flashThis` and `showFeedback` → `blinkMsg` (100ms/varies). These are all independent self-rescheduling timers; unifying animation-rate ones under a single `requestAnimationFrame`-driven scheduler would be smoother and more battery-friendly on mobile, which is this game's actual target per `setup.js`'s `isMobile()` gate.

## 8. Naming

- Typos: `startPressedTimmer` (→ Timer) in `display.js`/`controls.js`; `areChancesAmoung` (→ Among) in `calculator.js`; `dificultyBox`/`updateDificultyDisplay` (→ Difficulty) — this last one spans an HTML id, a CSS selector, and JS references, so it's a coordinated rename rather than a quick fix.
- Portuguese/English naming mix: `mostrador`, `tituloMostrador`, `fase` alongside `scoreBox`, `timeBox`. Not necessarily wrong, but worth picking one convention going forward for anything new.

## Suggested order of attack

Roughly cheapest-and-safest → most structural:

1. Delete dead code (§3) and fix the duplicate sound init (§2) — pure subtraction, zero behavior risk.
2. Fix the unitless CSS (§6) and the implicit-global `i` (§6) — small, isolated correctness fixes.
3. Pull generic DOM helpers out of `Display` into their own module (§4) — low risk, immediate readability win.
4. Remove the duplicate `setThiefHorDirection` and consolidate level-change logic (§2).
5. Model officers as objects instead of parallel-array indices (§5) — bigger, touches `motion.js`/`calculator.js`/`display.js`, but likely the single highest-value structural change.
6. Split `Calculator` along its four concerns (§4).
7. Broader modernization pass (`let`/`const`, array literals, `requestAnimationFrame`, named key constants) (§7) — mechanical, can be done gradually file-by-file.
8. Naming cleanup (§8), doing the cross-file `dificultyBox` rename as one deliberate pass.
