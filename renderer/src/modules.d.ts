declare module "qrcode" {
  type ErrorCorrectionLevel = "L" | "M" | "Q" | "H"

  type CanvasOptions = {
    errorCorrectionLevel?: ErrorCorrectionLevel
    margin?: number
    width?: number
  }

  type StringOptions = {
    type?: "svg" | "utf8" | "terminal"
    errorCorrectionLevel?: ErrorCorrectionLevel
    margin?: number
    version?: number
    width?: number
  }

  type Segment = {
    data: string
    mode: "numeric" | "alphanumeric" | "byte" | "kanji"
  }

  type QRCode = {
    toString(
      value: string | Segment[],
      options?: StringOptions,
    ): Promise<string>
    toCanvas(
      canvas: HTMLCanvasElement,
      value: string,
      options?: CanvasOptions,
    ): Promise<void>
  }

  const QRCode: QRCode
  export default QRCode
}

declare module "canvas-circular-countdown"
