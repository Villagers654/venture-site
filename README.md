# Venture website

The website for [Venture](https://github.com/Villagers654/Venture).

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

