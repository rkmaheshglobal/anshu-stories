# Anshika Mahesh — Stories

A static website for young author **Anshika Mahesh**: a story library you can browse, then read like an open hardback book.

Repository: [rkmaheshglobal/anshu-stories](https://github.com/rkmaheshglobal/anshu-stories)

This repo holds the **site source**. The live website is public at [https://anshikamahesh.com/](https://anshikamahesh.com/). The GitHub repo can be **private** (Cloudflare Pages). Notebooks, scans, PDFs, and working drafts in the parent folder stay off GitHub.

## What’s in the site

| Page | What it is |
| --- | --- |
| `index.html` | Home — just arrived, start here, series |
| `stories.html` | Full catalogue (search + mood filters) |
| `about.html` | About Anshika |
| `newsletter.html` | Story Notes signup |
| `connect.html` | Parent-managed contact |
| `stories/` | Individual books (two-page reader) |
| `invitations/` | Birthday invite |

Live files live in [`anshika-mahesh-site/`](anshika-mahesh-site/).

## Requirements

- **Python 3** (for the local preview server), or any static file server
- A browser
- No `npm install` — there are no Node dependencies

## Clone

```bash
git clone https://github.com/rkmaheshglobal/anshu-stories.git
cd anshu-stories
```

## Run locally

Serve **from the site folder**, not the repo root. If you start the server in the parent folder, Home may load but `/stories.html` and the books return **404**.

```bash
cd anshika-mahesh-site
python3 -m http.server 8080
```

Then open:

- Home — [http://localhost:8080](http://localhost:8080)
- Stories — [http://localhost:8080/stories.html](http://localhost:8080/stories.html)

Stop the server with `Ctrl+C`.

To use another port:

```bash
python3 -m http.server 5500
```

Visit `http://localhost:5500` instead.

You can also open `anshika-mahesh-site/index.html` directly in a browser. A local server is better: story images and the book reader load more reliably.

## Publish

Cloudflare deploys `anshika-mahesh-site/` from `main` as static assets (`wrangler.toml` `[assets]`). Step-by-step: [CUSTOM-DOMAIN.md](CUSTOM-DOMAIN.md).

1. Connect this GitHub repo to a Cloudflare Pages project (build output: `anshika-mahesh-site`, no build command).
2. Confirm the `*.pages.dev` preview.
3. Remove `anshikamahesh.com` from GitHub Pages, delete GitHub A/CNAME records, then add the domain under Pages → Custom domains.
4. Live URL: [https://anshikamahesh.com/](https://anshikamahesh.com/).
5. After that works, make this GitHub repo **private**.

GitHub Pages is no longer used. Cloudflare Pages deploys on every push to `main`. A red **GitHub Pages** Action on an older commit can be ignored.

Before going public:

1. Confirm FormSubmit’s first activation email at rkmaheshglobal@gmail.com (one-time, after the first Story Notes signup).
2. Create the GoatCounter site code `rkmaheshglobal` if you want live reader stats.

## Safety defaults

- Parent-managed contact
- No public comments
- Newsletter copy notes unsubscribe and a parent-managed list
- Anonymous visit counts via GoatCounter (no names, no cookies); see `privacy.html`

## Reader stats

The live site records page views and three book events (`story_open`, `story_halfway`, `story_finish`). Localhost is skipped.

1. Create a free site at [goatcounter.com](https://www.goatcounter.com) with code **`rkmaheshglobal`** (already created).
2. If you pick a different code, change `GOATCOUNTER_CODE` in `anshika-mahesh-site/js/main.js`.
3. Open **Settings → Sites** in GoatCounter and set the site URL to `https://anshikamahesh.com/` (keep the GitHub Pages URL listed too until the redirect is in place).
4. After a visit to the live site (not localhost), the dashboard shows pages; events appear as paths like `story_open/shy-girl`. Your own visits may be hidden if Do Not Track is on or if GoatCounter is set to ignore you.
