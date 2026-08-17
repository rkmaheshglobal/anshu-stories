# Star of the Toy Farm — KDP Kindle files

Two Kindle titles, same series. Text is Anshika’s, not rewritten. Do **not** put Book 1 or Book 2 on the cover, subtitle, or series display name.

Rebuild after any text or art change:

```bash
python3 kdp/star-of-the-toy-farm/build_kindle.py
```

## Files to upload

| Title | Folder | Manuscript | Cover |
| --- | --- | --- | --- |
| **Star Finds a Home** | `star-finds-a-home/` | `star-finds-a-home-kindle.docx` | `kindle-cover.jpg` |
| **Star and the Midnight Feast** | `star-and-the-midnight-feast/` | `star-and-the-midnight-feast-kindle.docx` | `kindle-cover.jpg` |

If KDP rejects the `.docx`, use the `.epub` in the same folder. Do **not** upload the website `.html`.

## KDP Kindle eBook settings (each title)

Create **two** Kindle eBooks on the parent KDP account (account holder must be 18+). Author name stays **Anshika Mahesh**.

1. Language: English.
2. Title: use the table above. Subtitle: **A Star of the Toy Farm story**. Do not add Book 1 / Book 2.
3. Series: name the series **Star of the Toy Farm**. Sequence 1 = Star Finds a Home, sequence 2 = Star and the Midnight Feast. The public titles stay the adventure names.
4. Age: **6–8**. Categories: Juvenile Fiction / Animals / Toys, Dolls & Puppets; Social Themes / Friendship.
5. Description and keywords: paste from that folder’s `amazon-description.txt` and `amazon-keywords.txt`.
6. Upload the `.docx`, then `kindle-cover.jpg` (1600 × 2560, RGB JPEG). Re-upload the `.docx` after a rebuild so Kindle can see the Contents list (Heading 1 chapters + bookmark `toc`).
7. Tick the **AI-generated images** disclosure.
8. Preview on phone, tablet, and e-ink in KDP Previewer.
9. Primary marketplace: **Amazon.in**. Set **₹149** there, and **$2.99** on Amazon.com. The book still sells worldwide.
10. India pays 70% royalty only if the book is in KDP Select (price band ₹99–₹599). Without Select, Amazon.in is 35%. US/UK can still be 70% at $2.99 without Select.
11. Do not enroll in KDP Select until the full story is no longer free on anshikamahesh.com.
12. Publish Star Finds a Home first. Link Midnight Feast as the next book in the same series.

## Series page (Bookshelf → Create series page)

Paste from `series/amazon-series.txt`. Upload `series/series-image.jpg` if the form asks for a series image.

| Field | Enter |
| --- | --- |
| Series title | **Star of the Toy Farm** (do not add the word Series) |
| Reading order | **Ordered** — 1 = Star Finds a Home, 2 = Star and the Midnight Feast |
| Series image | `series/series-image.jpg` (1600 × 2560). If the form only offers cover thumbnails, leave it. |
| Description | Paste the HTML in `series/amazon-series.txt`. Do not leave blank if you want a series-wide blurb. |

Paperback interiors are not in this folder yet. Kindle can go live on its own.

Do not add the Amazon button on anshikamahesh.com until a title is **Live** and you have the product URL / ASIN.
