# juankmilo11.github.io

This repository contains the shared landing page and two projects:

- **FCT** source: `projects/FCT/`; the deployable site is built into `FCT/` and served at `/FCT/`.
- **PACA** source: `projects/PACA/`; its static page is served from `pages/paula/`.

Build FCT from `projects/FCT/` with `npm ci` followed by `npm run build`. The build writes the production assets to the repository's `FCT/` folder. PACA is static HTML, CSS, and JavaScript; sync its source files to `pages/paula/` to publish updates.
