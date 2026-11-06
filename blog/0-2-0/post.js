// Draws the 0.2.0 post's two charts from data.js with the home page's chart markup (style.css .chart),
// and gives the Controls clip a pause button.
(() => {
  const D = window.POST_DATA;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const num = (x) => typeof x === "number" && isFinite(x);
  const fmt = (x, unit) => (unit === "s" ? (x < 10 ? x.toFixed(1) : Math.round(x)) + " s" : String(Math.round(x)));

  // Each chart: its data, the metric key its tabs pick, and how a 0.2.0 gain reads.
  const CHARTS = {
    stutter: { data: D.stutter, metric: "first", unit: "s", lower: true,
      gain: (n, o) => (o <= 0 ? "" : n <= o ? Math.round((1 - n / o) * 100) + "% less" : Math.round((n / o - 1) * 100) + "% more") },
    fps: { data: D.fps, metric: "fps", unit: "fps", lower: false,
      gain: (n, o) => (o <= 0 ? "" : n >= o ? (n / o).toFixed(1) + "× faster" : Math.round((1 - n / o) * 100) + "% slower") },
  };

  function draw(id) {
    const C = CHARTS[id], el = document.getElementById("chart-" + id), k = C.metric;
    const games = [...C.data];
    const pending = !games.length || games.some((g) => !g[k].every(num));
    if (!pending) games.sort((a, b) => (C.lower ? b[k][1] - a[k][1] : a[k][1] - b[k][1]));
    const max = pending ? 1 : Math.max(...games.flatMap((g) => g[k]));
    el.style.setProperty("--n", games.length);
    el.classList.toggle("pending", pending);
    el.innerHTML = games.map((g) => {
      const v = g[k], gmax = pending ? 1 : Math.max(...v);
      const cols = v.map((x, i) => {
        const h = pending ? 62 : (x / max) * 100, w = pending ? 62 : (x / gmax) * 100;
        const label = pending ? "–" : fmt(x, C.unit);
        return `<div class="slot"><span class="rn">${esc(D.versions[i])}</span><div class="col ${i ? "old" : "v"}" style="--h:${h}%;--g:${w}%"><b>${label}</b></div></div>`;
      }).join("");
      const sub = pending ? "Pending" : C.gain(v[0], v[1]);
      const aria = pending ? `${g.short}: not measured yet`
        : `${g.short}: ${D.versions.map((r, i) => `${r} ${fmt(v[i], C.unit)}`).join(", ")}`;
      return `<div class="group" role="img" aria-label="${esc(aria)}"><div class="cols">${cols}</div><div class="gname">${esc(g.short)}<span>${esc(sub)}</span></div></div>`;
    }).join("");
    document.getElementById("note-" + id).hidden = !pending;
  }
  function drawAll() {
    Object.keys(CHARTS).forEach(draw);
    document.querySelectorAll("[data-hw]").forEach((e) => (e.textContent = D.hw));
  }

  // Tabs: each tab list switches its own chart's metric.
  document.querySelectorAll(".article [role=tab]").forEach((btn) => btn.addEventListener("click", () => {
    const group = btn.closest("[role=tablist]");
    group.querySelectorAll("[role=tab]").forEach((b) => b.setAttribute("aria-selected", b === btn));
    CHARTS[group.dataset.chart].metric = btn.dataset.metric;
    draw(group.dataset.chart);
  }));
  // Arrow keys move between tabs within a tab list.
  document.querySelectorAll(".article [role=tablist]").forEach((list) => list.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const tabs = [...list.querySelectorAll("[role=tab]")], i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    next.focus(); next.click();
  }));
  drawAll();

  // Clip: muted loop; paused for reduced motion, with a button either way.
  document.querySelectorAll(".clip").forEach((fig) => {
    const v = fig.querySelector("video"), b = fig.querySelector("button");
    const sync = () => { b.textContent = v.paused ? "Play" : "Pause"; b.setAttribute("aria-label", (v.paused ? "Play" : "Pause") + " the clip"); };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { v.removeAttribute("autoplay"); v.pause(); }
    b.addEventListener("click", () => (v.paused ? v.play() : v.pause()));
    v.addEventListener("play", sync); v.addEventListener("pause", sync); sync();
  });
})();
