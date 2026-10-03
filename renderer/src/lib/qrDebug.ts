import { format } from "date-fns"

import { buildQrValue, parseTimestamp } from "./qr"

// Checks a QR payload scanned from the real MKONE app against the one
// buildQrValue makes from the same card, tier, expiry and timestamp. Only the
// check digits A and C are computed, so a mismatch there means the algorithm
// is wrong, while the other fields show whether data.json is out of date.

const pattern = /^W\|(\d{16})(\d)(\d)(\d)\|(\d{8})\|(\d{14})$/

export type QrFields = {
  cardNumber: string
  tierId: number
  a: number
  c: number
  /** yyyyMMdd */
  expire: string
  /** yyyyMMddHHmmss, in the local time of the device that made the code. */
  timestamp: string
}

export type ParseResult =
  | { ok: true; fields: QrFields }
  | { ok: false; reason: string }

export function parseQrValue(raw: string): ParseResult {
  const match = pattern.exec(raw)
  if (!match) {
    return { ok: false, reason: "Not in the W|card tier A C|expiry|timestamp format" }
  }

  const [, cardNumber, tier, a, c, expire, timestamp] = match
  if (format(parseTimestamp(timestamp), "yyyyMMddHHmmss") !== timestamp) {
    return { ok: false, reason: `Timestamp ${timestamp} is not a real date and time` }
  }

  return {
    ok: true,
    fields: {
      cardNumber,
      tierId: Number(tier),
      a: Number(a),
      c: Number(c),
      expire,
      timestamp,
    },
  }
}

export type Row = {
  label: string
  scanned: string
  expected: string
  ok: boolean
}

export type Member = {
  cardNumber: string
  tierId: number
  /** yyyy-MM-dd */
  expireDate: string
}

export type Comparison =
  | {
      ok: true
      raw: string
      fields: QrFields
      regenerated: string
      /** The scanned payload is exactly the one emkay would make. */
      match: boolean
      /** Each field of the scanned payload against the regenerated one. */
      rows: Row[]
      /** The tier, A and C digits that follow the card number, together. */
      digits: Row
      /** The scanned card, tier and expiry against what emkay shows. */
      member: Row[]
      /** Seconds the code's timestamp is ahead (+) or behind (-) this device. */
      skewSeconds: number
    }
  | { ok: false; raw: string; reason: string }

// tier_id of a card in the MKONE API.
const tierNames: Record<number, string> = { 1: "RED", 2: "BLACK", 3: "GOLD" }

/** "3 (GOLD)", or just the id for a tier emkay does not know. */
export function describeTier(tierId: number): string {
  const name = tierNames[tierId]
  return name ? `${tierId} (${name})` : String(tierId)
}

function hyphenate(yyyymmdd: string): string {
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`
}

export function compareQr(raw: string, member: Member, now: Date): Comparison {
  const parsed = parseQrValue(raw)
  if (!parsed.ok) return { ok: false, raw, reason: parsed.reason }

  const scanned = parsed.fields
  const at = parseTimestamp(scanned.timestamp)
  const regenerated = buildQrValue({
    cardNumber: scanned.cardNumber,
    tierId: scanned.tierId,
    expireDate: hyphenate(scanned.expire),
    at,
  })
  // buildQrValue always makes a payload in the pattern above.
  const ours = (parseQrValue(regenerated) as { ok: true; fields: QrFields }).fields

  const row = (label: string, a: string | number, b: string | number): Row => ({
    label,
    scanned: String(a),
    expected: String(b),
    ok: String(a) === String(b),
  })

  return {
    ok: true,
    raw,
    fields: scanned,
    regenerated,
    match: raw === regenerated,
    rows: [
      row("Card", scanned.cardNumber, ours.cardNumber),
      row("Tier", describeTier(scanned.tierId), describeTier(ours.tierId)),
      row("Check A", scanned.a, ours.a),
      row("Check C", scanned.c, ours.c),
      row("Expiry", scanned.expire, ours.expire),
      row("Timestamp", scanned.timestamp, ours.timestamp),
    ],
    digits: row(
      "After card",
      `${scanned.tierId}${scanned.a}${scanned.c}`,
      `${ours.tierId}${ours.a}${ours.c}`,
    ),
    member: [
      row("Card", scanned.cardNumber, member.cardNumber),
      row("Tier", describeTier(scanned.tierId), describeTier(member.tierId)),
      row("Expiry", hyphenate(scanned.expire), member.expireDate),
    ],
    skewSeconds: Math.round((at.getTime() - now.getTime()) / 1000),
  }
}

/** Lines to paste into the samples of qr.test.ts. */
export function toTestSamples(raws: string[]): string {
  return raws
    .flatMap((raw) => {
      const parsed = parseQrValue(raw)
      return parsed.ok ? [`  ["${parsed.fields.timestamp}", "${raw}"],`] : []
    })
    .join("\n")
}
