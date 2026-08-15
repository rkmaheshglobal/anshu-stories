# From Streets to Snuggles — KDP files

Generated from the site story. Text is Anshika’s, not rewritten.

## Files to upload

| KDP field | File |
| --- | --- |
| Paperback interior | `interior.pdf` (60 pages, 6 × 9 in, **no bleed**) |
| Paperback cover | `cover-wrap.pdf` (12.3908 × 9.25 in, **with 0.125 in bleed**) |
| Kindle manuscript | `from-streets-to-snuggles-kindle.docx` (upload this) |
| Kindle manuscript fallback | `from-streets-to-snuggles-kindle.epub` |
| Kindle cover | `kindle-cover.jpg` (1600 × 2560, RGB JPEG) |

Rebuild after any text or art change:

```bash
python3 kdp/from-streets-to-snuggles/build.py
python3 kdp/from-streets-to-snuggles/build_kindle.py
```

## KDP paperback settings

1. Create a new paperback (not hardcover yet).
2. Language: English. Title: **From Streets to Snuggles**. Subtitle: **A tale of kindness, rescue, and belonging**. Author: **Anshika Mahesh**.
3. Age: 6–8. Categories: Juvenile Fiction / Animals / Dogs; Social Themes / Friendship.
4. Print options: **6 × 9 in**, **Premium color**, **white paper**, **no bleed**.
5. Upload `interior.pdf`. Confirm KDP counts **60** pages.
6. Upload `cover-wrap.pdf` (or use Cover Creator only if you abandon this wrap).
7. Pass **Print Previewer**. Order a **proof copy**. Do not publish until the proof is in your hands.
8. Do **not** enroll in KDP Select while the story is free on anshikamahesh.com.

## KDP Kindle eBook settings

Create this as a **new Kindle eBook** on the same Bookshelf title (or link it to the paperback). Use the same title, subtitle, author, age, categories, keywords, and description as the paperback.

1. Upload `from-streets-to-snuggles-kindle.docx` as the manuscript. If KDP still fails, try `from-streets-to-snuggles-kindle.epub`. Do **not** upload the website `.html`, the print PDF, or the older `.epub`.
2. Upload `kindle-cover.jpg` as the eBook cover (separate from the wrap PDF).
3. Tick the AI-generated images disclosure.
4. Preview on phone, tablet, and e-ink in KDP Previewer.
5. DRM: leave **off** — the story is already free on the site.
6. Do **not** enroll in KDP Select (the site copy would violate exclusivity).
7. Suggested list price: **$2.99** (70% royalty if the file stays under ~10 MB). If delivery cost looks high on the pricing page, use **35%** instead.

Spine width used: **0.1408 in** (no spine type — book is under 79 pages). If KDP reports a different page count, run the builder again.

Cover art is upscaled from `cover.png` (1024 × 1536). If you have a larger original, replace that file and rebuild.

Each chapter has its own scene plate in `plates/ch-01.png` … `ch-25.png`, drawn from that chapter’s story and the cover characters. Tick KDP’s AI-generated images disclosure when you upload.

Still for Anshika to confirm: printed names (Fluffy vs Bundle).

Do not add the Amazon button on the website until this title is **Live** and you have the product URL.
