import { describe, expect, it } from "vitest"

import { tapCounter } from "./secretTaps"

describe("tapCounter", () => {
  it("unlocks on the 8th quick tap, then starts over", () => {
    const tap = tapCounter(8, 800)
    const results = Array.from({ length: 16 }, (_, i) => tap(i * 300))
    expect(results.map((r, i) => (r ? i + 1 : 0)).filter(Boolean)).toEqual([8, 16])
  })

  it("starts over after a slow tap", () => {
    const tap = tapCounter(8, 800)
    for (let i = 0; i < 7; i++) expect(tap(i * 300)).toBe(false)
    // A pause before the 8th tap makes it the 1st of a new run.
    expect(tap(6 * 300 + 801)).toBe(false)
  })
})
