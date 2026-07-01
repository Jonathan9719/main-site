# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static personal achievement site that doubles as a resume. Plain HTML/CSS/JS —
**no framework, no build step, no dependencies.** Hosted on GitHub Pages.

## Commands

There is no build or test step. To develop, serve the folder over HTTP (the page
`fetch()`es `data/resume.json`, which fails under `file://`):

```bash
python -m http.server 8000    # then open http://localhost:8000
```

Deploy: push to GitHub; Pages serves the repo root directly. `.nojekyll` is
present so `assets/` are served verbatim (no Jekyll processing).

## Architecture

The site is **data-driven**: all content lives in `data/resume.json`, and
`assets/js/app.js` renders it into the DOM at runtime. The three-file separation
is the key thing to understand:

- `data/resume.json` — the single source of truth for content. Top-level keys:
  `basics`, `highlights`, `experience`, `projects`, `achievements`, `skills`,
  `education`. Content changes should almost always be edits to this file only.
- `index.html` — static shell with empty section containers (e.g.
  `#experience-list`) that `app.js` fills. Also uses `data-bind="basics.name"`
  attributes for simple text substitution.
- `assets/js/app.js` — fetches the JSON, then one `render*()` function per
  section maps data → DOM. `bindText()` handles `data-bind` attributes.

### Conventions that matter

- **All rendered strings pass through `esc()`** before being injected as HTML.
  Preserve this when adding renderers — the JSON is treated as untrusted input.
- Adding a new section = add data to the JSON + a container in `index.html` + a
  `render*()` call in `main()`. Don't reach for a framework.
- Theme (light/dark) is CSS-variable based in `:root` / `[data-theme="dark"]`
  and persisted to `localStorage`; JS only toggles the `data-theme` attribute.
