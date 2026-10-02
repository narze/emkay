import {
  prepareZXingModule,
  readBarcodes,
  type ReadResult,
  type ZXingModuleOverrides,
} from "zxing-wasm/reader"
import wasmUrl from "zxing-wasm/reader/zxing_reader.wasm?url"

export type DecodedQr = {
  text: string
  /** QR version, 1 to 40. Version 4 is the 33x33 grid. */
  version: string
  ecLevel: string
  dataMask: string
  contentType: string
  /** Corners of the code in the decoded image, in pixels. */
  corners: { x: number; y: number }[]
}

let prepared = false

/**
 * Loads the decoder from this site's own build rather than the jsDelivr CDN
 * that zxing-wasm defaults to. Tests pass `wasmBinary` instead.
 */
export function prepareDecoder(overrides?: ZXingModuleOverrides) {
  prepared = true
  prepareZXingModule({
    overrides: overrides ?? {
      locateFile: (path: string, prefix: string) =>
        path.endsWith(".wasm") ? wasmUrl : prefix + path,
    },
  })
}

function describe(result: ReadResult): DecodedQr {
  let extra: Record<string, unknown> = {}
  try {
    extra = JSON.parse(result.extra || "{}")
  } catch {
    // Older builds leave this empty; fall back to the deprecated fields.
  }
  const { topLeft, topRight, bottomRight, bottomLeft } = result.position

  return {
    text: result.text,
    version: String(extra.Version ?? result.version),
    ecLevel: String(extra.ECLevel ?? result.ecLevel),
    dataMask: String(extra.DataMask ?? "?"),
    contentType: result.contentType,
    corners: [topLeft, topRight, bottomRight, bottomLeft],
  }
}

/** The first valid QR code in an image, or null when there is none. */
export async function decodeQr(
  image: ImageData | Uint8Array | Blob,
): Promise<DecodedQr | null> {
  if (!prepared) prepareDecoder()

  const [result] = await readBarcodes(image, {
    formats: ["QRCode"],
    tryHarder: true,
    maxNumberOfSymbols: 1,
  })
  return result?.isValid ? describe(result) : null
}
