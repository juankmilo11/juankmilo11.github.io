# FCT source project

This is the source for the deployed game at `/FCT/` in the `juankmilo11.github.io` site repository.

Install dependencies with `npm ci`, run the local preview with `npm run dev`, and build with `npm run build`. The Vite build writes the production site into the repository's existing `FCT/` deployment directory. Keep `node_modules/` and generated bundles out of this source directory's Git history.

Run `npm test` to check terrain geometry, the four central summit squares, and
move/capture audio for both sides (including en passant).

## Character appearances

The menu's **Seleccionar piezas** dialog replaces the old player/rival card.
The resource catalog has 16 characters and 70 original variants. The player
chooses from all 70 variants within role restrictions: Squire for pawns, Knight for
rooks, Dragoon for knights, and White Mage / Black Mage / Summoner for bishops.
The queen can be Agrias or Teta; the king can be Ramza or Delita, each with their
original palettes. The opponent uses the other royal character. Choices are cosmetic and kept only in page memory: **Guardar**
applies the draft, **Salir**/Escape discards it, and reloading resets defaults.

The rival chooses the most contrasting available palette for each role.
Only the player's character appears in the preview. Color choices use accessible
swatches without visible labels. Piece identities remain available through the
focus inspector and square descriptions, without badges below the figures.
The centered 2D sprite, drag follower and drop preview all use the selected PNG.
Promotion uses the selected appearance of the promoted role.

`src/character-volume.js` reconstructs a solid voxel hull from the original
front, back and profile silhouettes. Shared voxel faces are removed; neighboring
voxels touch without the old lateral gaps. Each view supplies its own colors,
including the actual back. This is a stylized voxel reconstruction, not an
imported rigged character mesh. Head, torso, arms and legs are articulated for
subtle independent marching in place, alternating feet, arms and breathing. Reduced-motion
preferences stop those animations and default preview rotation.
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
It detects palette paste offsets and writes 70 transparent three-view atlases,
70 menu thumbnails and `sprites/characters/catalog.json`. Names and color
swatches are maintained in `scripts/character-palettes.json`. Commit the generated
files and rebuild Vite. The earlier `sprites/cropped/` and `crop-sprites.ps1`
are legacy extracts; the new renderer reads `sprites/characters/`.

The 3D board has an irregular rounded rise, from a low perimeter to
`d4`, `e4`, `d5`, `e5`. Elevation does not change chess rules. Both square colors
use closely matched grass greens in both views. `src/environment.js` builds the textured earth,
grass, weathered stone, ruined arch and vegetation procedurally; there are no
external texture requests. Capture galleries remain clear of decorations.

The board, grassy capture banks and field share a texture, UV scale and green
palette. Flat turf patches have irregular edges, joined by triangulated seams
and broad, asymmetric shoulders. The island has one continuous cliff wall that
meets its irregular perimeter, replacing stacked cylinders. The four summit squares
and flat piece positions are preserved. Seams also accept clicks and drops.
`src/field-life.js` scatters tiny stones, mud and moss on selected dark squares.
A small flock crosses occasionally behind the field; reduced-motion mode
disables it. These decorations do not participate in raycasting or chess rules.
`src/cosmos.js` adds an infinite-distance star field, a red planet, a ringed
planet, Earth and occasional meteors. The ring is a tilted 3D annulus; the globe
writes depth so it hides the rear arc. The spiral galaxy rotates inside a fixed
elliptical projection, making one turn in about nine minutes.
Their directions change with camera orbit; they stay behind the playing field.
Reduced-motion mode retains a static sky without twinkling or meteors.
Earth uses NASA's Blue Marble map (credits in `docs/art-assets.md`), uploaded at
1024 × 512 to keep GPU memory small. Bird flocks first appear after eight seconds,
cross for thirteen seconds, then return after a randomized 14–26 second gap.

Pawns are slightly smaller: 0.84 world units versus 0.92 for ordinary pieces,
with the same reduction in 2D. Queens and kings keep their larger sizes.
`src/piece-values.js` defines the material points used by both the HUD and AI:
pawn 1, rook 4, knight/bishop 3, queen 9 (the king has no material score).
The AI retains its small positional/minor-piece adjustments.

## Music and effect levels

`src/audio-system.js` owns the two independent panels: music and sound effects.
The music player has a level slider, play/pause, previous/next and current title;
the effects panel has its own level and mute. Piece selection/dragging uses the
normal movement cue at 34% of the chosen FX level; actual moves keep that level.

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
opponent's piece strip. A ResizeObserver positions audio controls below it.

Optional headless browser QA (requires Playwright and Microsoft Edge):

```powershell
node scripts/qa-fct.cjs
node scripts/qa-fct-cosmos.cjs
```

Run from the repository root after building. If Playwright is outside the normal
module search path, set `PLAYWRIGHT_MODULE_PATH` to its package directory.
`FCT_QA_OUTPUT` sets the screenshot directory (default: OS temp directory).
The script tests actual moves, review/resume and HUD overlap at desktop, tablet,
320/390 px mobile, and landscape sizes, with touch emulation for mobile.
It also builds all 70 allowed player previews, checks role restrictions,
save/cancel and reload reset, PNG drag previews, keyboard focus, the four exclusive
selector sounds and camera orbit. It checks all eight playlist entries, previous/
next history, independent effect mute, music level, intentional pause and mobile
panel bounds. Real AI games cover the normal
flow. Scripted opponent replies exercise the app's castling, en passant,
promotion, captures, mate, review/replay and new-game flows in both mobile
orientations. These browser tests emulate mobile; they do not replace testing
on physical iOS/Android hardware. `FCT_QA_VIEWER_ONLY=1` runs just the preview checks.
The cosmos check uses a local Vite server and the real WebGL renderer to compare
ring pixels against a globe-only image, verifying rear occlusion and front
visibility. It also checks slow galaxy rotation, reduced motion and Earth loading,
and saves sky close-ups for visual inspection.

`src/audio-cues.js` preserves the actual previous sound assignments: the human
move used the historical `AI_piece_move.wav` file and the AI used
`user_piece_move.wav`. Normal moves now share the former; all captures use
the latter, regardless of side. Check and checkmate cues remain additional.

Visual reference: the raised terrain, stonework and vegetation of the
[Orbonne opening battle](https://shrines.rpgclassics.com/psx/fft/battles/introbattle.shtml)
in Final Fantasy Tactics for PS1. Landscape meshes and textures here are procedural.
