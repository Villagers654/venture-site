// A Share button at the right of each post's date line, on post pages and the Blog page. It opens the system share
// sheet where there is one and copies the post's link otherwise. The link is the post's own page.
(() => {
  const svg = (body) => '<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + body + '</svg>';
  const icon = svg('<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4"/><path d="m15.4 6.5-6.8 4"/>');
  const done = svg('<path d="M20 6 9 17l-5-5"/>');
  for (const article of document.querySelectorAll(".article")) {
    const meta = article.querySelector(".meta");
    if (!meta) continue;
    const title = article.querySelector("h1");
    const link = title && title.querySelector("a");
    const url = new URL(link ? link.getAttribute("href") : location.pathname, location.href).href;
    const name = title ? title.textContent.trim() : document.title;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "share";
    button.innerHTML = icon;
    button.title = "Share";
    button.setAttribute("aria-label", "Share");
    const show = (html, text) => { button.innerHTML = html; button.title = text; button.setAttribute("aria-label", text); };
    let reset = 0;
    button.addEventListener("click", async () => {
      if (navigator.share) {
        try { await navigator.share({ title: name, url }); return; } catch (e) { if (e && e.name === "AbortError") return; }
      }
      try { await navigator.clipboard.writeText(url); show(done, "Link copied"); }
      catch { show(icon, "Copy failed"); }
      clearTimeout(reset);
      reset = setTimeout(() => show(icon, "Share"), 2000);
    });
    const row = document.createElement("div");
    row.className = "meta-row";
    meta.replaceWith(row);
    row.append(meta, button);
  }
})();
