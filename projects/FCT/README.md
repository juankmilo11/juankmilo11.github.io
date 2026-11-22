# FCT source project

This is the source for the deployed game at `/FCT/` in the `juankmilo11.github.io` site repository.

Install dependencies with `npm ci`, run the local preview with `npm run dev`, and build with `npm run build`. The Vite build writes the production site into the repository's existing `FCT/` deployment directory. Keep `node_modules/` and generated bundles out of this source directory's Git history.

Run `npm test` to check terrain geometry, the four central summit squares, and
move/capture audio for both sides (including en passant).

## Fantasy Chess Tactics

The main **JUGAR** button opens `tactics.html` directly in 3D. Both sides use
16 pieces in the standard chess starting position. The dice winner chooses
first or second, with alternating initiative each round. All units, including
both kings, start without a charged ultimate.

Every round allows **two secret actions per side**, with **15 active seconds
per action**. The same unit cannot repeat a kind within that round; different
units may share a kind. Examples: one unit may Move + Attack or Focus + Ultimate;
two different units may each Move. Expired slots become waits. Completing the
sequence starts combat and the next round automatically.

Selecting or dragging a unit reveals one uniform destination color and a
contrasting selected square. Clicking/dropping on an empty legal square queues
a movement; on a reachable allied/enemy unit it queues a stationary attack.
There is no confirmation popup. Action buttons sit at the lower battlefield
edge, clear of destinations. A unit deselects after each order and must be
selected again for another action. Movement keeps the previous facing unless
an optional arrow is chosen; final-slot arrows close after 2.5 seconds.
A queued attack whose target square becomes empty, or a movement whose square
becomes occupied, fizzles without changing the declared action type.

All ultimates attack the class's full area with friendly fire. Sliding rays
stop at the first body; knights hit all eight L squares, kings adjacent squares,
and pawns both front squares and forward diagonals. Pawns retain one/two-square
and diagonal movement. Blocking absorbs 2 on the next hit (minimum received 1)
and returns actual received damage during that round, without reflection chains.

The inspector works for either army during preparation, planning, combat and
review: hover a figure or click it without an acting unit selected to inspect
it. It shows HP, charge, facing, team color and combat value. Review controls
occupy the sidebar below the inspector only while reviewing. The colored team
badge identifies the actor; event descriptions use direction arrows. Compact
snapshots retain every resolved action, and review never mutates the live game.

The AI uses a bounded two-action beam search, including movement/attack and
focus/ultimate combinations, incoming threats, reflection and friendly-fire
costs. Setup branches remain in the beam instead of being discarded before
their second order pays off. Tactical values in `src/tactics-values.js` are
pawn 2, knight/bishop 4, rook 5, queen 8; the king has terminal priority.
The inspector and AI use that same table. Planning reads only the public round
position and respects the per-unit action restriction.

FCT's homepage window, bubble and Yin Yang accent are green. Every application
window also offers a new-tab action. The cream/dark-outline HUD is inspired by
Nintendo handheld battle screens without using copied game artwork.

Rendering uses automatic hardware budgets and a manual **Ligero** option.
Low-power tactical boards disable shadows/idle motion and render on changes,
with animations capped at 30 fps. Hidden/inactive tactical views stop their
render loop. Static scenery is merged by material; geometry stays cached.
Appearances are separate assets, so only those used by a match are downloaded.
AI planning runs in a Worker; forecasts are cached and the DOM squares reused.
Physical low-end devices still require device testing.

See [the Spanish rules](TACTICS.md). `node scripts/qa-fct-tactics.cjs` from the
root checks direct actions, reselection, highlighted dragging, both-army
inspection, sidebar review and render budgets at desktop/mobile sizes. Its
fixture hooks never ship in production.

## Character appearances

The menu's **Seleccionar piezas** dialog replaces the old player/rival card.
The resource catalog has 38 characters with five colors each (190 variants).
One shared color applies to the entire player's army. The five canonical colors
are blue, crimson, jade, amethyst and gold. A second shared choice restricts the
ordinary pieces to female or male characters; changing it pairs their classes
and preserves the independent king/queen choices. Kings are always male and
queens female, for either formation.
The player can choose 180 distinct appearances in the following roles:

