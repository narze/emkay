# emkay

Share your member card without hassle

A web page that shows an MKONE membership card: a live QR code that is reissued
every 10 seconds, the tier points, and the privileges of each tier.

## Layout

- `scraper/` – Ruby + Playwright script that logs in to MKONE and writes the
  member's data to `data.json` (and appends it to `history.ndjson`)
- `renderer/` – Svelte + Vite site that reads `scraper/data.json` and renders
  the card

## Usage

- Prepare environment variables `MK_USERNAME`, and `MK_PASSWORD`
- Run scraper to update `data.json`
- Build renderer to create a website

```sh
cd scraper && bundle install && ruby main.rb

cd renderer
pnpm install
pnpm dev      # local dev server
pnpm build    # production build
pnpm test     # unit tests
pnpm check    # type check
```

Scraping is currently switched off: the points in `scraper/data.json` are set
by hand, and the `Scrape` workflow only runs when started manually (and its job
is disabled until `if: false` is removed from `.github/workflows/scrape.yml`).

## Home screen only

On a phone the card only renders when the page runs from the home screen, so
the browser's address bar never shows. In a browser tab, the page asks the
visitor to install it first. Desktop browsers are not affected.

## Debug mode

Tap the MK logo (the first brand under "Privilege") 5 times in quick succession
to open the debug scanner. The logo bounces on every tap. The scanner reads the
QR code of the real MKONE app with the phone camera and checks that emkay builds
the same payload from the same card, tier, expiry and time.
