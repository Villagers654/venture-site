#!/usr/bin/env python3
"""Builds the blog from blog/posts.json: the post list on the Blog page (blog/index.html), each post's date line, and the
RSS 2.0 feed at blog/feed.xml. No dependencies; run from anywhere after adding or changing a post:

    python tools/build_blog.py

A post is blog/<slug>/index.html plus one entry in blog/posts.json, newest first:
    slug       folder name under blog/, also the URL (https://venture-emu.org/blog/<slug>/)
    title      plain-text title (Blog page, feed)
    date       publication date, "YYYY-MM-DD", or null while unpublished (shown as "Date TBA" and left out
               of the feed's pubDate)
    kind       small label beside the date, e.g. "Release"
    summary    one line (Blog page, feed description)
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


def entry(post):
    s = post["slug"]
    return f'''    <li class="entry">
      <a href="{s}/">
        <p class="entry-meta">{time_tag(post)}<span>{html.escape(post.get("kind", "Post"))}</span></p>
        <div>
          <h2 class="display">{html.escape(post["title"])}</h2>
          <p>{html.escape(post["summary"])}</p>
        </div>
      </a>
    </li>'''


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
    for p in posts:
        page = os.path.join(BLOG, p["slug"], "index.html")
        if not os.path.exists(page):
            sys.exit(f"blog/{p['slug']}/index.html is missing")
        src = read(page)
        out = re.sub(r"<time data-post-date[^>]*>.*?</time>", time_tag(p), src)
        if out != src:
            write(page, out)
    index = os.path.join(BLOG, "index.html")
    src = read(index)
    a, b = "<!-- posts:start (tools/build_blog.py) -->", "<!-- posts:end -->"
    if a not in src or b not in src:
        sys.exit("blog/index.html lacks the posts markers")
    head, rest = src.split(a, 1)
    write(index, head + a + "\n" + "\n".join(entry(p) for p in posts) + "\n    " + b + rest.split(b, 1)[1])
    write(os.path.join(BLOG, "feed.xml"), feed(posts))
    print(f"{len(posts)} post(s): blog/index.html, blog/feed.xml")


if __name__ == "__main__":
    main()
