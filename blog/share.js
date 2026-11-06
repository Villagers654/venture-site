// A Share button at the right of each post's date line, on post pages and the Blog page. It opens the system share
// sheet where there is one and copies the post's link otherwise. The link is the post's own page.
(() => {
  const icon = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 8 5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>';
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
    button.innerHTML = icon + "<span>Share</span>";
    const label = button.querySelector("span");
    let reset = 0;
    button.addEventListener("click", async () => {
      if (navigator.share) {
        try { await navigator.share({ title: name, url }); return; } catch (e) { if (e && e.name === "AbortError") return; }
      }
      try { await navigator.clipboard.writeText(url); label.textContent = "Link copied"; }
      catch { label.textContent = "Copy failed"; }
      clearTimeout(reset);
      reset = setTimeout(() => (label.textContent = "Share"), 2000);
    });
    const row = document.createElement("div");
    row.className = "meta-row";
    meta.replaceWith(row);
    row.append(meta, button);
  }
})();
