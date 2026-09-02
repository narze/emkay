import { format } from "date-fns"

// Verhoeff check digit tables (dihedral group D5).
const D = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
]

const P = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
]

const INV = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9]

/** Standard Verhoeff check digit of a digit string. */
export function verhoeff(digits: string): number {
  if (!/^\d+$/.test(digits)) {
    throw new Error(`verhoeff: expected digits, got "${digits}"`)
  }

  let c = 0
  const reversed = [...digits].reverse()
  for (let i = 0; i < reversed.length; i++) {
    c = D[c][P[(i + 1) % 8][Number(reversed[i])]]
  }
  return INV[c]
}

export type QrInput = {
  /** 16-digit membership card number. */
  cardNumber: string
  /** tier_id from the MKONE API (3 = GOLD). */
  tierId: number
  /** Card expiry as yyyy-MM-dd. */
  expireDate: string
  /** Time the QR is generated. Encoded in local time. */
  at: Date
}

/**
 * Build the MKONE member QR payload, matching the GetCustomerCard API:
 *
 *   W|<card><tier><A><C>|<expire yyyyMMdd>|<generated yyyyMMddHHmmss>
 *
 * A is the Verhoeff check digit of card + tier + timestamp, and C is A
 * multiplied by 1 in the Verhoeff D5 group (row 1 of the D table).
 */
export function buildQrValue({ cardNumber, tierId, expireDate, at }: QrInput): string {
  const timestamp = format(at, "yyyyMMddHHmmss")
  const expire = expireDate.replaceAll("-", "")
  const a = verhoeff(`${cardNumber}${tierId}${timestamp}`)
  const c = D[1][a]

  return `W|${cardNumber}${tierId}${a}${c}|${expire}|${timestamp}`
}