- Pawns: Squire, Monk and Thief, female/male.
- Rooks: Knight, Samurai and Ninja, female/male.
- Knights: Dragoon, Archer and Geomancer, female/male.
- Bishops: White Mage, Black Mage and Summoner, female/male.
- Queens: Agrias, Teta, Dancer, Mime, Ovelia and Balmafula.
- Kings: Ramza, Delita, Cloud, Orlandu, Mustadio and Beowulf.

Dycedarg and Gaff Gafgarion are AI-only kings, with five colors each. They never
appear in the player selector or pass player-loadout validation. AI king identity
is stable for a given loadout and changes between these two exclusive characters;
its palette contrasts against the player. The entire AI army uses that same
contrasting color; its ordinary characters and king are male and its queen female.
Choices are cosmetic and kept only in page memory: **Guardar**
applies the draft, **Salir**/Escape discards it, and reloading resets defaults.

Only the player's character appears in the preview. Color choices use accessible
swatches without visible labels. Piece identities remain available through the
focus inspector and square descriptions, without badges below the figures.
The selector keeps a fixed viewport-bounded height while browsing roles/colors;
only its content scrolls, with Salir/Guardar always visible. Character cards and
the viewer omit visible name captions, while preserving accessible names.
The Aspect and Vista previa panels have matching desktop dimensions; the eye
button rotates the preview. Labels omit gender suffixes throughout the game.
The centered 2D sprite, drag follower and drop preview all use the selected PNG.
Promotion uses the selected appearance of the promoted role.

A cyan border identifies the selected square in both views, including empty
squares. Clicking outside the board clears it. Last-move, legal-move and capture
indicators use translucent fills. Kings crouch in check and lie on the ground
after checkmate: 2D uses dedicated transparent pose sprites, while 3D articulates
the character rig and fits the pose to the floor. Reviewing moves restores the
correct posture for that position. Reduced motion keeps the static posture.
The 2D board omits decorative stone/mud/moss dots; functional move markers stay
visible. Piece shadows use a soft warm earth tone.

3D dragging lifts the figure just 0.14 world units above the terrace under the
pointer. On release it settles from its actual position over 190 ms; invalid or
cancelled drops return to the original square. Reduced motion skips the fall.
Hovering a movable figure shows an open hand; holding/dragging shows a closed
hand. Sun shadows are softened and the drop preview uses a faint warm shadow.

`src/character-volume.js` reconstructs a solid voxel hull from the original
front, back and profile silhouettes. The welded surface is relaxed in three passes with smooth shared normals to soften the pixel steps, while retaining projection colors. Shared voxel faces are removed; neighboring
voxels touch without the old lateral gaps. Each view supplies its own colors,
including the actual back. This is a stylized voxel reconstruction, not an
imported rigged character mesh. Head, torso, arms and legs are articulated for
subtle independent marching in place, alternating feet, arms and breathing. Reduced-motion
preferences stop those animations and default preview rotation.
`src/piece-motion.js` gives each live board piece its own slow floating phase,
speed and height (under 0.05 world units), applied relative to its fixed square
anchor. Movement and dragging take precedence. Captured pieces rest between
random one/two-hop cheering bursts and raise their arms while hopping; their
rack positions remain fixed. 2D sprites use independent floating periods and
captured HUD icons echo the small hops. Idle animations stop for reduced motion.
The left-facing profile is mapped anteriorly on both sides; rear head surfaces
always sample the back projection so facial colors do not appear on the nape.
Depth profiles are smoothed and anatomically bounded so a hand/weapon in a side
sprite cannot extrude the face into a snout. Minimum torso/limb depth avoids
paper-thin side views. Rendered heights are normalized: pawns 0.84, ordinary
pieces 0.92, queens 1.03 and kings 1.14 world units; 2D keeps the same size order.

