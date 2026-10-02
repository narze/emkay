<script lang="ts">
  import { onMount } from "svelte"
  import { format, formatDistanceStrict } from "date-fns"
  import QRCode from "qrcode"

  import { parseTimestamp } from "./qr"
  import { compareQr, toTestSamples, type Member } from "./qrDebug"
  import { drawQr, qrOptions, qrSegments } from "./qrRender"
  import { decodeQr, type DecodedQr } from "./zxing"

  // Scans the QR of the real MKONE app with the phone camera and checks that
  // emkay builds the same payload from the same card, tier, expiry and time.

  type Structure = Omit<DecodedQr, "text" | "corners">

  type Scan = {
    raw: string
    /** When it was scanned, on this device's clock. */
    at: number
    source: "camera" | "paste"
    structure?: Structure
    /** The scanned code cut out of the camera frame. Not kept across visits. */
    crop?: string
  }

  let { member, onclose }: { member: Member; onclose: () => void } = $props()

  const storageKey = "emkay-qr-debug"
  const maxScans = 200
  const scanInterval = 150

  let scans = $state<Scan[]>(loadScans())
  let selectedIndex = $state(0)
  let camera = $state<"idle" | "starting" | "running">("idle")
  let error = $state("")
  let pasted = $state("")
  let samples = $state("")
  let copied = $state(false)
  let ours = $state<Structure | null>(null)
  let video: HTMLVideoElement
  let stream: MediaStream | null = null

  const selected = $derived(scans[selectedIndex])
  const result = $derived(
    selected ? compareQr(selected.raw, member, new Date(selected.at)) : null,
  )
  const outcomes = $derived(
    scans.map((scan) => {
      const comparison = compareQr(scan.raw, member, new Date(scan.at))
      return comparison.ok ? (comparison.match ? "match" : "mismatch") : "unknown"
    }),
  )
  const matched = $derived(outcomes.filter((outcome) => outcome === "match").length)

  function loadScans(): Scan[] {
    try {
      return JSON.parse(window.localStorage.getItem(storageKey) ?? "[]")
    } catch {
      return []
    }
  }

  $effect(() => {
    const kept = scans.map(({ crop: _, ...scan }) => scan)
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(kept))
    } catch {
      // Storage is a convenience here; the scans still show for this visit.
    }
  })

  // Decode emkay's own code for the selected payload, so its structure sits
  // next to the scanned one and the round trip through a decoder is checked.
  $effect(() => {
    const value = result?.ok ? result.regenerated : null
    let stale = false
    ours = null
    if (!value) return

    const canvas = document.createElement("canvas")
    void QRCode.toCanvas(canvas, qrSegments(value), { ...qrOptions, width: 264 })
      .then(() => {
        const context = canvas.getContext("2d")!
        return decodeQr(context.getImageData(0, 0, canvas.width, canvas.height))
      })
      .then((decoded) => {
        if (stale || decoded?.text !== value) return
        const { text: _, corners: __, ...structure } = decoded
        ours = structure
      })
      .catch(showError)

    return () => {
      stale = true
    }
  })

  function showError(reason: unknown) {
    error = reason instanceof Error ? `${reason.name}: ${reason.message}` : String(reason)
  }

  function addScan(raw: string, source: Scan["source"], decoded?: DecodedQr, crop?: string) {
    const existing = scans.findIndex((scan) => scan.raw === raw)
    if (existing !== -1) {
      // The camera sees the same code many times a second.
      if (source === "paste") selectedIndex = existing
      return
    }

    let structure: Structure | undefined
    if (decoded) {
      const { text: _, corners: __, ...rest } = decoded
      structure = rest
    }
    scans = [{ raw, at: Date.now(), source, structure, crop }, ...scans].slice(0, maxScans)
    selectedIndex = 0
    navigator.vibrate?.(30)
  }

  function cropCode(frame: HTMLCanvasElement, corners: DecodedQr["corners"]) {
    const xs = corners.map((corner) => corner.x)
    const ys = corners.map((corner) => corner.y)
    const pad = (Math.max(...xs) - Math.min(...xs)) * 0.1
    const x = Math.max(0, Math.min(...xs) - pad)
    const y = Math.max(0, Math.min(...ys) - pad)
    const width = Math.min(frame.width, Math.max(...xs) + pad) - x
    const height = Math.min(frame.height, Math.max(...ys) + pad) - y

    const out = document.createElement("canvas")
    out.width = 240
    out.height = Math.round((240 * height) / width)
    out.getContext("2d")!.drawImage(frame, x, y, width, height, 0, 0, out.width, out.height)
    return out.toDataURL("image/jpeg", 0.85)
  }

  async function scanLoop() {
    const frame = document.createElement("canvas")
    const context = frame.getContext("2d", { willReadFrequently: true })!

    while (camera === "running") {
      if (video.videoWidth) {
        frame.width = video.videoWidth
        frame.height = video.videoHeight
        context.drawImage(video, 0, 0)
        try {
          const decoded = await decodeQr(context.getImageData(0, 0, frame.width, frame.height))
          if (decoded) addScan(decoded.text, "camera", decoded, cropCode(frame, decoded.corners))
        } catch (reason) {
          showError(reason)
          stopCamera()
        }
      }
      await new Promise((resolve) => window.setTimeout(resolve, scanInterval))
    }
  }

  async function startCamera() {
    error = ""
    if (!navigator.mediaDevices?.getUserMedia) {
      error = "This browser gives no camera here. The page must be on HTTPS."
      return
    }

    camera = "starting"
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      video.srcObject = stream
      await video.play()
      camera = "running"
      void scanLoop()
    } catch (reason) {
      showError(reason)
      stopCamera()
    }
  }

  function stopCamera() {
    camera = "idle"
    stream?.getTracks().forEach((track) => track.stop())
    stream = null
    if (video) video.srcObject = null
  }

  function checkPasted(event: SubmitEvent) {
    event.preventDefault()
    const raw = pasted.trim()
    if (!raw) return
    addScan(raw, "paste")
    pasted = ""
  }

  async function copySamples() {
    // Oldest first, the order of the samples in qr.test.ts.
    samples = toTestSamples(scans.map((scan) => scan.raw).reverse())
    try {
      await navigator.clipboard.writeText(samples)
      copied = true
    } catch {
      copied = false
    }
  }

  function clearScans() {
    if (!window.confirm("Clear all scans?")) return
    scans = []
    samples = ""
  }

  function skewText(seconds: number) {
    if (seconds === 0) return "same second as this phone"
    const amount =
      Math.abs(seconds) < 120 ? `${Math.abs(seconds)} s` : formatDistanceStrict(0, seconds * 1000)
    return seconds < 0 ? `${amount} behind this phone` : `${amount} ahead of this phone`
  }

  function closeOnEscape(event: KeyboardEvent) {
    if (event.key === "Escape") onclose()
  }

  onMount(() => {
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = overflow
      stopCamera()
    }
  })
