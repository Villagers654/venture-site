// Renders the charts and game grid from data.js, and the download section from release.json
// (written by the Pages workflow from the GitHub Releases API).
(() => {
  const D = window.VENTURE_DATA;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const marks = (m) => (m ? `<sup>${esc(m)}</sup>` : "");

  const best = (g, k) => Math.max(...g.v.slice(1).filter(Boolean).map((x) => x[k]));

  // Performance chart with a metric toggle.
  $("legend").innerHTML = D.runtimes.map((r, i) => `<span><i class="${i ? "c" + i : "v"}"></i>${esc(r)}</span>`).join("");
  const SUB = {
    fps: "Average fps. Higher is better.",
    low: "Slowest 1% of frames. Higher is better.",
  };
  function chart(metric) {
    const k = metric === "low" ? 1 : 0;
    const max = Math.max(...D.h2h.flatMap((g) => g.v.filter(Boolean).map((x) => x[k])));
    // One order for both metrics (by average fps) so games stay put when toggling.
    const games = [...D.h2h].sort((a, b) => a.v[0][0] - b.v[0][0]);
    $("chart").innerHTML = games.map((g) => {
      const ratio = g.v[0][k] / best(g, k);
      const cols = g.v.map((x, i) => x
        ? `<div class="col ${i ? "c" + i : "v"}" style="--h:${(x[k] / max) * 100}%" title="${esc(D.runtimes[i])}: ${x[k]}"><b>${x[k]}${marks(x[2])}</b></div>`
        : `<div class="col dnf" title="${esc(D.runtimes[i])}: did not run"><b>DNF</b></div>`).join("");
      return `<div class="group"><div class="cols">${cols}</div><div class="gname">${esc(g.short)}<span>${ratio.toFixed(1)}× faster</span></div></div>`;
    }).join("");
    $("metric-sub").textContent = SUB[metric];
  }
  document.querySelectorAll("[data-metric]").forEach((btn) => btn.addEventListener("click", () => {
    document.querySelectorAll("[data-metric]").forEach((b) => b.setAttribute("aria-selected", b === btn));
    chart(btn.dataset.metric);
  }));
  chart("fps");

  // Compatibility totals and grid.
  const total = [D.games.length, ...[0, 1, 2, 3].map((j) => D.games.filter((g) => g[3] && g[3][j]).length)];
  $("totals").innerHTML = D.runtimes.map((r, i) => {
    return `<div class="t${i ? "" : " v"}"><span>${esc(r)}</span><div class="tb"><i style="width:${(total[i] / D.games.length) * 100}%"></i></div><b>${total[i]} / ${D.games.length}</b></div>`;
  }).join("");
  $("grid").innerHTML = D.games.map(([name, img, fps]) =>
    `<figure class="tile"><img src="assets/games/${img}.jpg" alt="" loading="lazy" width="640" height="360">
      <figcaption><span>${esc(name)}</span><b>${fps}<small>fps</small></b></figcaption></figure>`).join("");

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
