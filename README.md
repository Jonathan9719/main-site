# Personal Site & Resume

A static, dependency-free personal achievement site that doubles as a resume.
All content lives in [`data/resume.json`](data/resume.json) — edit that file and
the page re-renders it. No build step, no framework.

## Edit content

Open `data/resume.json` and update the sections: `basics`, `highlights`,
`experience`, `projects`, `achievements`, `skills`, `education`. The layout
updates automatically.

## Run locally

The page fetches `data/resume.json`, so it must be served over HTTP —
opening `index.html` directly via `file://` will fail (browser CORS).

```bash
# Python (any 3.x)
python -m http.server 8000
# then open http://localhost:8000
```

Any static server works (`npx serve`, VS Code Live Server, etc.).

## Deploy to GitHub Pages

1. Push this folder to a GitHub repo.
2. Repo **Settings → Pages → Build and deployment**.
3. Source: **Deploy from a branch**, Branch: `main`, Folder: `/ (root)`.
4. Save. The site publishes at `https://<user>.github.io/<repo>/`.

Because it's plain static files at the repo root, no Actions workflow is needed.

## Structure

```
index.html            # markup + section placeholders
assets/css/style.css  # design tokens (light/dark) + layout
assets/js/app.js      # fetches JSON and renders the DOM
data/resume.json      # ← all content lives here
```
