<script lang="ts">
  import { onMount } from "svelte"
  import { format } from "date-fns"
  import QRCode from "qrcode"

  import member from "../../scraper/data.json"
  import { buildQrValue } from "./lib/qr"
  import background from "./assets/mkone/img/background.jpg"
  import brandHakata from "./assets/mkone/img/brand-hakata.png"
  import brandLaemCharoen from "./assets/mkone/img/brand-laemcharoen.png"
  import brandLeSiam from "./assets/mkone/img/brand-lesiam.png"
  import brandMiyazaki from "./assets/mkone/img/brand-miyazaki.png"
  import brandMk from "./assets/mkone/img/brand-mk.png"
  import brandYayoi from "./assets/mkone/img/brand-yayoi.png"
  import cardBlack from "./assets/mkone/img/card-black.jpg"
  import cardGold from "./assets/mkone/img/card-gold.jpg"
  import cardRed from "./assets/mkone/img/card-red.jpg"
  import cardLogo from "./assets/mkone/img/mkone-logo.png"

  type Tier = {
    name: "RED" | "BLACK" | "GOLD"
    card: string
    description: string
    privileges: string[][]
  }

  const brands = [
    { name: "MK Restaurant", image: brandMk },
    { name: "Yayoi", image: brandYayoi },
    { name: "Laem Charoen Seafood", image: brandLaemCharoen },
    { name: "Le Siam", image: brandLeSiam },
    { name: "Hakata", image: brandHakata },
    { name: "Miyazaki", image: brandMiyazaki },
  ]

  const tiers: Tier[] = [
    {
      name: "RED",
      card: cardRed,
      description: "Enjoy Up to 10% Discount*",
      privileges: [
        [
          "Member Discount 10% off for cash payments, or 5% off for credit/debit card payments",
          "Welcome Coupon",
          "Birthday Coupon. One coupon in birth month.",
          "Point Collection, Earn 1 point for every 25 Baht spent",
        ],
        [
          "Member Discount 10% off for cash payments, or 5% off for credit/debit card payments",
          "Birthday Discount 15% off for cash payments, or 10% off for credit/debit card payments. One coupon in birth month.",
          "Point Collection, Earn 1 point for every 25 Baht spent",
          "Point Redemption",
        ],
        [
          "Member Discount 10% off for cash payments, or 5% off for credit/debit card payments. One coupon in birth month.",
          "Birthday Discount 20% off for cash payments, or 15% off for credit/debit card payments. One coupon in birth month.",
          "Point Collection, Earn 1 point for every 25 Baht spent",
          "Point Redemption",
          "Complimentary VIP room reservation at Laem Charoen Seafood for a private group of 8-12 guests.",
        ],
        [
          "Member Discount 10% off for cash payments, or 5% off for credit/debit card payments",
          "Point Collection, Earn 1 point for every 25 Baht spent",
        ],
        [
          "Member Discount 10% off for cash payments, or 5% off for credit/debit card payments",
          "Point Collection, Earn 1 point for every 25 Baht spent",
        ],
        [
          "Member Discount 10% off for cash payments, or 5% off for credit/debit card payments",
          "Point Collection, Earn 1 point for every 25 Baht spent",
        ],
      ],
    },
    {
      name: "BLACK",
      card: cardBlack,
      description: "Enjoy Up to 12% Discount*",
      privileges: [
        [
          "Member Discount 12% off for cash payments, or 7% off for credit/debit card payments",
          "Birthday Discount 25%. One coupon in birth month.",
          "Point Collection, Earn 1 point for every 25 Baht spent",
          "Point Redemption",
        ],
        [
          "Member Discount 10% off for cash payments, or 5% off for credit/debit card payments",
          "Birthday Discount 15% off for cash payments, or 10% off for credit/debit card payments. One coupon in birth month.",
          "Point Collection, Earn 1 point for every 25 Baht spent",
          "Point Redemption",
        ],
        [
          "Member Discount 12% for cash payments, or 7% off for credit/debit card payments",
          "Birthday Discount 20% off for cash payments, or 15% off for credit/debit card payments. One coupon in birth month.",
          "Point Collection, Earn 1 point for every 25 Baht spent",
          "Point Redemption",
          "Complimentary VIP room reservation at Laem Charoen Seafood for a private group of 8-12 guests.",
        ],
        [
          "Member Discount 12% off for cash payments, or 7% off for credit/debit card payments",
          "Point Collection, Earn 1 point for every 25 Baht spent",
        ],
        [
          "Member Discount 10% off for cash payments, or 5% off for credit/debit card payments",
          "Point Collection, Earn 1 point for every 25 Baht spent",
        ],
        [
          "Member Discount 10% off for cash payments, or 5% off for credit/debit card payments",
          "Point Collection, Earn 1 point for every 25 Baht spent",
        ],
      ],
    },
    {
      name: "GOLD",
      card: cardGold,
      description: "Enjoy Up to 15% Discount*",
      privileges: [
        [
          "Member Discount 15% off for cash payments, or 10% off for credit/debit card payments",
          "Birthday Discount 30%. One coupon in birth month",
          "Point Collection, Earn 1 point for every 25 Baht spent",
          "Point Redemption",
        ],
        [
          "Member Discount 10% off for cash payments, or 5% off for credit/debit card payments",
          "Birthday Discount 15% off for cash payments, or 10% off for credit/debit card payments. One coupon in birth month.",
          "Point Collection, Earn 1 point for every 25 Baht spent",
          "Point Redemption",
        ],
        [
          "Member Discount 15% off for cash payments, or 10% off for credit/debit card payments",
          "Birthday Discount 20% off for cash payments, or 15% off for credit/debit card payments. One coupon in birth month.",
          "Point Collection, Earn 1 point for every 25 Baht spent",
        ],
        [
          "Member Discount 15% off for cash payments, or 10% off for credit/debit card payments",
          "Point Collection, Earn 1 point for every 25 Baht spent",
        ],
        [
          "Member Discount 10% off for cash payments, or 5% off for credit/debit card payments",
          "Point Collection, Earn 1 point for every 25 Baht spent",
        ],
        [
          "Member Discount 10% off for cash payments, or 5% off for credit/debit card payments",
          "Point Collection, Earn 1 point for every 25 Baht spent",
        ],
      ],
    },
  ]

  const tierTarget = 1_200
  const updatedAt = format(new Date(member.updated_at), "d MMM yy, HH:mm")
  const formattedPoints = member.acc_points.toLocaleString("en-US")
  const formattedTarget = tierTarget.toLocaleString("en-US")
  const progress = Math.min((member.acc_points / tierTarget) * 100, 100)
  // tier_id of the member's card in the MKONE API (1 = RED, 2 = BLACK, 3 = GOLD).
  const memberTierId = 3

  const loadedAt = new Date()
  const qrValue = buildQrValue({
    cardNumber: member.card_number,
    tierId: memberTierId,
    expireDate: member.expire_date,
    at: loadedAt,
  })

  let activeTier = 2
  let now = loadedAt
  let cardActive = false

  $: selectedTier = tiers[activeTier]
  $: today = format(now, "d MMM yyyy")
  $: clock = format(now, "hh:mm:ss a")

  function drawQr(node: HTMLCanvasElement) {
    void QRCode.toCanvas(node, qrValue, {
      errorCorrectionLevel: "H",
      margin: 0,
      width: 256,
    })
  }

  function tiltCard(event: PointerEvent) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const card = event.currentTarget as HTMLElement
    const bounds = card.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height

    cardActive = true
    card.style.setProperty("--rotate-x", `${(0.5 - y) * 12}deg`)
    card.style.setProperty("--rotate-y", `${(x - 0.5) * 12}deg`)
    card.style.setProperty("--glow-x", `${x * 100}%`)
    card.style.setProperty("--glow-y", `${y * 100}%`)
  }

  function resetCard(event: PointerEvent) {
    const card = event.currentTarget as HTMLElement
    cardActive = false
    card.style.removeProperty("--rotate-x")
    card.style.removeProperty("--rotate-y")
  }

  onMount(() => {
    const timer = window.setInterval(() => {
      now = new Date()
    }, 1_000)

    return () => window.clearInterval(timer)
  })
