declare module "qrcode" {
  type ErrorCorrectionLevel = "L" | "M" | "Q" | "H"

  type CanvasOptions = {
    errorCorrectionLevel?: ErrorCorrectionLevel
    margin?: number
    width?: number
  }

  type QRCode = {
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
