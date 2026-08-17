# Print-on-demand — next steps

Saved 14 Aug 2026. Do this **before** adding Read Online (Free) / Order Physical Book (Amazon) buttons on the site.

Generated print files (rebuild with `python3 kdp/from-streets-to-snuggles/build.py`):

| File | What it is |
| --- | --- |
| `kdp/from-streets-to-snuggles/interior.pdf` | 58-page 6 × 9 in interior, no bleed |
| `kdp/from-streets-to-snuggles/cover-wrap.pdf` | Wrap (back + spine + front) with 0.125 in bleed |
| `kdp/from-streets-to-snuggles/README.md` | KDP upload settings |

The HTML books on [anshikamahesh.com](https://anshikamahesh.com/) are not print files. Amazon prints from those PDFs. The website only consumes a live product URL after that listing exists.

**Do not add an Amazon button until the title is Live and you have ordered a physical proof.**

## Chosen first title: *From Streets to Snuggles*

Reviewed 14 Aug 2026. Finished original, 25 chapters, ~2,700 words, The End. Good first KDP book. How to publish this title is in the section below.

## Next steps (in order)

- [x] Pick **one** finished original title: ***From Streets to Snuggles*** (not Famous Five, not gift editions, not “to be continued”).
- [ ] Anshika confirms printed names: **Fluffy** after Sam names her, **Bundle** only when the first owner speaks. Do not change the Chapter 24–25 ending.
- [x] Pick **one** art direction: website `cover.png` (recommended) **or** unused cartoon `img-000.jpg`. Do not ship both styles as one Amazon book.
- [x] Parent opens [Amazon KDP](https://kdp.amazon.com/) (account holder must be **18+**). Author name on the book stays **Anshika Mahesh**.
- [ ] Finish KDP tax interview (typically Form W-8BEN for an Indian resident) and payout details. Keep reports for the CA — royalties are still taxable in India.
- [x] Choose ink **before** layout for this title: **6 × 9 in** paperback, about 56–64 pages. Premium color if the comics stay in color; otherwise black ink + cream paper. Not a 24-page square picture book.
- [x] Build an interior PDF (even page count, **24+** pages, 300 dpi art, bleed/margins) and a wraparound cover from KDP’s cover calculator.
- [ ] Upload, pass Print Previewer, order a **physical proof**, fix, then set price and publish.
- [ ] Copy the live Amazon product URL (ASIN). Only then add `amazonUrl` in `anshika-mahesh-site/js/library.js` and the secondary Order on Amazon button next to Read Online (Free).

## Two workstreams

| Amazon / Lulu (the book) | anshikamahesh.com (the buttons) |
| --- | --- |
| Parent KDP account, tax, bank, finished original text, print-resolution art, interior PDF, wraparound cover, proof copy, live ASIN/ISBN | Cards today are one link into the reader. There is no story detail page yet. Show Order on Amazon only when `amazonUrl` exists. Hide it everywhere else. |

Paperback on Amazon and the full story free on the site **can coexist**. Do **not** enroll that title in **KDP Select** (Kindle Unlimited): it requires 90 days of ebook exclusivity, including “not on your website.”

## Which titles can become a book

| Story | On the site | Print path | Why |
| --- | --- | --- | --- |
| The Shy Girl & The Popular Girl | Finished · Vivian & Hazel | **First KDP candidate** | Original school story, complete, already illustrated |
| Star Finds a Home | Finished · 12 ch. | **First KDP candidate** | Star of the Toy Farm series opener |
| Star and the Midnight Feast | Finished · 12 ch. | KDP after Star Finds a Home | Second Star of the Toy Farm story |
| From Streets to Snuggles | Finished · 25 ch. | **Chosen first KDP title** | 6 × 9 illustrated chapter book — see section below |
| Short Stories | Finished collection | Possible KDP bundle | Six shorts can pad to 24+ pages |
| Kylie’s Story / Giza / Abacus / Kuvempu / Wish Hair Fairies | Finished shorts | Later / collections | Fine free online; thin as standalone paperbacks |
| A Play of Their Own | Finished · 7 ch. | KDP after The Shy Girl | Complete sequel — play, Noele, and Samaya |
| Almost Sisters / Bandit Family / Moving In | To be continued | **Wait** | Site already marks these unfinished |
| Chosen for Magic | 12 gift editions | **Lulu / private print only** | Real friends’ names — not a public Amazon listing |
| The Famous Five | Co-written short | **Do not sell** | Kirrin Island / Timmy are Enid Blyton marks |
| The Magic of Storytelling | Finished short | **Do not sell as-is** | Uses Enid Blyton as a character |

This is a publishing filter, not legal advice. Clear rights before listing anything that borrows someone else’s characters.

## Criteria Amazon will check

### Rights and content

- Own (or have written permission for) the story, illustrations, and fonts.
- Fan tales that use Famous Five names, Kirrin Island, or Enid Blyton as a character can stay as private website gifts; they should not go on Amazon until rights are cleared.
- Chosen for Magic editions that use a real child’s name need that family’s consent even as a one-off print. Do not put those twelve editions in the public Kindle store.
- If any cover or interior art was made with an image generator, disclose AI-generated content at KDP upload.
- Do not put a child’s school, extra photos, or extra personal details on the Amazon author page beyond what is already on the site.

### Print files (not the website)

- Interior: single-page PDF in reading order (not facing spreads).
- Full-bleed art: 0.125 in extra on the outer edges.
- Keep faces and text at least 0.375 in from trim and the gutter.
- Page count even and at least 24.
- Cover: one PDF — back + spine + front. Spine width comes from KDP’s calculator **after** the interior is final.
- Confirm live trim tables, hardcover options, and Amazon.in print availability in the KDP dashboard when you start — those menus change by marketplace.

## KDP or Lulu

| Need | Amazon KDP | Lulu |
| --- | --- | --- |
| Shop where families already buy | Amazon listing, search, Prime shipping in print countries | Lulu store or your own link; smaller audience |
| Cost to start | Free to upload; pay for proof copies | Free to upload; proofs and gifts billed per copy |
| Chosen for Magic / birthday gifts | Poor fit (public catalog, real names) | Better — print 1–12 copies, no storefront required |
| Hardcover | Available on some trims; start with paperback | Often easier for a one-off hardcover gift |
| India delivery | Confirm current Amazon.in print options; color books can be costly to ship in | Ships internationally; still check per-copy + postage |
| ISBN | Free KDP ISBN locks Amazon as publisher of record | Buy your own ISBN (India: national ISBN agency) to keep the imprint portable |

## Parent account, tax, and money

- **Identity:** parent legal name, address, phone. Author: Anshika Mahesh. Publisher/imprint can be the parent name or a small house name.
- **Tax (India):** complete the KDP tax interview so US withholding can drop under the India–US treaty. Royalties remain taxable in India.
- **Price:** KDP sets a minimum list price from print cost. A 24–32 page premium-color square book often lands in the high single to low double digits (USD). Black-and-white chapter books can be priced for kids. Set the public price only after the proof arrives.

## Website button rules (when a listing is Live)

Cards in `js/library.js` are currently a single link into the reader.

| Rule | Detail |
| --- | --- |
| Primary = Read Online (Free) | Same URL as today (`stories/*.html`). Never paywall the site copy. |
| Secondary = Order on Amazon | Opens the live paperback (or hardcover) product page in a new tab. Prefer the Amazon.in URL if that is the storefront families will use. |
| Show only when `amazonUrl` exists | Optional field on that story in `library.js`. No URL, no button. |
| Where to put them | Best: a short story landing (cover, blurb, two buttons), then the reader. Next-best: the reader toolbar beside bookmark/coloring. Do not put two buttons on the whole-card link without splitting the card. |
| No affiliate until registered | Plain product URLs are enough. Amazon Associates is a separate program with extra child-directed advertising rules — skip it unless you want that review. |

## From Streets to Snuggles — how to publish

The live reader is `anshika-mahesh-site/stories/from-streets-to-snuggles.html`. That HTML is **not** the KDP file.

### The two picture-books in the folder

| Edition | Files | What it is |
| --- | --- | --- |
| Website | `images/streets/cover.png` + the HTML chapters | Photoreal cover (Sam hugging two pups, rain outside). No title on the art. Anshika’s prose. |
| Comic / unused cover | `img-000.jpg` (not used on the site) + `img-001.jpg`–`img-025.jpg` | Cartoon cover with title already painted on. Comic panels with speech baked into the image. Different character look. |

Amazon needs **one** consistent book. Recommended: prose + `cover.png` as the front; comic pages as chapter plates **after** captions on the art are removed so they do not duplicate the printed paragraphs.

### Format

- Paperback first: **6 × 9 in**, about **56–64 pages** (even). One illustration plate + one text page per chapter, plus title/copyright/contents.
- Premium **color** if the comics stay in color; cheaper **black ink + cream paper** if you grayscale the plates.
- Do **not** squeeze this into a 24-page square picture book — that would drop most of the 25 chapters.
- Kindle of the prose can wait. Comic-page Kindle needs fixed layout. Skip **KDP Select** while the story is free on the site.

### Cover and art sizes (today)

- `cover.png` is 1024 × 1536 px — too small for a 6 × 9 wrap at 300 dpi. Need a larger original, then add title/author as type (not painted into a small JPEG).
- Most interiors are ~1013 × 1400 px — fine as a half-page plate on 6 × 9, not as full-bleed spreads.
- `img-001`–`003` are wide comic strips; do not shrink a four-panel strip onto one 6 × 9 page.

### Copy-edit before typesetting (Anshika / parent)

- After Chapter 9 Sam names them Fluffy and Snowy; later chapters and the contents list still say Bundle. Align names for print.
- Do **not** change the last-chapter reveal that Bundle is a girl.
- Check comic vs prose mismatches (Chapter 14 art does not match the thunderstorm scene in the text).
- If any image was AI-assisted, tick KDP’s AI disclosure at upload.

### KDP listing (draft)

- Title: From Streets to Snuggles
- Subtitle: A tale of kindness, rescue, and belonging
- Author: Anshika Mahesh
- Age: 6–8
- Categories: Juvenile Fiction / Animals / Dogs; Social Themes / Friendship
- Description: use the site About blurb (Sam, rescue, vet, friends, Goa, kindness). Confirm names with Anshika first.

### After the book is Live

Add `amazonUrl` on `from-streets-to-snuggles` in `js/library.js`. Primary button stays **Read Online (Free)**. Secondary **Order on Amazon** only for this title.

## Other first-book options (later)

*The Shy Girl & The Popular Girl* or *Star Finds a Home* remain good second paperbacks (cream paper, black ink, a few illustrations) after this one has a proof.

## Sources

KDP paperback submission help, KDP Select terms (ebook exclusivity only), and story flags in `anshika-mahesh-site/js/library.js`. Confirm current menus in the KDP dashboard before locking trim size or India delivery promises.
