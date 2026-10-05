#!/usr/bin/env node
// Update acc_points and updated_at in scraper/data.json from values read off
// an MKONE app screenshot.
//
// Usage:
//   node update_points.mjs --points 11412 --updated "27 ก.ย. 69, 08:24"
//   node update_points.mjs --points 11412 --updated-iso 2026-09-27T08:24:00+07:00
//
// Exit codes: 0 = file changed, 3 = already up to date (nothing to commit),
// 1 = bad input or unexpected file format.
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { parseArgs } from "node:util"

const DATA = fileURLToPath(new URL("../../../scraper/data.json", import.meta.url))

const THAI_MONTHS = {
  "ม.ค.": 1, "ก.พ.": 2, "มี.ค.": 3, "เม.ย.": 4, "พ.ค.": 5, "มิ.ย.": 6,
  "ก.ค.": 7, "ส.ค.": 8, "ก.ย.": 9, "ต.ค.": 10, "พ.ย.": 11, "ธ.ค.": 12,
}
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/
const pad = (n, len = 2) => String(n).padStart(len, "0")

const fail = (msg) => {
  console.error(msg)
  process.exit(1)
}

// "27 ก.ย. 69, 08:24" (or 2569 / "วันที่" prefix) -> "2026-09-27T08:24:00+07:00"
function parseThai(text) {
  const m = text.match(/(\d{1,2})\s+(\S+?)\s+(\d{2,4})\D+(\d{1,2}):(\d{2})/u)
  if (!m || !(m[2] in THAI_MONTHS)) fail(`cannot parse Thai date: ${JSON.stringify(text)}`)
  const [, day, monthName, year, hour, minute] = m
  let y = Number(year)
  if (y < 100) y += 2500 // two-digit Buddhist year, e.g. 69 -> 2569
  y -= 543
  return `${pad(y, 4)}-${pad(THAI_MONTHS[monthName])}-${pad(day)}T${pad(hour)}:${minute}:00+07:00`
}

// The file is 2-space JSON, Thai text unescaped, no trailing newline.
const serialize = (data) => JSON.stringify(data, null, 2)

const { values } = parseArgs({
  options: {
    points: { type: "string" },
    updated: { type: "string" },
    "updated-iso": { type: "string" },
  },
})
if (!/^\d+$/.test(values.points ?? "")) fail("--points must be a non-negative integer (no commas)")
if (!values.updated === !values["updated-iso"]) fail("pass exactly one of --updated or --updated-iso")

const points = Number(values.points)
const updatedAt = values["updated-iso"] ?? parseThai(values.updated)
if (!ISO.test(updatedAt) || Number.isNaN(Date.parse(updatedAt))) fail(`bad ISO timestamp: ${updatedAt}`)

const raw = readFileSync(DATA, "utf8")
const data = JSON.parse(raw)

// Refuse to run if rewriting would reformat anything beyond the two fields.
if (serialize(data) !== raw) fail("scraper/data.json is not in the expected format (2-space indent, no trailing newline); fix by hand first")

const old = { points: data.acc_points, updatedAt: data.updated_at }
if (old.points === points && old.updatedAt === updatedAt) {
  console.log(`already up to date: acc_points=${points} updated_at=${updatedAt}`)
  process.exit(3)
}

data.acc_points = points
data.updated_at = updatedAt
const out = serialize(data)

// Sanity-check the result before writing it.
const check = JSON.parse(out)
if (!Number.isInteger(check.acc_points) || !ISO.test(check.updated_at)) fail("refusing to write an invalid data.json")
const changed = Object.keys(check).filter((k) => JSON.stringify(check[k]) !== JSON.stringify(JSON.parse(raw)[k]))
if (changed.some((k) => k !== "acc_points" && k !== "updated_at")) fail(`unexpected fields changed: ${changed}`)

writeFileSync(DATA, out, "utf8")
console.log(`acc_points ${old.points} -> ${points}; updated_at ${old.updatedAt} -> ${updatedAt}`)
