---
name: update-points
description: Update the MKONE member points and last-updated timestamp from a screenshot. Use whenever the user sends a screenshot of the MKONE app's "บัตรของฉัน" (My Card) screen — showing "คะแนนปรับระดับ N/1,200 คะแนน" and "อัปเดตล่าสุด …" — even with no text instructions. Writes scraper/data.json and commits directly to main.
---

# Update MKONE points from a screenshot

An image alone (no message) of the MKONE app card screen is the whole request:
read the points and timestamp off it, update `scraper/data.json`, and commit
straight to `main`. Don't ask for confirmation, don't open a PR.

## 1. Read the screenshot

Take only these two values from the card panel:

| Screen text | Field in `scraper/data.json` | Example |
|---|---|---|
| `คะแนนปรับระดับ **11,412**/1,200 คะแนน` — the number *before* the slash (drop the comma) | `acc_points` | `11412` |
| `อัปเดตล่าสุด วันที่ 27 ก.ย. 69, 08:24` — the app's own last-updated time | `updated_at` | `2026-09-27T08:24:00+07:00` |

Gotchas:
- Dates are Thai Buddhist era: `69` / `2569` → 2026 (subtract 543). Time is Thailand local, so
  the offset is always `+07:00`.
- Do **not** use the live clock printed on the card next to the QR code (e.g. `03 ต.ค. 2569
  17:43:09 น.`) or the phone status-bar time — that is when the screenshot was taken, not when
  points were updated.
- Do **not** touch `redeemable_points` (it isn't on this screen), `today_points`, `name`, or
  `history.ndjson` (that file belongs to the disabled scraper).
- Read digits carefully; if the number or date is too blurry/cropped to read with confidence,
  say so and stop instead of guessing.
- Cross-check, but don't change, the rest: the member number on the card should match
  `card_number` and the "สะสมคะแนนเพื่อรักษาสมาชิก ภายใน …" date should match `expire_date`.
  If either differs, mention it in your reply (the user may have a new card) rather than
  silently editing.

## 2. Apply the update

Run the helper from the repo root. It keeps the file's exact formatting (2-space indent, Thai
text unescaped, no trailing newline), refuses to run if the file isn't in that format, and
changes only `acc_points` and `updated_at`:

```bash
node .claude/skills/update-points/update_points.mjs \
  --points 11412 --updated "27 ก.ย. 69, 08:24"
```

Exit code `1` means bad input or an unexpected file format: stop and report it. Exit code `3` means the file already holds these values: report "already up to date" and
make no commit.

## 3. Commit directly to main

The user has authorised pushing to `main` for this workflow, even if the session was assigned a
different working branch.

```bash
git fetch origin main
git checkout main
git pull --ff-only origin main
# (run the update script here, after main is checked out and current)
git add scraper/data.json
git commit -m "Set tier points to 11,412"
git push origin main
```

- Commit message: `Set tier points to <N with thousands separator>`, followed by whatever
  attribution trailers the session instructs for commits.
- Only `scraper/data.json` should be in the commit.
- If the push is rejected as non-fast-forward, `git pull --rebase origin main` and push again.
  On network errors retry up to 4 times (2s, 4s, 8s, 16s).

## 4. Reply

One or two lines: the old → new `acc_points`, the new `updated_at`, and the commit hash pushed
to `main`, plus any card-number/expiry mismatch noticed above.
