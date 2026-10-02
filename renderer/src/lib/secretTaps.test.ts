import { describe, expect, it } from "vitest"

import { tapCounter } from "./secretTaps"

describe("tapCounter", () => {
  it("unlocks on the 5th quick tap, then starts over", () => {
    const tap = tapCounter(5, 800)
    const results = Array.from({ length: 10 }, (_, i) => tap(i * 300))
    expect(results.map((r, i) => (r ? i + 1 : 0)).filter(Boolean)).toEqual([5, 10])
  })

  it("starts over after a slow tap", () => {
    const tap = tapCounter(5, 800)
    for (let i = 0; i < 4; i++) expect(tap(i * 300)).toBe(false)
    // A pause before the 5th tap makes it the 1st of a new run.
    expect(tap(3 * 300 + 801)).toBe(false)
  })
})
