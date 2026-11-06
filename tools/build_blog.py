#!/usr/bin/env python3
"""Builds the blog from blog/posts.json: the Blog page (blog/index.html, every post in full, newest first, in one
scrolling page), each post's date line, and the RSS 2.0 feed at blog/feed.xml. No dependencies; run from anywhere after adding or changing a post:

    python tools/build_blog.py

A post is blog/<slug>/index.html plus one entry in blog/posts.json, newest first:
    slug       folder name under blog/, also the URL (https://venture-emu.org/blog/<slug>/)
    title      plain-text title (feed)
    date       publication date, "YYYY-MM-DD", or null while unpublished (shown as "Date TBA" and left out
               of the feed's pubDate)
    kind       small label beside the date, e.g. "Release"
    summary    one line (feed description)

Each post's page keeps its own URL (links, the feed and sharing point there). The Blog page copies each post's
<article> with its links and media pointed into the post's folder, the post title linking to that page, and loads
the post's own scripts (scripts in its <head> with a relative src). A post's scripts must work inside its article
(look things up under [data-post="<slug>"]), since the Blog page holds every post.
    image      share image, relative to the post folder (feed enclosure; 1200x630 JPEG like og:image)
"""
import email.utils, html, json, os, re, sys
from datetime import datetime, timezone

SITE = "https://venture-emu.org"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLOG = os.path.join(ROOT, "blog")


def read(p):
    with open(p, encoding="utf-8") as f:
        return f.read()


def write(p, s):
    with open(p, "w", encoding="utf-8", newline="\n") as f:
        f.write(s)


def date_of(post):
    d = post.get("date")
    return datetime.strptime(d, "%Y-%m-%d").replace(hour=12, tzinfo=timezone.utc) if d else None


def time_tag(post):
    d = date_of(post)
    if not d:
        return '<time data-post-date class="tbd" datetime="">Date TBA</time>'
    return f'<time data-post-date datetime="{d:%Y-%m-%d}">{d:%B} {d.day}, {d.year}</time>'


def rebase(fragment, slug):
    """Points a post's relative links and media (written for blog/<slug>/) at the same files from blog/."""
    def fix(url):
        if re.match(r"^(?:[a-z]+:|//|#|/)", url):
            return url
        if url.startswith("../../"):
            return "../" + url[6:]
        if url.startswith("../"):
            return url[3:] or "./"
        return f"{slug}/{url}"
    fragment = re.sub(r'\b(src|href|poster)="([^"]*)"', lambda m: f'{m.group(1)}="{fix(m.group(2))}"', fragment)
    return re.sub(r'\bsrcset="([^"]*)"', lambda m: 'srcset="' + ", ".join(
        " ".join([fix(part.split()[0])] + part.split()[1:]) for part in m.group(1).split(",")) + '"', fragment)


def listed(post, page):
    """The post's article as it appears on the Blog page: no breadcrumb, the title links to the post's own page."""
    s = post["slug"]
    art = re.search(r"<article\b.*?</article>", page, re.S)
    if not art:
        sys.exit(f"blog/{s}/index.html has no <article>")
    a = art.group(0)
    a = re.sub(r'(<p class="meta">)\s*<a href="\.\./">Blog</a>\s*·\s*', r"\1", a, count=1)
    a = rebase(a, s)
    a = re.sub(r"<h1>(.*?)</h1>", lambda m: f'<h1><a href="{s}/">{m.group(1)}</a></h1>', a, count=1, flags=re.S)
    if "data-post=" not in a[:200]:
        a = a.replace("<article", f'<article data-post="{s}"', 1)
    a = a.replace("<article", f'<article id="{s}"', 1)
    return "    " + a


def scripts(post, page):
    head = page.split("</head>", 1)[0]
    return [f'{post["slug"]}/{src}' for src in re.findall(r'<script src="([^":]+)"[^>]*>', head) if not src.startswith("../")]


def feed(posts):
    x = lambda s: html.escape(s, quote=False)
    dated = [date_of(p) for p in posts if date_of(p)]
    # lastBuildDate follows the content (newest post), so rebuilding without changes leaves the file unchanged.
    last = max(dated) if dated else datetime(2026, 11, 1, 12, tzinfo=timezone.utc)
    items = []
    for p in posts:
        url = f"{SITE}/blog/{p['slug']}/"
        lines = [f"      <title>{x(p['title'])}</title>", f"      <link>{url}</link>",
                 f'      <guid isPermaLink="true">{url}</guid>']
        d = date_of(p)
        if d:
            lines.append(f"      <pubDate>{email.utils.format_datetime(d)}</pubDate>")
        lines.append(f"      <description>{x(p['summary'])}</description>")
        img = os.path.join(BLOG, p["slug"], p["image"])
        if os.path.exists(img):
            lines.append(f'      <enclosure url="{url}{x(p["image"])}" length="{os.path.getsize(img)}" type="image/jpeg"/>')
        items.append("    <item>\n" + "\n".join(lines) + "\n    </item>")
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Venture Blog</title>
    <link>{SITE}/blog/</link>
    <description>The Venture blog: releases and news from the Meta Quest emulator for PC VR.</description>
    <language>en</language>
    <lastBuildDate>{email.utils.format_datetime(last)}</lastBuildDate>
    <atom:link href="{SITE}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>{SITE}/assets/og.jpg</url>
      <title>Venture Blog</title>
      <link>{SITE}/blog/</link>
    </image>
{chr(10).join(items)}
  </channel>
</rss>
'''


def main():
    posts = json.loads(read(os.path.join(BLOG, "posts.json")))
    pages = []
    for p in posts:
        page = os.path.join(BLOG, p["slug"], "index.html")
        if not os.path.exists(page):
            sys.exit(f"blog/{p['slug']}/index.html is missing")
        src = read(page)
        out = re.sub(r"<time data-post-date[^>]*>.*?</time>", time_tag(p), src)
        if out != src:
            write(page, out)
        pages.append(out)
    index = os.path.join(BLOG, "index.html")
    src = read(index)
    sep = '\n\n    <hr class="post-sep">\n\n'
    body = sep.join(listed(p, page) for p, page in zip(posts, pages))
    js = [f'  <script src="{x}" defer></script>' for p, page in zip(posts, pages) for x in scripts(p, page)]
    js.append('  <script src="media.js" defer></script>')
    js.append('  <script src="share.js" defer></script>')
    for a, b, new in (("<!-- posts:start (tools/build_blog.py) -->", "<!-- posts:end -->", "\n" + body + "\n    "),
                      ("<!-- scripts:start (tools/build_blog.py) -->", "<!-- scripts:end -->", "\n" + "\n".join(js) + "\n  ")):
        if a not in src or b not in src:
            sys.exit(f"blog/index.html lacks the {a} marker")
        head, rest = src.split(a, 1)
        src = head + a + new + b + rest.split(b, 1)[1]
    write(index, src)
    write(os.path.join(BLOG, "feed.xml"), feed(posts))
    print(f"{len(posts)} post(s): blog/index.html, blog/feed.xml")


if __name__ == "__main__":
    main()
