# emkay

Share your member card without hassle

A mobile web page that shows an MKONE membership card with a live QR code, tier points and tier benefits, built from the member details in `scraper/data.json`.

## Layout

| Path | What it is |
|---|---|
| `scraper/data.json` | Member data the page renders (card number, expiry, points, last-updated time) |
| `scraper/main.rb` | Ruby/Playwright scraper that logs in and refreshes `data.json` (currently disabled) |
| `scraper/history.ndjson` | Snapshots appended by the scraper (not updated while it is disabled) |
| `renderer/` | Svelte + Vite site that reads `data.json` and renders the card |
| `.claude/skills/update-points/` | Claude Code skill that updates points from a screenshot |

## Updating points

The scheduled scraper is disabled (`.github/workflows/scrape.yml` only has a manual trigger, and its job is switched off with `if: false`), so points are updated by hand. Two fields change:

- `acc_points`: the tier points, i.e. the number before the slash in "คะแนนปรับระดับ 11,412/1,200 คะแนน"
- `updated_at`: the app's own "อัปเดตล่าสุด" time, as ISO 8601 with a `+07:00` offset

### With Claude Code

Send Claude a screenshot of the MKONE app's "บัตรของฉัน" (My Card) screen, with no other text. The `update-points` skill reads the points and last-updated time off the image, updates `scraper/data.json` and commits straight to `main`.

The skill uses a small helper you can also run yourself. Dates are Thai Buddhist era (`69` or `2569` means 2026), and the helper converts them:

```sh
node .claude/skills/update-points/update_points.mjs --points 11412 --updated "27 ก.ย. 69, 08:24"
# or with an ISO timestamp
node .claude/skills/update-points/update_points.mjs --points 11412 --updated-iso 2026-09-27T08:24:00+07:00
```

It keeps the file's formatting, changes only those two fields, and exits with code `3` if the values are already up to date.

### With the scraper

To go back to automatic updates, restore the `push`/`schedule` triggers and remove `if: false` in `.github/workflows/scrape.yml`. To run it locally:

- Set the environment variables `MK_USERNAME` and `MK_PASSWORD`
- Run `ruby main.rb` in `scraper/` to update `data.json`

## Renderer

```sh
cd renderer
pnpm install
pnpm dev      # local dev server
pnpm build    # build the site
pnpm test     # run unit tests
pnpm check    # type-check
```
