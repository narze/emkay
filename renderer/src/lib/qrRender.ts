import QRCode from "qrcode"

// One byte segment, as the MKONE app encodes it, which puts the payload in
// version 4 for a 33x33 grid that matches the app's. Level Q rather than the
// app's M: it needs the same version, so the grid is identical, but error
// correction rises from 15% to 25%. The card renders this 10% larger than
// the app does to keep the modules big enough to scan.
export const qrOptions = { errorCorrectionLevel: "Q", margin: 1 } as const

export function qrSegments(value: string) {
  return [{ data: value, mode: "byte" as const }]
}

/** Svelte action that renders `value` as an SVG QR code inside the node. */
export function drawQr(node: HTMLElement, value: string) {
  let latest = value

  const render = (next: string) => {
    latest = next
    void QRCode.toString(qrSegments(next), { type: "svg", ...qrOptions }).then(
      (svg) => {
        // A slower render must not overwrite a newer code.
        if (next === latest) node.innerHTML = svg
      },
    )
  }

  render(value)

  return { update: render }
}
