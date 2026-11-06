// Draws the 0.2.0 post's charts from data.js with the home page's chart markup (style.css .chart). Everything is
// looked up inside the post's own article, so the post works on its own page and in the Blog page's list of posts.
(() => {
  const D = window.POST_DATA;
  const root = document.querySelector('[data-post="0-2-0"]');
  if (!root) return;
  const byId = (id) => root.querySelector("#" + id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const num = (x) => typeof x === "number" && isFinite(x);
  const fmt = (x, unit) => (unit === "s" ? (x < 10 ? x.toFixed(2) : Math.round(x)) + " s"
    : unit === "s/min" ? (x < 1 ? x.toFixed(2) : x.toFixed(1)) + " s"
    : unit === "GB" ? x.toFixed(1) + " GB" : unit === "ms" ? (x >= 10000 ? Math.round(x / 1000) + " s" : Math.round(x).toLocaleString("en-US") + " ms") : String(Math.round(x)));
  // Marks flag competitor differences only (never Venture); "*" full size, the rest smaller.
  const marks = (m) => (m ? `<sup>${[...m].map((c) => (c === "*" ? esc(c) : `<small>${esc(c)}</small>`)).join("")}</sup>` : "");
  // A cell is a number, [number, marks], or null (not measured yet).
  const val = (c) => (Array.isArray(c) ? c[0] : c);
  const mk = (c) => (Array.isArray(c) ? c[1] : "");

  // Each chart: its data, the metric key its tabs pick, and its unit. Every chart shows all runtimes in D.series.
  const CLS = ["v", "old", "c1", "c3"];
  const CHARTS = {
    startup: { data: D.startup, metric: "hot", unit: "s" },
    stalls: { data: D.stalls, metric: "hot", unit: "s/min" },
    worst: { data: D.worst, metric: "hot", unit: "ms" },
    vram: { data: D.vram, metric: "peak", unit: "GB" },
  };

  function draw(id) {
    const C = CHARTS[id], el = byId("chart-" + id), k = C.metric;
    const games = [...C.data];
    const nums = games.flatMap((g) => g[k].map(val)).filter(num);
    const pending = !nums.length;
    // Shortest Venture 0.2.0 bar first, left to right, ranked on the chart's first tab (hot) and kept in that
    // order on every tab, so switching tabs never moves a game. Each game's bars are drawn against that game's
    // own largest value, so the bar's height is 0.2.0's share of it.
    const sk = (C.sortBy ??= k);
    const key = (g) => {
      const vals = g[sk].map(val).filter(num), x = val(g[sk][0]);
      return num(x) ? x / Math.max(...vals, 1e-9) : Infinity;
    };
    if (!pending) games.sort((a, b) => key(a) - key(b));
    el.style.setProperty("--n", games.length);
    el.classList.toggle("pending", pending);
    // Two runtimes per game leave room for upright labels; the dense layout (rotated labels) is for the home page.
    el.classList.toggle("dense", false);
    el.innerHTML = games.map((g) => {
      const v = g[k], vals = v.map(val), gmax = Math.max(...vals.filter(num), 1e-9);
      const cols = v.map((c, i) => {
        const x = val(c), name = esc(D.series[i]);
        if (c === "dnf") return `<div class="slot"><span class="rn">${name}</span><div class="col dnf" title="${name}: doesn't reach gameplay"><b>DNF</b></div></div>`;
        if (!num(x)) return `<div class="slot"><span class="rn">${name}</span><div class="col dnf" title="${name}: measuring"><b>${pending ? "–" : "soon"}</b></div></div>`;
        return `<div class="slot"><span class="rn">${name}</span><div class="col ${CLS[i]}" style="--h:${(x / gmax) * 100}%;--g:${(x / gmax) * 100}%" title="${name}: ${esc(fmt(x, C.unit))}"><b>${fmt(x, C.unit)}${marks(mk(c))}</b></div></div>`;
      }).join("");
      const sub = pending ? "Pending" : g.note || "";
      const aria = `${g.short}: ${D.series.map((r, i) => `${r} ${v[i] === "dnf" ? "doesn't reach gameplay" : num(vals[i]) ? fmt(vals[i], C.unit) : "not measured yet"}`).join(", ")}`;
      return `<div class="group" role="img" aria-label="${esc(aria)}"><div class="cols">${cols}</div><div class="gname">${esc(g.short)}<span>${esc(sub)}</span></div></div>`;
    }).join("");
    const note = byId("note-" + id);
    if (note) note.hidden = !pending;
  }
  // Headline numbers: <b data-stat="vram"></b> gets D.stats.vram.
  function stats() {
    root.querySelectorAll("[data-stat]").forEach((e) => {
      const x = D.stats && D.stats[e.dataset.stat];
      if (num(x)) e.textContent = x;
    });
  }

  // Startup strip: each gap between frames over 25 ms, drawn where it happened and as wide as it lasted, so a
  // freeze reads as a block and a stutter as a comb. Height is logarithmic from 25 ms to 3 s.
  function strip() {
    const el = byId("strip");
    if (!el || !D.strip) return;
    const { span, rows } = D.strip, W = 1000, H = 64;
    const h = (ms) => Math.max(0.12, Math.min(1, Math.log(ms / 25) / Math.log(3000 / 25))) * H;
    const ticks = [];
    for (let t = 0; t <= span; t += 1) ticks.push(t);
    el.innerHTML = rows.map(([name, gaps], i) => {
      const total = gaps.reduce((a, g) => a + g[1], 0) / 1000;
      const bars = gaps.map(([t, ms]) => {
        const x0 = Math.max(0, (t - ms / 1000) / span * W), x1 = Math.min(W, t / span * W);
        const w = Math.max(2.5, x1 - x0), y = H - h(ms);
        return `<rect x="${(x1 - w).toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${(H - y).toFixed(1)}" rx="1.5"></rect>`;
      }).join("");
      const label = `${esc(name)}: ${gaps.length} hitches, ${total.toFixed(1)} s in total`;
      return `<div class="strip-row ${i ? "v" : "old"}">
        <div class="strip-head"><span>${esc(name)}</span><b>${gaps.length} hitches · ${total.toFixed(1)} s</b></div>
        <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${label}"><line x1="0" y1="${H - 0.5}" x2="${W}" y2="${H - 0.5}"></line>${bars}</svg>
      </div>`;
    }).join("") + `<div class="strip-axis" aria-hidden="true">${ticks.map((t) => `<span style="left:${(t / span) * 100}%">${t}${t === span ? " s" : ""}</span>`).join("")}</div>`;
  }

  function drawAll() {
    Object.keys(CHARTS).filter((id) => byId("chart-" + id)).forEach(draw);
    root.querySelectorAll("[data-hw]").forEach((e) => (e.textContent = D.hw));
    stats();
    strip();
  }

  // Tabs: each tab list switches its own chart's metric.
  root.querySelectorAll(":scope [role=tab]").forEach((btn) => btn.addEventListener("click", () => {
    const group = btn.closest("[role=tablist]");
    group.querySelectorAll("[role=tab]").forEach((b) => b.setAttribute("aria-selected", b === btn));
    CHARTS[group.dataset.chart].metric = btn.dataset.metric;
    draw(group.dataset.chart);
  }));
  // Arrow keys move between tabs within a tab list.
  root.querySelectorAll(":scope [role=tablist]").forEach((list) => list.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const tabs = [...list.querySelectorAll("[role=tab]")], i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    next.focus(); next.click();
  }));
  drawAll();
})();
