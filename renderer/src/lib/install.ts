// The card must not be shown in a browser tab on a phone: the address bar
// there shows the URL, which gives away that this is not the MKONE app. On a
// phone the page only renders when it runs from the home screen, where the
// manifest's standalone display hides the browser UI.

export type Platform = "ios" | "android" | "desktop"

export type InAppBrowser = "line" | "other" | null

export type Device = {
  userAgent: string
  platform: string
  maxTouchPoints: number
}

// LINE opens a link in the phone's default browser when the URL carries this
// query parameter.
export const lineExternalParam = "openExternalBrowser"

export function detectPlatform(device: Device): Platform {
  if (/iPad|iPhone|iPod/.test(device.userAgent)) return "ios"
  // iPadOS asks for the desktop site, so it reports itself as a Mac with touch.
  if (device.platform === "MacIntel" && device.maxTouchPoints > 1) return "ios"
  if (/Android/i.test(device.userAgent)) return "android"
  return "desktop"
}

// Browsers built into chat and social apps. None of them can add a page to
// the home screen, so the member has to open the page in a real browser first.
export function detectInAppBrowser(userAgent: string): InAppBrowser {
  if (/\bLine\//i.test(userAgent)) return "line"
  if (/FBAN|FBAV|FB_IAB|FBIOS|Instagram|musical_ly|BytedanceWebview|; wv\)/.test(userAgent)) {
    return "other"
  }
  return null
}

export function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // Safari on iOS reports a home screen launch here instead.
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

export function currentDevice(): Device {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    maxTouchPoints: navigator.maxTouchPoints,
  }
}

export function mustInstall(platform: Platform, standalone: boolean): boolean {
  return platform !== "desktop" && !standalone
}

// An Android intent URL that opens the same page in Chrome from an in-app
// browser.
export function chromeIntentUrl(url: URL): string {
  return `intent://${url.host}${url.pathname}${url.search}#Intent;scheme=${url.protocol.replace(":", "")};package=com.android.chrome;end`
}
