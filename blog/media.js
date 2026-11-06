// Blog media, on post pages and the Blog page's list of posts: images and videos start loading about two screens
// before they scroll into view, so nothing is still loading when it arrives, and looping clips play only near the
// screen. With reduced motion, clips don't play by themselves and show their controls instead.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clips = [...document.querySelectorAll(".article video[autoplay]")];
  for (const v of clips) {
    v.removeAttribute("autoplay");
    v.preload = "none";
    if (reduce) { v.controls = true; v.preload = "metadata"; }
  }
  const imgs = [...document.querySelectorAll('.article img[loading="lazy"]')];
  if (!("IntersectionObserver" in window)) {
    imgs.forEach((i) => (i.loading = "eager"));
    if (!reduce) clips.forEach((v) => { v.preload = "auto"; v.play().catch(() => {}); });
    return;
  }
  // Two screens ahead: start loading. Images keep what they loaded; clips pause once well out of view.
  const ahead = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const el = e.target;
      if (el.tagName === "IMG") {
        if (e.isIntersecting) { el.loading = "eager"; ahead.unobserve(el); }
      } else if (e.isIntersecting) {
        if (el.preload !== "auto") el.preload = "auto";
        if (!reduce && el.paused) el.play().catch(() => {});
      } else if (!el.paused) {
        el.pause();
      }
    }
  }, { rootMargin: "200% 0px" });
  imgs.forEach((i) => ahead.observe(i));
  clips.forEach((v) => ahead.observe(v));
})();
