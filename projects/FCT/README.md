# FCT source project

This is the source for the deployed game at `/FCT/` in the `juankmilo11.github.io` site repository.

Install dependencies with `npm ci`, run the local preview with `npm run dev`, and build with `npm run build`. The Vite build writes the production site into the repository's existing `FCT/` deployment directory. Keep `node_modules/` and generated bundles out of this source directory's Git history.

Run `npm test` to check terrain geometry, the four central summit squares, and
move/capture audio for both sides (including en passant).

## Character appearances

The menu's **Seleccionar piezas** dialog replaces the old player/rival card.
The resource catalog has 16 characters and 70 original variants. The player
chooses from 64 variants within role restrictions: Squire for pawns, Knight for
rooks, Dragoon for knights, and White Mage / Black Mage / Summoner for bishops.
The queen is Agrias and the king is Ramza. Their opposing royal characters are
Teta and Delita. Choices are cosmetic and kept only in page memory: **Guardar**
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
subtle idle breathing and walking; idle feet remain planted. Reduced-motion
preferences stop those animations and default preview rotation.
The left-facing profile is mapped anteriorly on both sides; rear head surfaces
always sample the back projection so facial colors do not appear on the nape.

Model geometries are shared by appearance, with reference counts and a bounded
cache of inactive variants. The preview renders only while its dialog is open;
the hidden board does not keep rendering behind the menu. Mobile provides a
**Ver 3D** shortcut after scrolling the catalog. The selector exclusively uses
`menu1.wav` for opening/exiting, `menu2.wav` for role/character/preview navigation,
`menu3.wav` for color/rotation, and `menu4.wav` for saving. These cues interrupt
one another instead of overlapping. The source WAV files live in `public/audio/`
and are copied to `FCT/audio/` by Vite. Other game controls keep their prior cues.

The menu uses a locally served parchment illustration and the OFL-licensed
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

During move review a small pause notice appears inside the review controls.
It stays visible even at the latest position until the player presses **Volver**.
The HUD reserves its height above the scene so the notice cannot cover the
opponent's piece strip. A ResizeObserver positions audio controls below it.

Optional headless browser QA (requires Playwright and Microsoft Edge):

```powershell
node scripts/qa-fct.cjs
```

Run from the repository root after building. If Playwright is outside the normal
module search path, set `PLAYWRIGHT_MODULE_PATH` to its package directory.
`FCT_QA_OUTPUT` sets the screenshot directory (default: OS temp directory).
The script tests actual moves, review/resume and HUD overlap at desktop, tablet,
320/390 px mobile, and landscape sizes, with touch emulation for mobile.
It also builds all 64 allowed player previews, checks role restrictions,
save/cancel and reload reset, PNG drag previews, keyboard focus, the four exclusive
selector sounds and camera orbit. Real AI games cover the normal
flow. Scripted opponent replies exercise the app's castling, en passant,
promotion, captures, mate, review/replay and new-game flows in both mobile
orientations. These browser tests emulate mobile; they do not replace testing
on physical iOS/Android hardware. `FCT_QA_VIEWER_ONLY=1` runs just the preview checks.

`src/audio-cues.js` preserves the actual previous sound assignments: the human
move used the historical `AI_piece_move.wav` file and the AI used
`user_piece_move.wav`. Normal moves now share the former; all captures use
the latter, regardless of side. Check and checkmate cues remain additional.

Visual reference: the raised terrain, stonework and vegetation of the
[Orbonne opening battle](https://shrines.rpgclassics.com/psx/fft/battles/introbattle.shtml)
in Final Fantasy Tactics for PS1. Landscape meshes and textures here are procedural.
