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
  import headerLogo from "./assets/mkone/img/mk-one-logo.png"

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
  // The card on show is always the member's own. The selector below it only
  // switches which tier's privileges are listed.
  const memberTier = tiers[memberTierId - 1]

  const loadedAt = new Date()
  const qrValue = buildQrValue({
    cardNumber: member.card_number,
    tierId: memberTierId,
    expireDate: member.expire_date,
    at: loadedAt,
  })

  let activeTier = memberTierId - 1
  let now = loadedAt
  let cardActive = false
  let scrolled = false

  $: selectedTier = tiers[activeTier]
  $: today = format(now, "d MMM yyyy")
  $: clock = format(now, "hh:mm:ss a")

  // The MKONE app renders the payload as an SVG at error correction level M
  // with a one module quiet zone. Its encoder puts the whole payload in one
  // byte segment, so forcing byte mode keeps the grid at 33x33 like the app;
  // letting qrcode split out the numeric runs would shrink it to 29x29.
  function drawQr(node: HTMLElement) {
    void QRCode.toString([{ data: qrValue, mode: "byte" }], {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 1,
    }).then((svg) => {
      node.innerHTML = svg
    })
  }

  function tiltCard(event: PointerEvent) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const card = event.currentTarget as HTMLElement
    const bounds = card.getBoundingClientRect()
    // Pointer offset from the card centre, in px. Same tilt math as the MKONE app.
    const offsetX = event.clientX - bounds.left - bounds.width / 2
    const offsetY = event.clientY - bounds.top - bounds.height / 2
    const angle = Math.min(Math.abs(offsetX + offsetY) / 50, 10)

    cardActive = true
    card.style.setProperty("--rotate-x", `${offsetY / 100}`)
    card.style.setProperty("--rotate-y", `${-offsetX / 100}`)
    card.style.setProperty("--rotate-z", `${angle}deg`)
    card.style.setProperty(
      "--glow-x",
      `${((offsetX + bounds.width / 2) / bounds.width) * 100}%`,
    )
    card.style.setProperty(
      "--glow-y",
      `${((offsetY + bounds.height / 2) / bounds.height) * 100}%`,
    )
  }

  function resetCard(event: PointerEvent) {
    const card = event.currentTarget as HTMLElement
    cardActive = false
    card.style.removeProperty("--rotate-x")
    card.style.removeProperty("--rotate-y")
    card.style.removeProperty("--rotate-z")
    card.style.removeProperty("--glow-x")
    card.style.removeProperty("--glow-y")
  }

  onMount(() => {
    const timer = window.setInterval(() => {
      now = new Date()
    }, 1_000)

    const trackScroll = () => {
      scrolled = window.scrollY > 25
    }

    trackScroll()
    window.addEventListener("scroll", trackScroll, { passive: true })

    return () => {
      window.clearInterval(timer)
      window.removeEventListener("scroll", trackScroll)
    }
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
    <div class="header-inner" class:scrolled>
      <img src={headerLogo} alt="MKONE" />
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
                src={memberTier.card}
                alt={`${memberTier.name} MKONE membership card`}
              />

              <div class="qr-column">
                <div class="qr-box">
                  <div
                    class="qr-inner"
                    role="img"
                    aria-label="Membership QR code"
                  >
                    <div class="qr-svg" use:drawQr aria-hidden="true"></div>
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
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <path d="M14.25 18H3.75C1.68225 18 0 16.3177 0 14.25V7.29296C0 6.04421 0.618 4.88171 1.653 4.18421L6.90225 0.641207C8.1765 -0.218293 9.8235 -0.218293 11.0977 0.641207L16.3478 4.18421C17.382 4.88171 18 6.04346 18 7.29296V14.25C18 16.3177 16.3177 18 14.25 18ZM9 1.49771C8.562 1.49771 8.124 1.62671 7.7415 1.88546L2.4915 5.42771C1.8705 5.84621 1.5 6.54296 1.5 7.29221V14.2492C1.5 15.4897 2.5095 16.4992 3.75 16.4992H14.25C15.4905 16.4992 16.5 15.4897 16.5 14.2492V7.29296C16.5 6.54371 16.1295 5.84621 15.5093 5.42846L10.2585 1.88546C9.876 1.62671 9.438 1.49771 9 1.49771Z" />
        </svg>
        <span>Home</span>
      </div>
      <div class="nav-item">
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <path d="M18 12L18 11.9025C17.9968 11.5668 17.8822 11.2418 17.6743 10.9783C17.4663 10.7148 17.1767 10.5278 16.851 10.4467C16.5339 10.3599 16.2541 10.1713 16.0546 9.90989C15.8552 9.64849 15.7471 9.3288 15.7471 9C15.7471 8.6712 15.8552 8.35151 16.0546 8.09011C16.2541 7.82871 16.5339 7.64008 16.851 7.55325C17.1767 7.47217 17.4663 7.28521 17.6743 7.02173C17.8822 6.75824 17.9968 6.43315 18 6.0975L18 6C17.9988 5.0058 17.6033 4.05267 16.9003 3.34966C16.1973 2.64666 15.2442 2.25119 14.25 2.25L2.25 2.25C1.65326 2.25 1.08097 2.48705 0.65901 2.90901C0.237053 3.33097 0 3.90326 0 4.5L0 6.0975C0.0031889 6.43315 0.11776 6.75824 0.325725 7.02173C0.533689 7.28521 0.823269 7.47217 1.149 7.55325C1.46613 7.64008 1.74594 7.82871 1.94539 8.09011C2.14484 8.35151 2.25288 8.6712 2.25288 9C2.25288 9.3288 2.14484 9.64849 1.94539 9.90989C1.74594 10.1713 1.46613 10.3599 1.149 10.4467C0.823269 10.5278 0.533689 10.7148 0.325725 10.9783C0.117759 11.2418 0.00318868 11.5668 0 11.9025L0 13.5C0 14.0967 0.237052 14.669 0.659009 15.091C1.08097 15.5129 1.65326 15.75 2.25 15.75L14.25 15.75C15.2442 15.7488 16.1973 15.3533 16.9003 14.6503C17.6033 13.9473 17.9988 12.9942 18 12ZM1.5 13.5L1.54725 11.8927C2.18369 11.7166 2.74422 11.3354 3.14192 10.8082C3.53962 10.281 3.75227 9.63734 3.74688 8.977C3.7415 8.31665 3.51839 7.67654 3.11214 7.15591C2.7059 6.63529 2.13922 6.26325 1.5 6.0975L1.5 4.5C1.5 4.30109 1.57902 4.11032 1.71967 3.96967C1.86032 3.82902 2.05109 3.75 2.25 3.75L5.25 3.75L5.25 5.25C5.25 5.44891 5.32902 5.63968 5.46967 5.78033C5.61032 5.92098 5.80109 6 6 6C6.19891 6 6.38968 5.92098 6.53033 5.78033C6.67098 5.63968 6.75 5.44891 6.75 5.25L6.75 3.75L14.25 3.75C14.8467 3.75 15.419 3.98705 15.841 4.40901C16.2629 4.83097 16.5 5.40326 16.5 6L16.4527 6.10725C15.8202 6.28292 15.2625 6.66075 14.8647 7.18306C14.467 7.70538 14.2511 8.34349 14.25 9C14.2557 9.66537 14.4785 10.3107 14.8847 10.8377C15.2908 11.3648 15.858 11.7447 16.5 11.9198L16.5 12C16.5 12.5967 16.2629 13.169 15.841 13.591C15.419 14.0129 14.8467 14.25 14.25 14.25L6.75 14.25L6.75 12.75C6.75 12.5511 6.67098 12.3603 6.53033 12.2197C6.38968 12.079 6.19891 12 6 12C5.80109 12 5.61032 12.079 5.46967 12.2197C5.32902 12.3603 5.25 12.5511 5.25 12.75L5.25 14.25L2.25 14.25C2.05109 14.25 1.86032 14.171 1.71967 14.0303C1.57902 13.8897 1.5 13.6989 1.5 13.5Z" />
          <path d="M6.75 9.75L6.75 8.25C6.75 8.05109 6.67098 7.86032 6.53033 7.71967C6.38968 7.57902 6.19891 7.5 6 7.5C5.80109 7.5 5.61032 7.57902 5.46967 7.71967C5.32902 7.86032 5.25 8.05109 5.25 8.25L5.25 9.75C5.25 9.94891 5.32902 10.1397 5.46967 10.2803C5.61032 10.421 5.80109 10.5 6 10.5C6.19891 10.5 6.38968 10.421 6.53033 10.2803C6.67098 10.1397 6.75 9.94891 6.75 9.75Z" />
        </svg>
        <span>Coupon</span>
      </div>
      <div class="nav-item active" aria-current="page">
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <path d="M14.25 2.25H3.75C2.7558 2.25119 1.80267 2.64666 1.09966 3.34967C0.396661 4.05267 0.00119089 5.0058 0 6H18C17.9988 5.0058 17.6033 4.05267 16.9003 3.34967C16.1973 2.64666 15.2442 2.25119 14.25 2.25Z" />
          <path d="M0 12C0.00119089 12.9942 0.396661 13.9473 1.09966 14.6503C1.80267 15.3533 2.7558 15.7488 3.75 15.75H14.25C15.2442 15.7488 16.1973 15.3533 16.9003 14.6503C17.6033 13.9473 17.9988 12.9942 18 12V7.5H0V12ZM5.25 11.625C5.25 11.8475 5.18402 12.065 5.0604 12.25C4.93679 12.435 4.76109 12.5792 4.55552 12.6644C4.34995 12.7495 4.12375 12.7718 3.90552 12.7284C3.68729 12.685 3.48684 12.5778 3.3295 12.4205C3.17217 12.2632 3.06502 12.0627 3.02162 11.8445C2.97821 11.6262 3.00049 11.4 3.08564 11.1945C3.17078 10.9889 3.31498 10.8132 3.49998 10.6896C3.68499 10.566 3.9025 10.5 4.125 10.5C4.42337 10.5 4.70952 10.6185 4.9205 10.8295C5.13147 11.0405 5.25 11.3266 5.25 11.625Z" />
        </svg>
        <span>My Card</span>
      </div>
      <div class="nav-item">
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <path d="M16.9161 10.2465L15.4911 5.11951C15.0734 3.61751 14.1657 2.29823 12.9121 1.37136C11.6586 0.444502 10.1312 -0.0367482 8.57271 0.00411186C7.01425 0.0449719 5.51417 0.605597 4.31091 1.59687C3.10765 2.58815 2.27027 3.95319 1.93186 5.47501L0.828614 10.4363C0.706751 10.9845 0.709568 11.553 0.836859 12.1C0.964149 12.647 1.21266 13.1584 1.56405 13.5964C1.91544 14.0345 2.36073 14.388 2.86705 14.631C3.37337 14.8739 3.92778 15 4.48936 15H5.32486C5.497 15.8477 5.95691 16.6099 6.62667 17.1573C7.29643 17.7047 8.13485 18.0038 8.99986 18.0038C9.86488 18.0038 10.7033 17.7047 11.3731 17.1573C12.0428 16.6099 12.5027 15.8477 12.6749 15H13.3034C13.8815 15.0001 14.4518 14.8664 14.9697 14.6096C15.4876 14.3527 15.9391 13.9796 16.289 13.5194C16.6388 13.0592 16.8775 12.5243 16.9865 11.9565C17.0954 11.3888 17.0708 10.8035 16.9161 10.2465ZM8.99986 16.5C8.53617 16.4981 8.08439 16.3529 7.70634 16.0844C7.32829 15.8159 7.04243 15.4372 6.88787 15H11.1119C10.9573 15.4372 10.6714 15.8159 10.2934 16.0844C9.91534 16.3529 9.46356 16.4981 8.99986 16.5ZM15.0944 12.6113C14.8854 12.8885 14.6146 13.1132 14.3036 13.2675C13.9925 13.4218 13.6498 13.5014 13.3026 13.5H4.48936C4.15245 13.5 3.81986 13.4242 3.51612 13.2784C3.21239 13.1327 2.94527 12.9205 2.73449 12.6577C2.5237 12.3949 2.37463 12.088 2.29829 11.7599C2.22194 11.4318 2.22025 11.0906 2.29336 10.7618L3.39586 5.79976C3.66163 4.60442 4.31934 3.53222 5.26446 2.7536C6.20957 1.97498 7.38783 1.53464 8.61195 1.50257C9.83606 1.4705 11.0358 1.84855 12.0203 2.57661C13.0049 3.30468 13.7179 4.34097 14.0459 5.52076L15.4709 10.6478C15.565 10.9818 15.58 11.3332 15.5147 11.674C15.4493 12.0148 15.3054 12.3358 15.0944 12.6113Z" />
        </svg>
        <span>Notifications</span>
      </div>
      <div class="nav-item">
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <path d="M9 9C9.89002 9 10.76 8.73608 11.5001 8.24162C12.2401 7.74715 12.8169 7.04434 13.1575 6.22208C13.4981 5.39981 13.5872 4.49501 13.4135 3.6221C13.2399 2.74918 12.8113 1.94736 12.182 1.31802C11.5526 0.688685 10.7508 0.260102 9.87791 0.0864683C9.00499 -0.0871652 8.10019 0.00194979 7.27792 0.342544C6.45566 0.683138 5.75285 1.25991 5.25839 1.99994C4.76392 2.73996 4.5 3.60999 4.5 4.5C4.50119 5.69311 4.97568 6.83701 5.81934 7.68067C6.66299 8.52432 7.80689 8.99881 9 9ZM9 1.5C9.59334 1.5 10.1734 1.67595 10.6667 2.00559C11.1601 2.33524 11.5446 2.80377 11.7716 3.35195C11.9987 3.90013 12.0581 4.50333 11.9424 5.08527C11.8266 5.66722 11.5409 6.20177 11.1213 6.62132C10.7018 7.04088 10.1672 7.3266 9.58527 7.44236C9.00333 7.55811 8.40013 7.4987 7.85195 7.27164C7.30377 7.04458 6.83524 6.66006 6.50559 6.16671C6.17595 5.67337 6 5.09335 6 4.5C6 3.70435 6.31607 2.94129 6.87868 2.37868C7.44129 1.81607 8.20435 1.5 9 1.5Z" />
          <path d="M9 10.5C7.2104 10.502 5.49466 11.2138 4.22922 12.4792C2.96378 13.7447 2.25199 15.4604 2.25 17.25C2.25 17.4489 2.32902 17.6397 2.46967 17.7803C2.61032 17.921 2.80109 18 3 18C3.19891 18 3.38968 17.921 3.53033 17.7803C3.67098 17.6397 3.75 17.4489 3.75 17.25C3.75 15.8576 4.30312 14.5223 5.28769 13.5377C6.27226 12.5531 7.60761 12 9 12C10.3924 12 11.7277 12.5531 12.7123 13.5377C13.6969 14.5223 14.25 15.8576 14.25 17.25C14.25 17.4489 14.329 17.6397 14.4697 17.7803C14.6103 17.921 14.8011 18 15 18C15.1989 18 15.3897 17.921 15.5303 17.7803C15.671 17.6397 15.75 17.4489 15.75 17.25C15.748 15.4604 15.0362 13.7447 13.7708 12.4792C12.5053 11.2138 10.7896 10.502 9 10.5Z" />
        </svg>
        <span>Profile</span>
      </div>
    </div>
  </nav>
</div>
