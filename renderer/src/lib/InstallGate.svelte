<script lang="ts">
  import { onMount } from "svelte"

  import background from "../assets/mkone/img/background.jpg"
  import headerLogo from "../assets/mkone/img/mk-one-logo.png"
  import {
    chromeIntentUrl,
    currentDevice,
    detectInAppBrowser,
    detectPlatform,
    lineExternalParam,
  } from "./install"

  type InstallPromptEvent = Event & {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
  }

  const platform = detectPlatform(currentDevice())
  const inApp = detectInAppBrowser(navigator.userAgent)

  let installPrompt: InstallPromptEvent | null = null
  let installed = false

  async function install() {
    if (!installPrompt) return
    const event = installPrompt
    installPrompt = null
    await event.prompt()
    const { outcome } = await event.userChoice
    if (outcome === "accepted") installed = true
  }

  onMount(() => {
    const url = new URL(window.location.href)

    if (inApp === "line" && !url.searchParams.has(lineExternalParam)) {
      // LINE hands the link to the phone's default browser.
      url.searchParams.set(lineExternalParam, "1")
      window.location.replace(url)
    } else if (!inApp && url.searchParams.has(lineExternalParam)) {
      // Safari adds the page to the home screen at its current URL, so drop
      // the LINE parameter before the member does that.
      url.searchParams.delete(lineExternalParam)
      window.history.replaceState(null, "", url)
    }

    const capturePrompt = (event: Event) => {
      event.preventDefault()
      installPrompt = event as InstallPromptEvent
    }

    const markInstalled = () => {
      installPrompt = null
      installed = true
    }

    window.addEventListener("beforeinstallprompt", capturePrompt)
    window.addEventListener("appinstalled", markInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", capturePrompt)
      window.removeEventListener("appinstalled", markInstalled)
    }
  })
</script>

<div class="app-shell gate" style:--app-background={`url(${background})`}>
  <img class="gate-logo" src={headerLogo} alt="MKONE" />

  <main class="gate-card">
    <img class="gate-icon" src="/icons/mkone-192.png" alt="" />

    {#if installed}
      <h1>ติดตั้ง MKONE แล้ว</h1>
      <p class="gate-lead">เปิด MKONE จากไอคอนบนหน้าจอโฮมเพื่อใช้บัตรสมาชิก</p>
    {:else if inApp}
      <h1>เปิดในเบราว์เซอร์</h1>
      <p class="gate-lead">
        แอปแชทเพิ่ม MKONE ลงหน้าจอโฮมไม่ได้ ให้เปิดหน้านี้ใน{platform === "ios"
          ? " Safari "
          : " Chrome "}ก่อน
      </p>
      {#if platform === "android"}
        <a class="gate-action" href={chromeIntentUrl(new URL(window.location.href))}>
          เปิดใน Chrome
        </a>
      {/if}
      <ol>
        <li>แตะเมนู (⋯ หรือ ⋮) ที่มุมจอ</li>
        <li>เลือก "เปิดในเบราว์เซอร์" (Open in browser)</li>
      </ol>
    {:else if platform === "ios"}
      <h1>เพิ่ม MKONE ลงหน้าจอโฮม</h1>
      <ol>
        <li>แตะปุ่ม "แชร์" (Share)</li>
        <li>เลื่อนลงและแตะ "เพิ่มไปยังหน้าจอโฮม" (Add to Home Screen)</li>
        <li>แตะ "เพิ่ม" (Add) ที่มุมบนขวา</li>
        <li>เปิด MKONE จากไอคอนบนหน้าจอโฮม</li>
      </ol>
      <p class="gate-note">ถ้าไม่เจอปุ่มแชร์ ให้เปิดหน้านี้ใน Safari</p>
    {:else}
      <h1>ติดตั้ง MKONE</h1>
      {#if installPrompt}
        <button type="button" class="gate-action" onclick={install}>
          ติดตั้งแอป
        </button>
      {:else}
        <ol>
          <li>แตะเมนู (⋮) ของเบราว์เซอร์</li>
          <li>เลือก "ติดตั้งแอป" หรือ "เพิ่มลงในหน้าจอหลัก"</li>
          <li>เปิด MKONE จากไอคอนบนหน้าจอโฮม</li>
        </ol>
      {/if}
    {/if}
  </main>
</div>

<style>
  .gate {
    display: flex;
    padding: calc(28px + env(safe-area-inset-top)) 16px
      calc(28px + env(safe-area-inset-bottom));
    flex-direction: column;
    align-items: center;
    gap: 28px;
  }

  .gate-logo {
    width: 140px;
    height: auto;
  }

  .gate-card {
    display: flex;
    width: 100%;
    padding: 24px 20px;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    border-radius: 16px;
    background: #fff;
    box-shadow:
      0 10px 15px -3px rgb(0 0 0 / 10%),
      0 4px 6px -4px rgb(0 0 0 / 10%);
    text-align: center;
  }

  .gate-icon {
    width: 72px;
    height: 72px;
    border-radius: 16px;
    box-shadow: 0 0 0 1px #f0f0f0;
  }

  h1 {
    font-size: 20px;
    font-weight: 700;
    line-height: 30px;
  }

  .gate-lead {
    color: #4b4b4b;
    font-size: 14px;
    line-height: 22px;
  }

  .gate-action {
    display: flex;
    min-height: 48px;
    padding: 0 24px;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 10px;
    background: #c70027;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    text-decoration: none;
    cursor: pointer;
  }

  .gate-action:focus-visible {
    outline: 2px solid #c70027;
    outline-offset: 2px;
  }

  ol {
    width: 100%;
    padding: 16px 16px 16px 36px;
    margin: 4px 0 0;
    border-radius: 12px;
    background: #f9fafb;
    color: #252525;
    font-size: 14px;
    line-height: 22px;
    text-align: left;
  }

  li + li {
    margin-top: 6px;
  }

  .gate-note {
    color: #6b6b6b;
    font-size: 12px;
    line-height: 18px;
  }
</style>
