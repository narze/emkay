import { describe, expect, it } from "vitest"

import { buildQrValue, verhoeff } from "./qr"

// Samples captured from GetCustomerCard for card 1126082006025800 (tier_id 3).
const samples: [string, string][] = [
  ["20260902224627", "W|1126082006025800340|20261231|20260902224627"],
  ["20260902224630", "W|1126082006025800301|20261231|20260902224630"],
  ["20260902224832", "W|1126082006025800395|20261231|20260902224832"],
  ["20260902232410", "W|1126082006025800312|20261231|20260902232410"],
  ["20260902232415", "W|1126082006025800356|20261231|20260902232415"],
  ["20260902232419", "W|1126082006025800334|20261231|20260902232419"],
  ["20260902233206", "W|1126082006025800395|20261231|20260902233206"],
]

function toDate(ts: string): Date {
  const [y, mo, d, h, mi, s] = [
    ts.slice(0, 4),
    ts.slice(4, 6),
    ts.slice(6, 8),
    ts.slice(8, 10),
    ts.slice(10, 12),
    ts.slice(12, 14),
  ].map(Number)
  return new Date(y, mo - 1, d, h, mi, s)
}

describe("verhoeff", () => {
  it("computes the standard Verhoeff check digit", () => {
    expect(verhoeff("236")).toBe(3)
    expect(verhoeff("1126082006025800320260902232410")).toBe(1)
  })

  it("rejects non-digit input", () => {
    expect(() => verhoeff("12a")).toThrow()
  })
})

describe("buildQrValue", () => {
  it.each(samples)("matches the API value at %s", (ts, expected) => {
    const value = buildQrValue({
      cardNumber: "1126082006025800",
      tierId: 3,
      expireDate: "2026-12-31",
      at: toDate(ts),
    })
    expect(value).toBe(expected)
  })
})
