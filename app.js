// Renders the charts and game grid from data.js, and the download section from release.json
// (written by the Pages workflow from the GitHub Releases API).
(() => {
  const ALL = window.VENTURE_DATA;
  // Windows or Linux: the platform switch picks which head-to-head and grid numbers show.
  const PLAT = {
    // ran: competitor j reached gameplay; tried: it was attempted (counts toward that runtime's total).
    // list: the grid's games; testing: not yet validated on this platform (shown muted, left out of the totals).
    windows: { runtimes: ALL.runtimes, h2h: ALL.h2h, hw: null, fps: (g) => g[2], list: ALL.games, testing: () => false,
      ran: (g, j) => g[3] && g[3][j], tried: (g, j) => !g[3] || g[3][j] !== null },
    linux: { runtimes: ALL.linux.runtimes, h2h: ALL.linux.h2h, hw: ALL.linux.hw,
      testing: (g) => ALL.linux.testing.includes(g[1]),
      list: [...ALL.games, ...ALL.linux.extra].sort((a, b) => ALL.linux.testing.includes(a[1]) - ALL.linux.testing.includes(b[1])),
      fps: (g) => (ALL.linux.games[g[1]] || [null])[0], ran: (g, j) => j === 0 && (ALL.linux.games[g[1]] || [])[1],
      tried: () => true },  // Refract Waydroid was attempted on every Linux title
  };
  // Grid order (data.js "order"); on Linux the games still being tested go last.
  const rank = (g) => ALL.order.indexOf(g[1]);
  PLAT.windows.list = [...PLAT.windows.list].sort((a, b) => rank(a) - rank(b));
  PLAT.linux.list = [...PLAT.linux.list].sort((a, b) => PLAT.linux.testing(a) - PLAT.linux.testing(b) || rank(a) - rank(b));
  let D = PLAT.windows, metric = "fps";
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const marks = (m) => (m ? `<sup>${esc(m)}</sup>` : "");

  const hwDefault = $("hw").textContent;
  // A cell is [fps, low, marks] or null (did not run).
  const ran = (x) => Array.isArray(x);
  const best = (g, k) => Math.max(...g.v.slice(1).filter(ran).map((x) => x[k]));

  // Performance chart with a metric toggle.
  const MARKS = { "*": "fewer pixels", "†": "modified to run", "‡": "configuration changed to run", "§": "different field of view" };
  const TITLE = { fps: "Fastest in <em>every</em> game.", low: "Always <em>smooth.</em>" };
  const SUB = {
    fps: "Average fps. Higher is better.",
    low: "Slowest 1% of frames. Higher is better.",
  };
  // Both headlines share one height (the taller one) so the toggle below never moves.
  function fitTitle() {
    const h = $("metric-title"), cur = h.innerHTML;
    h.style.minHeight = "";
    const tall = Math.max(...Object.values(TITLE).map((t) => { h.innerHTML = t; return h.offsetHeight; }));
    h.innerHTML = cur; h.style.minHeight = tall + "px";
  }
  addEventListener("resize", fitTitle);
  document.fonts.ready.then(fitTitle);
  function chart() {
    $("legend").innerHTML = D.runtimes.map((r, i) => `<span><i class="${i ? "c" + i : "v"}"></i>${esc(r)}</span>`).join("");
    $("hw").textContent = $("hw-games").textContent = D.hw || hwDefault;
    const k = metric === "low" ? 1 : 0;
    const max = Math.max(...D.h2h.flatMap((g) => g.v.filter(ran).map((x) => x[k])));
    // One order for both metrics (by average fps) so games stay put when toggling.
    const games = [...D.h2h].sort((a, b) => a.v[0][0] - b.v[0][0]);
    // Always one row; past 30 bars (5 games of 5 runtimes) the bars, gaps and labels tighten.
    $("chart").style.setProperty("--n", games.length);
    $("chart").classList.toggle("dense", games.length * D.runtimes.length > 30);
    $("chart").innerHTML = games.map((g) => {
      const b = best(g, k), ratio = g.v[0][k] / b;
      const gmax = Math.max(...g.v.filter(ran).map((x) => x[k]));
      // Each bar sits in a slot with its runtime's name (shown only by the phone layout's horizontal rows).
      const cols = g.v.map((x, i) => `<div class="slot"><span class="rn">${esc(D.runtimes[i])}</span>${x
        ? `<div class="col ${i ? "c" + i : "v"}" style="--h:${(x[k] / max) * 100}%;--g:${(x[k] / gmax) * 100}%" title="${esc(D.runtimes[i])}: ${x[k]}"><b>${x[k]}${marks(x[2])}</b></div>`
        : `<div class="col dnf" title="${esc(D.runtimes[i])}: did not run"><b>DNF</b></div>`}</div>`).join("");
      return `<div class="group"><div class="cols">${cols}</div><div class="gname">${esc(g.short)}<span>${b > 0 ? ratio.toFixed(1) + "× faster" : "Only on Venture"}</span></div></div>`;
    }).join("");
    // Footnotes: only the marks this platform's chart uses.
    const used = D.h2h.flatMap((g) => g.v).filter(ran).map((x) => x[2] || "").join("");
    $("marks").innerHTML = Object.entries(MARKS).filter(([m]) => used.includes(m)).map(([m, t]) => `<b>${m}</b> ${t}`).join(" · ");
    $("metric-sub").textContent = SUB[metric];
    $("metric-title").innerHTML = TITLE[metric];
  }
  document.querySelectorAll("[data-metric]").forEach((btn) => btn.addEventListener("click", () => {
    document.querySelectorAll("[data-metric]").forEach((b) => b.setAttribute("aria-selected", b === btn));
    metric = btn.dataset.metric; chart();
  }));

  // Compatibility totals and grid.
  function games() {
    const G = D.list.filter((g) => !D.testing(g)), comp = D.runtimes.slice(1).map((r, j) => j);
    const total = [G.length, ...comp.map((j) => G.filter((g) => D.ran(g, j)).length)];
    const tried = [G.length, ...comp.map((j) => G.filter((g) => D.tried(g, j)).length)];
    $("totals").innerHTML = D.runtimes.map((r, i) => {
      return `<div class="t${i ? "" : " v"}"><span>${esc(r)}</span><div class="tb"><i style="width:${(total[i] / tried[i]) * 100}%"></i></div><b>${total[i]} / ${tried[i]}</b></div>`;
    }).join("");
    // Games no competitor ran (at least one attempted it).
    const only = G.filter((g) => comp.some((j) => D.tried(g, j)) && !comp.some((j) => D.ran(g, j))).length;
    $("only").hidden = !only; $("only-n").textContent = only;
    $("grid").innerHTML = D.list.map((g) => {
      const fps = D.fps(g), test = D.testing(g), img = g[1];
      return `<figure class="tile${test ? " testing" : ""}"><img src="assets/games/${img}.jpg" alt="" loading="lazy" width="640" height="360">
      <figcaption><span>${esc(g[0])}</span><b>${test ? "Testing" : fps == null ? "Runs" : fps + "<small>fps</small>"}</b></figcaption></figure>`;
    }).join("");
  }
  document.querySelectorAll("[data-platform]").forEach((btn) => btn.addEventListener("click", () => {
    document.querySelectorAll("[data-platform]").forEach((b) => b.setAttribute("aria-selected", b.dataset.platform === btn.dataset.platform));
    D = PLAT[btn.dataset.platform]; chart(); games();
  }));
  chart(); games();

  // Repository links: from release.json, else the Venture repo named on <html data-repo>.
  const repoUrl = (rel) => "https://github.com/" + ((rel && rel.repo) || document.documentElement.dataset.repo);
  const platform = (name) => (/win/i.test(name) ? "Windows" : /linux/i.test(name) ? "Linux" : "");

  // The visitor's desktop OS: Linux (not Android) gets the Linux build, everyone else Windows.
  const ua = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.userAgent || "";
  const os = /linux/i.test(ua) && !/android/i.test(navigator.userAgent || "") ? "Linux" : "Windows";
  document.querySelector("[data-dl-label]").textContent = "Download for " + os;

  // Download buttons point at the newest release's archive for that OS, else the releases page.
  function render(rel) {
    const repo = repoUrl(rel);
    document.querySelectorAll("[data-repo]").forEach((a) => (a.href = repo));
    document.querySelectorAll("[data-releases], [data-dl]").forEach((a) => (a.href = repo + "/releases"));
    document.querySelectorAll("[data-issues]").forEach((a) => (a.href = repo + "/issues"));
    const assets = ((rel && rel.assets) || []).filter((a) => /\.(zip|tar\.gz|tar\.xz|AppImage)$/i.test(a.name));
    const pick = assets.find((a) => platform(a.name) === os);
    if (!pick) return;
    document.querySelectorAll("[data-dl]").forEach((a) => (a.href = pick.url));
  }

  fetch("release.json", { cache: "no-cache" }).then((r) => (r.ok ? r.json() : null)).catch(() => null).then(render);
})();
