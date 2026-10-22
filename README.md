# Venture website

The website for [Venture](https://github.com/Villagers654/Venture). Plain HTML, CSS and JavaScript: no build step, no dependencies.

## Run it

```sh
python -m http.server 8765
```

Then open http://localhost:8765.

## Files

| File | What it holds |
|---|---|
| `index.html` | Page structure and all copy |
| `style.css` | Styles. Colours are the launcher's tokens at the top |
| `data.js` | Benchmark and compatibility numbers behind the chart and game grid |
| `app.js` | Renders the chart and grid, and points the download buttons at the latest release |
| `assets/` | Logo, hero image, share image and game art (`games/<id>.jpg`, 640×360) |

To add a game, put its art in `assets/games/` and add a `[name, art id, fps, [other runtimes]]` row to `games` in `data.js`.

## Releases

`.github/workflows/pages.yml` deploys on every push to `main` and hourly. It writes `release.json` from the
Venture repo's newest release, and `app.js` points the download buttons at it. To test the buttons locally,
create a `release.json` in the same shape; it is gitignored.

## License

GPL-3.0. Game names and art belong to their owners.
