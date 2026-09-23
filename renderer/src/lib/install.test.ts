import { describe, expect, it } from "vitest"

import {
  chromeIntentUrl,
  detectInAppBrowser,
  detectPlatform,
  mustInstall,
} from "./install"

const iphoneSafari =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1"
const ipadSafari =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15"
const androidChrome =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36"
const macChrome =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
const iphoneLine =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Safari Line/14.14.0"
const androidMessenger =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/AP2A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/128.0.0.0 Mobile Safari/537.36 [FB_IAB/Orca-Android;FBAV/470.0.0.0;]"

describe("detectPlatform", () => {
  it("finds iPhones and iPads", () => {
    expect(detectPlatform({ userAgent: iphoneSafari, platform: "iPhone", maxTouchPoints: 5 })).toBe("ios")
    expect(detectPlatform({ userAgent: ipadSafari, platform: "MacIntel", maxTouchPoints: 5 })).toBe("ios")
  })

  it("finds Android", () => {
    expect(detectPlatform({ userAgent: androidChrome, platform: "Linux armv8l", maxTouchPoints: 5 })).toBe("android")
  })

  it("treats a Mac without touch as desktop", () => {
    expect(detectPlatform({ userAgent: macChrome, platform: "MacIntel", maxTouchPoints: 0 })).toBe("desktop")
  })
})

describe("detectInAppBrowser", () => {
  it("finds LINE and Messenger", () => {
    expect(detectInAppBrowser(iphoneLine)).toBe("line")
    expect(detectInAppBrowser(androidMessenger)).toBe("other")
  })

  it("passes real browsers", () => {
    expect(detectInAppBrowser(iphoneSafari)).toBeNull()
    expect(detectInAppBrowser(androidChrome)).toBeNull()
  })
})

describe("mustInstall", () => {
  it("gates phones outside the home screen only", () => {
    expect(mustInstall("ios", false)).toBe(true)
    expect(mustInstall("android", false)).toBe(true)
    expect(mustInstall("ios", true)).toBe(false)
    expect(mustInstall("desktop", false)).toBe(false)
  })
})

describe("chromeIntentUrl", () => {
  it("keeps the host, path and query", () => {
    expect(chromeIntentUrl(new URL("https://example.com/a?b=1"))).toBe(
      "intent://example.com/a?b=1#Intent;scheme=https;package=com.android.chrome;end",
    )
  })
})
