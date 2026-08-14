# Custom domain — anshikamahesh.com

Registered at **Cloudflare** on 14 Aug 2026. The site stays on GitHub Pages. This file is the wiring checklist.

Public URL once DNS and GitHub agree: **https://anshikamahesh.com/**

Because this repo deploys with **GitHub Actions**, GitHub ignores a `CNAME` file in the site folder. Set the domain in GitHub Settings (step 2).

## 1. Cloudflare DNS (you)

Open [dash.cloudflare.com](https://dash.cloudflare.com/) → click **anshikamahesh.com** → left sidebar **DNS** → **Records**.

### Clean up

Leave MX / TXT / email records if you see any. Delete only leftover **A** or **CNAME** rows for `@` (the root) or `www` that point at Cloudflare parking IPs or “coming soon”. Those will fight GitHub.

### Add two records

Click **Add record**. Fill the form **exactly** like this. Then **Save**. Repeat for the second row.

| # | Type | Name | Target / content | Proxy status | TTL |
| --- | --- | --- | --- | --- | --- |
| 1 | CNAME | `@` | `rkmaheshglobal.github.io` | **DNS only** (grey cloud) | Auto |
| 2 | CNAME | `www` | `rkmaheshglobal.github.io` | **DNS only** (grey cloud) | Auto |

Cloudflare turns `@` into `anshikamahesh.com`. Do **not** type `anshikamahesh.com` in Name (that would become `anshikamahesh.com.anshikamahesh.com`).

Do **not** put `https://`, a trailing slash, or `/anshu-stories` in the target. Only `rkmaheshglobal.github.io`.

**Grey cloud is required.** If the cloud is orange and the label says Proxied, click it until it says **DNS only**. Orange proxy blocks GitHub’s HTTPS certificate.

Apex CNAME is allowed here because Cloudflare flattens it to A records for the rest of the internet.

### If GitHub still says DNS is wrong

Delete the `@` CNAME and instead add GitHub’s A / AAAA records (all DNS only):

- A `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- AAAA `@` → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`

Keep the `www` CNAME.

## 2. GitHub Pages (you)

1. Open [Pages settings](https://github.com/rkmaheshglobal/anshu-stories/settings/pages).
2. **Custom domain:** `anshikamahesh.com` → Save.
3. Wait until GitHub shows DNS check as passed (often a few minutes; sometimes up to an hour).
4. Tick **Enforce HTTPS**. If the box is grey, wait for the certificate (can take up to 24 hours, usually much less).
5. If GitHub asks you to **verify** the domain, it will show a TXT record. Add that in Cloudflare DNS, then return and verify.

GitHub will redirect `www.anshikamahesh.com` and the old `https://rkmaheshglobal.github.io/anshu-stories/` URL to the custom domain once both DNS records are in.

## 3. After it loads

- Open https://anshikamahesh.com/ in a private window. You should see Home, not a Cloudflare or GitHub error page.
- GoatCounter: **Settings → Sites** — add `https://anshikamahesh.com/` so counts keep working on the new host.
- Optional later: Cloudflare **Email Routing** to forward `hello@anshikamahesh.com` to `rkmaheshglobal@gmail.com`. Until then, Connect stays on Gmail.

Share-card (`og:`) URLs in the site already use `https://anshikamahesh.com`. They take effect after the next push to `main`.

---

## Buying notes (kept for later domains)

Search names on [Instant Domain Search](https://instantdomainsearch.com/). Buy at Cloudflare or Porkbun. Avoid GoDaddy / BigRock / hosting bundles.

| Place | Typical `.com` | Why |
| --- | --- | --- |
| Cloudflare Registrar | ~$10–11, same at renewal | At-cost, strong DNS. Must use Cloudflare nameservers. |
| Porkbun | ~$11, same at renewal | Easier checkout, free privacy and email forwarding. |

Checklist used for this name:

- Parent as registrant; recovery email `rkmaheshglobal@gmail.com`
- WHOIS privacy on; 2FA and auto-renew on
- Real DNS, not forwarding; no hosting add-on
- `.com` without hyphens; not a publisher / Famous Five brand
