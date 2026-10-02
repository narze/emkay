import { describe, expect, it } from "vitest"

import { compareQr, parseQrValue, toTestSamples } from "./qrDebug"

const member = { cardNumber: "1126082006025800", tierId: 3, expireDate: "2026-12-31" }
const now = new Date(2026, 8, 2, 23, 24, 10)

// Captured from GetCustomerCard; also the samples of qr.test.ts.
const real = [
  "W|1126082006025800340|20261231|20260902224627",
  "W|1126082006025800301|20261231|20260902224630",
  "W|1126082006025800395|20261231|20260902224832",
  "W|1126082006025800312|20261231|20260902232410",
  "W|1126082006025800356|20261231|20260902232415",
  "W|1126082006025800334|20261231|20260902232419",
  "W|1126082006025800395|20261231|20260902233206",
]

describe("parseQrValue", () => {
  it("splits a payload into its fields", () => {
    expect(parseQrValue(real[0])).toEqual({
      ok: true,
      fields: {
        cardNumber: "1126082006025800",
        tierId: 3,
        a: 4,
        c: 0,
        expire: "20261231",
        timestamp: "20260902224627",
      },
    })
  })

  it.each([
    ["", "format"],
    ["X|1126082006025800340|20261231|20260902224627", "format"],
    ["W|112608200602580034|20261231|20260902224627", "format"],
    ["W|1126082006025800340|20261231|20261302224627", "not a real date"],
  ])("rejects %j", (raw, reason) => {
    const parsed = parseQrValue(raw)
    expect(parsed.ok).toBe(false)
    expect(parsed.ok ? "" : parsed.reason).toContain(reason)
  })
})

describe("compareQr", () => {
  it.each(real)("matches the real app's %s", (raw) => {
    const result = compareQr(raw, member, now)
    expect(result.ok && result.match).toBe(true)
    expect(result.ok && result.digits).toMatchObject({ scanned: raw.slice(18, 21), ok: true })
    expect(result.ok && result.member.every((row) => row.ok)).toBe(true)
  })

  it("points at check digit A when it is off", () => {
    // A is 5 where the app's is 4, with C = D[1][5] = 6 to go with it.
    const result = compareQr("W|1126082006025800356|20261231|20260902224627", member, now)
    if (!result.ok) throw new Error(result.reason)
    expect(result.match).toBe(false)
    expect(result.rows.filter((row) => !row.ok).map((row) => row.label)).toEqual([
      "Check A",
      "Check C",
    ])
    expect(result.rows.find((row) => row.label === "Check A")).toMatchObject({
      scanned: "5",
      expected: "4",
    })
    expect(result.digits).toMatchObject({ scanned: "356", expected: "340", ok: false })
  })

  it("points at check digit C alone when only it is off", () => {
    const result = compareQr("W|1126082006025800349|20261231|20260902224627", member, now)
    if (!result.ok) throw new Error(result.reason)
    expect(result.rows.filter((row) => !row.ok).map((row) => row.label)).toEqual(["Check C"])
  })

  it("flags a tier and expiry that differ from what emkay shows", () => {
    // A real-looking code for a BLACK card with another expiry.
    const raw = compareQr("W|1126082006025800200|20271231|20260902224627", member, now)
    if (!raw.ok) throw new Error(raw.reason)
    const result = compareQr(raw.regenerated, member, now)
    if (!result.ok) throw new Error(result.reason)
    expect(result.match).toBe(true)
    expect(result.member.filter((row) => !row.ok).map((row) => row.label)).toEqual([
      "Tier",
      "Expiry",
    ])
  })

  it("reports how far the code's clock is from this device", () => {
    const result = compareQr(real[3], member, new Date(2026, 8, 2, 23, 24, 25))
    expect(result.ok && result.skewSeconds).toBe(-15)
  })
})

describe("toTestSamples", () => {
  it("formats valid payloads as qr.test.ts samples", () => {
    expect(toTestSamples([real[0], "junk"])).toBe(
      `  ["20260902224627", "${real[0]}"],`,
    )
  })
})