</script>

<svelte:window onkeydown={closeOnEscape} />

<div class="debug" role="dialog" aria-modal="true" aria-labelledby="debug-title">
  <header>
    <h1 id="debug-title">QR debug</h1>
    <button type="button" onclick={onclose}>Close</button>
  </header>

  <p class="intro">
    Scan the QR on mkonepass.com. emkay rebuilds it from the scanned card, tier,
    expiry and time, and checks that its payload is identical.
  </p>

  <section class="camera">
    <!-- svelte-ignore a11y_media_has_caption -->
    <video bind:this={video} playsinline muted hidden={camera !== "running"}></video>

    {#if camera === "running"}
      <button type="button" onclick={stopCamera}>Stop camera</button>
    {:else}
      <button
        type="button"
        class="primary"
        onclick={startCamera}
        disabled={camera === "starting"}
      >
        {camera === "starting" ? "Starting camera…" : "Start camera"}
      </button>
    {/if}

    {#if error}
      <p class="error" role="alert">{error}</p>
    {/if}

    <form class="paste" onsubmit={checkPasted}>
      <label for="debug-paste">Or paste a payload</label>
      <div>
        <input
          id="debug-paste"
          bind:value={pasted}
          placeholder="W|…"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
        />
        <button type="submit">Check</button>
      </div>
    </form>
  </section>

  {#if selected && result}
    <section class="result" aria-live="polite">
      {#if !result.ok}
        <p class="verdict bad">Unrecognised payload. {result.reason}.</p>
        <p class="raw"><span>Scanned</span><code>{selected.raw}</code></p>
      {:else}
        <p class="verdict" class:good={result.match} class:bad={!result.match}>
          {#if result.match}
            Match. emkay makes the same payload.
          {:else}
            Mismatch in {result.rows
              .filter((row) => !row.ok)
              .map((row) => row.label)
              .join(" and ")}.
          {/if}
        </p>

        <table>
          <thead>
            <tr><th>Field</th><th>Scanned</th><th>emkay</th><th></th></tr>
          </thead>
          <tbody>
            <!-- The digits after the card in one row, then each on its own. -->
            {#each [result.rows[0], result.digits, ...result.rows.slice(1)] as row}
              <tr class:bad={!row.ok}>
                <th>{row.label}</th>
                <td><code>{row.scanned}</code></td>
                <td><code>{row.expected}</code></td>
                <td>{row.ok ? "✓" : "✗"}</td>
              </tr>
            {/each}
          </tbody>
        </table>

        <h2>Against the card emkay shows</h2>
        <table>
          <thead>
            <tr><th>Field</th><th>Scanned</th><th>emkay</th><th></th></tr>
          </thead>
          <tbody>
            {#each result.member as row}
              <tr class:bad={!row.ok}>
                <th>{row.label}</th>
                <td><code>{row.scanned}</code></td>
                <td><code>{row.expected}</code></td>
                <td>{row.ok ? "✓" : "✗"}</td>
              </tr>
            {/each}
          </tbody>
        </table>

        <p class="clock">
          Code made at {format(parseTimestamp(result.fields.timestamp), "d MMM yyyy, HH:mm:ss")},
          {skewText(result.skewSeconds)}.
        </p>

        <div class="codes">
          <figure>
            {#if selected.crop}
              <img src={selected.crop} alt="The scanned QR code" />
            {:else}
              <div class="no-image">No image for pasted or earlier scans</div>
            {/if}
            <figcaption>Scanned</figcaption>
          </figure>
          <figure>
            <div class="qr" use:drawQr={result.regenerated} aria-hidden="true"></div>
            <figcaption>emkay</figcaption>
          </figure>
        </div>

        <table>
          <thead>
            <tr><th>Symbol</th><th>Scanned</th><th>emkay</th></tr>
          </thead>
          <tbody>
            {#each [["Version", "version"], ["EC level", "ecLevel"], ["Mask", "dataMask"], ["Content", "contentType"]] as [label, key]}
              <tr>
                <th>{label}</th>
                <td>{selected.structure?.[key as keyof Structure] ?? "–"}</td>
                <td>{ours?.[key as keyof Structure] ?? "…"}</td>
              </tr>
            {/each}
          </tbody>
        </table>
        <p class="note">
          emkay uses EC level Q on purpose where the app uses M, so that row and
          the mask can differ. Only the payload has to match.
        </p>

        <p class="raw"><span>Scanned</span><code>{selected.raw}</code></p>
        <p class="raw"><span>emkay</span><code>{result.regenerated}</code></p>
      {/if}
    </section>
  {/if}

  <section class="history">
    <div class="history-head">
      <h2>Scans: {matched} of {scans.length} match</h2>
      <div>
        <button type="button" onclick={copySamples} disabled={!scans.length}>
          Copy as test samples
        </button>
        <button type="button" onclick={clearScans} disabled={!scans.length}>Clear</button>
      </div>
    </div>

    {#if samples}
      <label class="samples">
        {copied ? "Copied. Paste into the samples of qr.test.ts." : "Copy these into the samples of qr.test.ts."}
        <textarea readonly rows="4" value={samples}></textarea>
      </label>
    {/if}

    <ol>
      {#each scans as scan, index (scan.raw)}
        <li>
          <button
            type="button"
            class:current={index === selectedIndex}
            aria-current={index === selectedIndex}
            onclick={() => (selectedIndex = index)}
          >
            <span class={`mark ${outcomes[index]}`}>
              {outcomes[index] === "match" ? "✓" : outcomes[index] === "mismatch" ? "✗" : "?"}
            </span>
            <time datetime={new Date(scan.at).toISOString()}>
              {format(scan.at, "HH:mm:ss")}
            </time>
            <code>{scan.raw}</code>
          </button>
        </li>
      {/each}
    </ol>
  </section>
</div>

<style>
  .debug {
    --good: #1b7f3b;
    --bad: #c8102e;
    --line: #e2e2e2;
    --muted: #5c5c5c;

    position: fixed;
    z-index: 1000;
    inset: 0;
    overflow-y: auto;
    padding: calc(12px + env(safe-area-inset-top)) 16px
      calc(24px + env(safe-area-inset-bottom));
    background: #fff;
    color: #252525;
    font-size: 14px;
    line-height: 20px;
    overscroll-behavior: contain;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  h1 {
    margin: 0;
    font-size: 20px;
    line-height: 28px;
  }

  h2 {
    margin: 16px 0 8px;
    font-size: 15px;
  }

  button {
    min-height: 40px;
    padding: 0 14px;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: #fff;
    color: inherit;
    font: inherit;
  }

  button:disabled {
    opacity: 0.5;
  }

  button.primary {
    width: 100%;
    border-color: var(--bad);
    background: var(--bad);
    color: #fff;
    font-weight: 600;
  }

  .intro,
  .note,
  .clock {
    color: var(--muted);
  }

  .intro {
    margin: 0 0 12px;
  }

  video {
    display: block;
    width: 100%;
    max-height: 50vh;
    margin-bottom: 8px;
    border-radius: 8px;
    background: #000;
    object-fit: cover;
  }

  video[hidden] {
    display: none;
  }

  .camera > button {
    width: 100%;
  }

  .error {
    color: var(--bad);
    word-break: break-word;
  }

  .paste {
    margin-top: 12px;
  }

  .paste label {
    display: block;
    margin-bottom: 4px;
    color: var(--muted);
  }

  .paste div {
    display: flex;
    gap: 8px;
  }

  .paste input {
    min-width: 0;
    min-height: 40px;
    flex: 1;
    padding: 0 10px;
    border: 1px solid var(--line);
    border-radius: 8px;
    font: 13px/1 ui-monospace, monospace;
  }

  .result {
    margin-top: 16px;
  }

  .verdict {
    padding: 10px 12px;
    margin: 0 0 12px;
    border-radius: 8px;
    font-weight: 600;
  }

  .verdict.good {
    background: #e6f4ea;
    color: var(--good);
  }

  .verdict.bad {
    background: #fde8eb;
    color: var(--bad);
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 6px 4px;
    border-bottom: 1px solid var(--line);
    text-align: left;
    vertical-align: top;
  }

  thead th {
    color: var(--muted);
    font-size: 12px;
    font-weight: 500;
  }

  tr.bad th,
  tr.bad td {
    color: var(--bad);
    font-weight: 600;
  }

  code {
    font: 12px/18px ui-monospace, monospace;
    word-break: break-all;
  }

  .codes {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin: 12px 0;
  }

  figure {
    margin: 0;
    text-align: center;
  }

  figure img,
  .qr,
  .no-image {
    width: 100%;
    aspect-ratio: 1;
    border: 1px solid var(--line);
    border-radius: 8px;
    object-fit: contain;
  }

  .qr :global(svg) {
    display: block;
    width: 100%;
    height: 100%;
  }

  .no-image {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    color: var(--muted);
    font-size: 12px;
  }

  figcaption {
    margin-top: 4px;
    color: var(--muted);
  }

  .raw {
    display: grid;
    grid-template-columns: 64px 1fr;
    margin: 6px 0;
  }

  .raw span {
    color: var(--muted);
  }

  .history-head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: 16px;
  }

  .history-head h2 {
    margin: 0;
  }

  .history-head div {
    display: flex;
    gap: 8px;
  }

  .samples {
    display: block;
    margin-top: 8px;
    color: var(--muted);
  }

  .samples textarea {
    width: 100%;
    margin-top: 4px;
    font: 12px/18px ui-monospace, monospace;
  }

  ol {
    padding: 0;
    margin: 8px 0 0;
    list-style: none;
  }

  li button {
    display: grid;
    width: 100%;
    grid-template-columns: 20px 64px 1fr;
    align-items: start;
    padding: 8px 4px;
    border: 0;
    border-bottom: 1px solid var(--line);
    border-radius: 0;
    text-align: left;
  }

  li button.current {
    background: #f5f5f5;
  }

  .mark.match {
    color: var(--good);
  }

  .mark.mismatch,
  .mark.unknown {
    color: var(--bad);
  }
</style>
