# FCT source project

This is the source for the deployed game at `/FCT/` in the `juankmilo11.github.io` site repository.

Install dependencies with `npm ci`, run the local preview with `npm run dev`, and build with `npm run build`. The Vite build writes the production site into the repository's existing `FCT/` deployment directory. Keep `node_modules/` and generated bundles out of this source directory's Git history.

Run `npm test` to check terrain geometry, the four central summit squares, and
move/capture audio for both sides (including en passant).

## Character appearances

The menu's **Seleccionar piezas** dialog replaces the old player/rival card.
The resource catalog has 38 characters with five colors each (190 variants).
The player can choose 180 appearances in the following roles:

- Pawns: Squire, Monk and Thief, female/male.
- Rooks: Knight, Samurai and Ninja, female/male.
- Knights: Dragoon, Archer and Geomancer, female/male.
- Bishops: White Mage, Black Mage and Summoner, female/male.
- Queens: Agrias, Teta, Dancer, Mime (Female), Ovelia and Balmafula.
- Kings: Ramza, Delita, Cloud, Orlandu, Mustadio and Beowulf.

Dycedarg and Gaff Gafgarion are AI-only kings, with five colors each. They never
appear in the player selector or pass player-loadout validation. AI king identity
is stable for a given loadout and changes between these two exclusive characters;
its palette maximizes contrast against the player. Other roles retain contrasting
palettes and the queen uses a different character.
Choices are cosmetic and kept only in page memory: **Guardar**
applies the draft, **Salir**/Escape discards it, and reloading resets defaults.

The rival chooses a contrasting available palette for each role.
Only the player's character appears in the preview. Color choices use accessible
swatches without visible labels. Piece identities remain available through the
focus inspector and square descriptions, without badges below the figures.
The selector keeps a fixed viewport-bounded height while browsing roles/colors;
only its content scrolls, with Salir/Guardar always visible. Character cards and
the viewer omit visible name captions, while preserving accessible names.
The centered 2D sprite, drag follower and drop preview all use the selected PNG.
Promotion uses the selected appearance of the promoted role.

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
190 menu thumbnails and `sprites/characters/catalog.json`. Existing named palettes remain in `scripts/character-palettes.json`; new native
palettes derive their swatches from clothing pixels. Single-palette characters
receive four deterministic cloth recolors, preserving skin, hair and highlights. Commit the generated
files and rebuild Vite. The earlier `sprites/cropped/` and `crop-sprites.ps1`
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

Eight user-provided MP3 files are preserved in `public/assets/music/` and copied
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

During move review a small pause notice appears inside the review controls.
It stays visible even at the latest position until the player presses **Volver**.
The HUD reserves its height above the scene so the notice cannot cover the
opponent's piece strip. A ResizeObserver positions the floating turn notice below the HUD.

Optional headless browser QA (requires Playwright and Microsoft Edge):

```powershell
node scripts/qa-fct.cjs
node scripts/qa-fct-performance.cjs
node scripts/qa-fct-motion.cjs
```

Run from the repository root after building. If Playwright is outside the normal
module search path, set `PLAYWRIGHT_MODULE_PATH` to its package directory.
`FCT_QA_OUTPUT` sets the screenshot directory (default: OS temp directory).
The script tests actual moves, review/resume and HUD overlap at desktop, tablet,
320/390 px mobile, and landscape sizes, with touch emulation for mobile.
It also builds all 180 allowed player previews, checks role restrictions,
save/cancel and reload reset, PNG drag previews, keyboard focus, the four exclusive
selector sounds and camera orbit. It checks all eight playlist entries, non-repeating playlist, independent effect mute, intentional pause and mobile
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

`src/audio-cues.js` preserves the actual previous sound assignments: the human
move used the historical `AI_piece_move.wav` file and the AI used
`user_piece_move.wav`. Normal moves now share the former; all captures use
the latter, regardless of side. Check and checkmate cues remain additional.

Visual reference: the raised terrain, stonework and vegetation of the
[Orbonne opening battle](https://shrines.rpgclassics.com/psx/fft/battles/introbattle.shtml)
in Final Fantasy Tactics for PS1. Landscape meshes and textures here are procedural.
