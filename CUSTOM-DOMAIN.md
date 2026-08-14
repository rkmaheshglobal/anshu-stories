# Custom domain — anshikamahesh.com

Registered at **Cloudflare** on 14 Aug 2026. The live site is **Cloudflare Pages**. The GitHub repo can stay **private**; the website stays public at https://anshikamahesh.com/.

GitHub Free cannot serve Pages from a private repo. Cloudflare Pages can.

Do these steps in order. Do **not** make the GitHub repo private until step 5.

## 1. Create the Pages project (you)

1. Open [dash.cloudflare.com](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorize GitHub if asked. When the GitHub App asks which repos it may see, choose **All repositories** (or at least `anshu-stories`). That keeps deploys working after the repo becomes private.
3. Select **rkmaheshglobal/anshu-stories**.
4. Fill the build form:

   | Field | Value |
   | --- | --- |
   | Project name | `anshika-mahesh` |
   | Production branch | `main` |
   | Framework preset | **None** |
   | Build command | *(leave empty)* |
   | Build output directory | `anshika-mahesh-site` |

5. **Save and Deploy**. Wait until the build is **Success**.
6. Open the `*.pages.dev` URL Cloudflare shows. You should see Anshika’s Home page.

The repo already has `wrangler.toml` with `pages_build_output_dir = "./anshika-mahesh-site"`. If the form is empty, those values should fill in.

## 2. Take the domain off GitHub Pages (you)

GitHub and Cloudflare cannot both own `anshikamahesh.com`.

1. Open [GitHub Pages settings](https://github.com/rkmaheshglobal/anshu-stories/settings/pages).
2. Remove the custom domain `anshikamahesh.com` → Save.
3. Cloudflare **DNS** → **Records**: delete every **A**, **AAAA**, and **CNAME** for `@` and `www` that point at GitHub (`185.199.*`, `2606:50c0:*`, or `rkmaheshglobal.github.io`). Leave MX / TXT / email rows.

The custom domain will go offline for a few minutes. The `*.pages.dev` URL still works.

## 3. Attach anshikamahesh.com to Pages (you)

1. Workers & Pages → **anshika-mahesh** → **Custom domains** → **Set up a custom domain**.
2. Add `anshikamahesh.com`. Cloudflare creates the DNS record. **Proxied (orange cloud) is correct** here — this is Cloudflare Pages, not GitHub Pages.
3. Repeat for `www.anshikamahesh.com` if Cloudflare does not add it automatically.

Wait until both show **Active**. Then open https://anshikamahesh.com/ in a private window.

## 4. Confirm GoatCounter

GoatCounter **Settings → Sites**: keep `https://anshikamahesh.com/`.

## 5. Make the GitHub repo private (you)

Only after the custom domain loads from Cloudflare:

1. [anshu-stories settings](https://github.com/rkmaheshglobal/anshu-stories/settings) → **General** → **Danger zone** → **Change repository visibility** → **Private**.
2. Push a tiny change (or **Retry deployment** in Pages) and confirm a new Cloudflare build still succeeds.

If the next build cannot see the repo, the GitHub App was limited to public repos. Cloudflare → Pages → Settings → Source → reconnect GitHub with **All repositories**.

## 6. GitHub Pages workflow

`.github/workflows/pages.yml` is removed. A red **GitHub Pages** Action on an older commit is leftover — ignore it. New pushes only deploy on Cloudflare Pages.

Optional: Cloudflare **Email Routing** to forward `hello@anshikamahesh.com` to `rkmaheshglobal@gmail.com`.

---

## What stays public

The **website** is public. Stories, HTML, CSS, and images can be viewed in a browser. What becomes private is the **GitHub repo** (commits, README, workflow files, file tree).

## Buying notes (kept for later domains)

Search names on [Instant Domain Search](https://instantdomainsearch.com/). Buy at Cloudflare or Porkbun. Avoid GoDaddy / BigRock / hosting bundles.
