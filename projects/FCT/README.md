# FCT source project

This is the source for the deployed game at `/FCT/` in the `juankmilo11.github.io` site repository.

Install dependencies with `npm ci`, run the local preview with `npm run dev`, and build with `npm run build`. The Vite build writes the production site into the repository's existing `FCT/` deployment directory. Keep `node_modules/` and generated bundles out of this source directory's Git history.

Run `npm test` to check terrain symmetry, the four central summit squares, and
move/capture audio for both sides (including en passant).

The 3D board has four decorative height levels, from a low perimeter to
`d4`, `e4`, `d5`, `e5`. Elevation does not change chess rules. Light squares
use light brown in both views. `src/environment.js` builds the textured earth,
grass, weathered stone, ruined arch and vegetation procedurally; there are no
external texture requests. Capture galleries remain clear of decorations.

`src/audio-cues.js` preserves the actual previous sound assignments: the human
move used the historical `AI_piece_move.wav` file and the AI used
`user_piece_move.wav`. Normal moves now share the former; all captures use
the latter, regardless of side. Check and checkmate cues remain additional.

Visual reference: the raised terrain, stonework and vegetation of the
[Orbonne opening battle](https://shrines.rpgclassics.com/psx/fft/battles/introbattle.shtml)
in Final Fantasy Tactics for PS1. Landscape meshes and textures here are procedural.