Model geometries are shared by appearance, with reference counts and a bounded
cache of inactive variants. The preview renders only while its dialog is open;
the hidden board does not keep rendering behind the menu. Mobile provides a
**Ver 3D** shortcut after scrolling the catalog. The selector exclusively uses
`menu1.wav` for opening/exiting, `menu2.wav` for role/character/preview navigation,
`menu3.wav` for color/rotation, and `menu4.wav` for saving. These cues interrupt
one another instead of overlapping. The source WAV files live in `public/audio/`
and are copied to `FCT/audio/` by Vite. Other game controls keep their prior cues.

The centered dark menu and dark banner use a locally served parchment illustration and the OFL-licensed
Cinzel/Crimson Pro fonts. See [asset provenance and image prompt](../../docs/art-assets.md).

### Rebuilding character resources

The original sheets and their credits remain in `sprites/`. With Python 3 and
Pillow, run `python scripts/build-characters.py` from `projects/FCT/`.
It detects palette paste offsets and writes 190 transparent three-view atlases,
190 menu thumbnails and `sprites/characters/catalog.json`. Canonical team colors
come from `scripts/army-palettes.json`; cloth recolors preserve skin, hair and
highlights. Then run `python scripts/build-king-poses.py` to generate the 140
check/defeated sprites for all 14 eligible royal characters and all five colors.
Commit the generated files and rebuild Vite. The earlier `sprites/cropped/` and `crop-sprites.ps1`
are legacy extracts; the new renderer reads `sprites/characters/`.

The 3D board has an irregular rounded rise, from a low perimeter to
`d4`, `e4`, `d5`, `e5`. Elevation does not change chess rules. Both square colors
use closely matched grass greens in both views. `src/environment.js` builds the textured earth,
grass, weathered stone, ruined arch and vegetation procedurally; there are no
external texture requests. Capture galleries remain clear of decorations.

The board, grassy capture banks and field share a texture, UV scale and green
palette. Flat turf patches have irregular edges, joined by triangulated seams
and a single closed, smoothly shaded collar. Rounded capture banks and the field
share one height function, without overlaid rectangular bank planes. Grass uses
five-blade tufts; smaller irregular rocks sit inside the island perimeter. The island has one continuous cliff wall that
meets its irregular perimeter, replacing stacked cylinders. The four summit squares
and flat piece positions are preserved. Seams also accept clicks and drops.
`src/field-life.js` scatters tiny stones, mud and moss on selected dark squares.
A single flock of two birds crosses the field, with 45–75 seconds between flights.
Only four wind particles remain; reduced-motion mode disables both effects.
The cosmic scene, planets, galaxy, stars and meteors have been removed entirely,
including their texture asset. The 3D renderer caps pixel density at 1.25 and
uses 1024 × 1024 directional shadows to reduce fill rate and GPU memory.
These decorations do not participate in raycasting or chess rules.

Pawns are slightly smaller: 0.84 world units versus 0.92 for ordinary pieces,
with the same reduction in 2D. Queens and kings keep their larger sizes.
`src/piece-values.js` defines the material points used by both the HUD and AI:
pawn 1, rook 5, knight/bishop 3, queen 9 (the king has no material score).
The AI retains its small positional/minor-piece adjustments.

## Music and effects

`src/audio-system.js` owns two on/off buttons, with `aria-pressed` state and
accessible action labels. Music uses a fixed 15% level and effects 35%; there
are no volume sliders or panels. Selecting/dragging uses the move cue at 34%
of the FX level. The buttons live in the game toolbar during play and return to
the menu dock when leaving combat. The turn/check/thinking notice now floats
near the board in the previous sound-dock position. The camera reset uses an eye SVG.

Five user-provided MP3 files are preserved in `public/assets/music/` and copied
verbatim to `/FCT/assets/music/`. `src/music-tracks.json` lists their display names.
Add new music to that source folder and update the manifest before building.
`audio/Incarnam.mp3` is a legacy source, no longer bundled by the HTML.

