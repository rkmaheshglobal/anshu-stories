# Anshika Mahesh — Stories

A static website for young author **Anshika Mahesh**: a story library you can browse, then read like an open hardback book.

Repository: [rkmaheshglobal/anshu-stories](https://github.com/rkmaheshglobal/anshu-stories)

This repo holds the **public site only** — HTML, CSS, JavaScript, and story art. Notebooks, scans, PDFs, and working drafts in the parent folder stay off GitHub.

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

GitHub Pages is set up to deploy `anshika-mahesh-site/` on every push to `main` (see `.github/workflows/pages.yml`).

1. Push to `main`.
2. On GitHub: **Settings → Pages → Source: GitHub Actions**.
3. The site URL will be `https://rkmaheshglobal.github.io/anshu-stories/`.

You can also drag `anshika-mahesh-site/` onto [Netlify](https://www.netlify.com/) or [Vercel](https://vercel.com/) and point a domain such as `anshikamahesh.com` at it when ready.

Before going public:

1. Confirm FormSubmit’s first activation email at rkmaheshglobal@gmail.com (one-time, after the first Story Notes signup).
2. Create the GoatCounter site code `anshu-stories` if you want live reader stats.

## Safety defaults

- Parent-managed contact
- No public comments
- Newsletter copy notes unsubscribe and a parent-managed list
- Anonymous visit counts via GoatCounter (no names, no cookies); see `privacy.html`

## Reader stats

The live site records page views and three book events (`story_open`, `story_halfway`, `story_finish`). Localhost is skipped.

1. Create a free site at [goatcounter.com](https://www.goatcounter.com) with code **`anshu-stories`** (or another code).
2. If you pick a different code, change `GOATCOUNTER_CODE` in `anshika-mahesh-site/js/main.js`.
3. Open **Settings → Sites** in GoatCounter and confirm the site URL is `https://rkmaheshglobal.github.io/anshu-stories/`.
4. After a visit to the live site, the dashboard shows pages; events appear as paths like `story_open/shy-girl`.
