// The debug scanner opens after a run of quick taps on the MK logo, so a
// member never finds it by accident.

/** Returns a function that reports true on the `count`th tap of a quick run. */
export function tapCounter(count: number, maxGapMs: number) {
  let taps = 0
  let last = -Infinity

  return (at: number) => {
    taps = at - last <= maxGapMs ? taps + 1 : 1
    last = at
    if (taps < count) return false

    taps = 0
    last = -Infinity
    return true
  }
}

/** Svelte action: calls `onunlock` after 5 quick taps. Does nothing without it. */
export function secretTaps(node: HTMLElement, onunlock?: () => void) {
  let unlock = onunlock
  const tap = tapCounter(5, 800)

  const handle = (event: MouseEvent) => {
    if (!unlock || !tap(event.timeStamp)) return

    // A small bounce on the logo tells the tapper the debug mode took.
    node.classList.remove("debug-bounce")
    void node.offsetWidth // restart the animation if it is still running
    node.classList.add("debug-bounce")
    unlock()
  }
  const settle = () => node.classList.remove("debug-bounce")
  node.addEventListener("animationend", settle)
  node.addEventListener("click", handle)

  return {
    update(next?: () => void) {
      unlock = next
    },
    destroy() {
      node.removeEventListener("click", handle)
      node.removeEventListener("animationend", settle)
    },
  }
}
