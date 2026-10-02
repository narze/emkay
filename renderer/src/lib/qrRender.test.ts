import { readFile } from "node:fs/promises"
import { createRequire } from "node:module"

import QRCode from "qrcode"
import { beforeAll, describe, expect, it } from "vitest"

import { qrOptions, qrSegments } from "./qrRender"
import { decodeQr, prepareDecoder } from "./zxing"

beforeAll(async () => {
  const require = createRequire(import.meta.url)
  const wasm = await readFile(require.resolve("zxing-wasm/reader/zxing_reader.wasm"))
  prepareDecoder({ wasmBinary: wasm.buffer.slice(wasm.byteOffset, wasm.byteOffset + wasm.byteLength) })
})

describe("the card's QR", () => {
  it("decodes back to its payload as version 4, level Q", async () => {
    const value = "W|1126082006025800340|20261231|20260902224627"
    const png = await QRCode.toBuffer(qrSegments(value), { ...qrOptions, width: 264 })
    const decoded = await decodeQr(new Uint8Array(png))

    expect(decoded).toMatchObject({ text: value, version: "4", ecLevel: "Q" })
  })
})