</script>

<svelte:head>
  <title>MKONE | My Card</title>
  <meta
    name="description"
    content="View your MKONE membership card, tier points, and privileges."
  />
</svelte:head>

<div class="app-shell" style:--app-background={`url(${background})`}>
  <header class="header">
    <div class="header-inner">
      <img src={cardLogo} alt="MKONE" />
    </div>
  </header>

  <main class="content" id="my-card">
    <div class="stack">
      <section class="tier-points" aria-labelledby="tier-points-title">
        <div class="tier-message">
          <p>
            Collect tier points to maintain your membership tier<br />within 31
            Dec 2026
          </p>
        </div>

        <div class="points-panel">
          <div class="points-summary">
            <div class="points-heading" id="tier-points-title">
              <span>Tier Points</span>
              <strong>{formattedPoints}/{formattedTarget}</strong>
              <span>points</span>
            </div>
            <p class="updated-at">Updated {updatedAt}</p>
          </div>

          <div
            class="progress-track"
            role="progressbar"
            aria-label="Tier points"
            aria-valuemin="0"
            aria-valuemax={tierTarget}
            aria-valuenow={Math.min(member.acc_points, tierTarget)}
            aria-valuetext={`${formattedPoints} of ${formattedTarget} points`}
          >
            <div class="progress-fill" style:width={`${progress}%`}></div>
          </div>

          <div class="card-wrap">
            <div
              class:active={cardActive}
              class="membership-card"
              onpointermove={tiltCard}
              onpointerleave={resetCard}
              onpointerup={resetCard}
              onpointercancel={resetCard}
            >
              <img
                class="card-art"
                src={selectedTier.card}
                alt={`${selectedTier.name} MKONE membership card`}
              />

              <div class="qr-column">
                <div class="qr-box">
                  <div
                    class="qr-inner"
                    role="img"
                    aria-label="Membership QR code"
                  >
                    <canvas
                      use:drawQr
                      aria-hidden="true"
                    ></canvas>
                    <div class="qr-logo" aria-hidden="true">
                      <img src={cardLogo} alt="" />
                    </div>
                  </div>
                </div>

                <div class="info-pill membership-number">
                  <span>Membership ID no.</span>
                  <strong>{member.card_number}</strong>
                </div>
                <time class="info-pill card-date" datetime={now.toISOString()}>
                  {today}
                </time>
                <time
                  class="info-pill card-time"
                  datetime={now.toISOString()}
                  aria-live="off"
                >
                  {clock}
                </time>
              </div>

              <div class="card-glow" aria-hidden="true"></div>
            </div>
          </div>

          <p class="screenshot-note">
            QR codes from screenshots are not accepted
          </p>
        </div>
      </section>

      <section class="tier-comparison" aria-label="Membership tier privileges">
        <div class="tier-selector" role="group" aria-label="Choose a tier">
          {#each tiers as tier, index}
            <button
              type="button"
              class:active={index === activeTier}
              aria-pressed={index === activeTier}
              onclick={() => (activeTier = index)}
            >
              <span class="tier-bar" aria-hidden="true"></span>
              <span class="tier-label">{tier.name}</span>
            </button>
          {/each}
        </div>

        {#key activeTier}
          <div class="privilege-panel" aria-live="polite">
            <div class="tier-description">
              <img src={selectedTier.card} alt="" />
              <div>
                <strong>Description</strong>
                <p>{selectedTier.description}</p>
              </div>
            </div>

            <h1>{selectedTier.name} Privilege</h1>

            <div class="brand-list">
              {#each brands as brand, brandIndex}
                <section
                  class="brand-privileges"
                  aria-labelledby={`brand-${brandIndex}`}
                >
                  <h2 id={`brand-${brandIndex}`}>
                    <img src={brand.image} alt="" />
                    <span class="sr-only">{brand.name}</span>
                  </h2>
                  <ul>
                    {#each selectedTier.privileges[brandIndex] as privilege}
                      <li>{privilege}</li>
                    {/each}
                  </ul>
                </section>
              {/each}
            </div>
          </div>
        {/key}
      </section>
    </div>
  </main>

  <nav class="bottom-nav" aria-label="Primary navigation">
    <div class="nav-inner">
      <div class="nav-item">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m3.5 10.5 8.5-7 8.5 7v8.75c0 .69-.56 1.25-1.25 1.25h-4.5V15h-5.5v5.5h-4.5c-.69 0-1.25-.56-1.25-1.25V10.5Z" />
        </svg>
        <span>Home</span>
      </div>
      <div class="nav-item">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 5.5h16v4a2.5 2.5 0 0 0 0 5v4H4v-4a2.5 2.5 0 0 0 0-5v-4Z" />
          <path d="M10 8h.01M10 12h.01M10 16h.01" />
        </svg>
        <span>Coupon</span>
      </div>
      <div class="nav-item active" aria-current="page">
        <svg class="solid" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 5h18v14H3V5Zm0 4h18V7H3v2Zm3 6h6v-2H6v2Z" />
        </svg>
        <span>My Card</span>
      </div>
      <div class="nav-item">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.5 9a6.5 6.5 0 0 0-13 0v3.5L3.5 17h17l-2-4.5V9Z" />
          <path d="M9.5 20h5" />
        </svg>
        <span>Notifications</span>
      </div>
      <div class="nav-item">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="7.5" r="4.5" />
          <path d="M4.5 21c0-4.14 3.36-7.5 7.5-7.5s7.5 3.36 7.5 7.5" />
        </svg>
        <span>Profile</span>
      </div>
    </div>
  </nav>
</div>