`ShuffleQueue` plays a randomized bag of all tracks without repeats and avoids
an immediate repeat across cycle boundaries. Previous/next can revisit the real
history without changing the remaining shuffle bag. End-of-track advances the queue.
Only the current track is requested, using normal browser streaming/byte ranges.

Playback is attempted immediately on page load and retried on pointer movement
or interaction while blocked. Explicitly pausing does not get undone by mouse
movement, selecting a piece or starting combat. Browsers may require a click or
tap before audible playback; see the [MDN autoplay guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay).

During move review the controls span the full viewport width, with a centered
pause notice. The floating turn badge also says **Partida pausada**.
It stays visible even at the latest position until the player presses **Volver**.
The HUD reserves its height above the scene so the notice cannot cover the
opponent's piece strip. A ResizeObserver positions the floating turn notice below the HUD.
Entering review and returning to play use a gentle dimming transition without
blur. The board stays slightly dimmed during review; reduced-motion preferences
disable the transition.

Optional headless browser QA (requires Playwright and Microsoft Edge):

```powershell
node scripts/qa-fct.cjs
node scripts/qa-fct-performance.cjs
node scripts/qa-fct-motion.cjs
node scripts/qa-fct-review-ui.cjs
node scripts/qa-fct-kings.cjs
node scripts/qa-fct-drag.cjs
node scripts/qa-fct-live.cjs
```

Run from the repository root after building. If Playwright is outside the normal
module search path, set `PLAYWRIGHT_MODULE_PATH` to its package directory.
`FCT_QA_OUTPUT` sets the screenshot directory (default: OS temp directory).
The script tests actual moves, review/resume and HUD overlap at desktop, tablet,
320/390 px mobile, and landscape sizes, with touch emulation for mobile.
It also builds all 240 allowed role/color assignments across both genders, checks role restrictions,
save/cancel and reload reset, PNG drag previews, keyboard focus, the four exclusive
selector sounds and camera orbit. It checks all five playlist entries, non-repeating playlist, independent effect mute, intentional pause and mobile
button bounds. Real AI games cover the normal
flow. Scripted opponent replies exercise the app's castling, en passant,
promotion, captures, mate, review/replay and new-game flows in both mobile
orientations. These browser tests emulate mobile; they do not replace testing
on physical iOS/Android hardware. `FCT_QA_VIEWER_ONLY=1` runs just the preview checks.
The performance check inspects the real 3D scene at a mobile viewport with
3× device density: no cosmic objects or texture downloads, at most two birds
and four wind particles, reduced-motion suppression, pixel ratio and shadow limits.
It saves screenshots; physical low-end device performance still needs device testing.
The motion check samples the real 3D board over several seconds after two
captures, verifying independent bounded floats, cheering arms, fixed X/Z anchors,
restoration through review and reduced-motion behavior.
The review UI check covers full-width controls, centered settings without rival-color labels, independent royal choices, dimming transitions,
camera/exit symmetry, and selection/deselection in both views. The king check
uses real moves and FEN positions to verify check/mate, undo/replay, 2D pose assets,
all 14 royal 3D rigs, floor alignment and reduced-motion postures. These last two
scripts build isolated test bundles from the source and keep their hooks out of
production. The drag check exercises real pointer input, lifted/drop positions,
invalid drops, cursors and clean 2D decorative styles.
The live check waits for the public GitHub Pages HTML/assets to match the local
build, then verifies the selector, selection, paused review and 3D in Edge.

`src/audio-cues.js` preserves the actual previous sound assignments: the human
move used the historical `AI_piece_move.wav` file and the AI used
`user_piece_move.wav`. Normal moves now share the former; all captures use
the latter, regardless of side. Check and checkmate cues remain additional.

Visual reference: the raised terrain, stonework and vegetation of the
[Orbonne opening battle](https://shrines.rpgclassics.com/psx/fft/battles/introbattle.shtml)
in Final Fantasy Tactics for PS1. Landscape meshes and textures here are procedural.
