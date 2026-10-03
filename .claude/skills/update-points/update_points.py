#!/usr/bin/env python3
"""Update acc_points and updated_at in scraper/data.json from values read off
an MKONE app screenshot.

Usage:
  update_points.py --points 11412 --updated "27 ก.ย. 69, 08:24"
  update_points.py --points 11412 --updated-iso 2026-09-27T08:24:00+07:00

Prints a one-line summary and exits 0 when the file changed, 3 when the values
were already up to date (nothing to commit).
"""
import argparse
import json
import re
import sys
from pathlib import Path

DATA = Path(__file__).resolve().parents[3] / "scraper" / "data.json"

THAI_MONTHS = {
    "ม.ค.": 1, "ก.พ.": 2, "มี.ค.": 3, "เม.ย.": 4, "พ.ค.": 5, "มิ.ย.": 6,
    "ก.ค.": 7, "ส.ค.": 8, "ก.ย.": 9, "ต.ค.": 10, "พ.ย.": 11, "ธ.ค.": 12,
}


def parse_thai(text: str) -> str:
    """'27 ก.ย. 69, 08:24' (or 2569 / 'วันที่' prefix) -> ISO 8601 with +07:00."""
    m = re.search(r"(\d{1,2})\s+(\S+?)\s+(\d{2,4})\D+(\d{1,2}):(\d{2})", text)
    if not m or m.group(2) not in THAI_MONTHS:
        sys.exit(f"cannot parse Thai date: {text!r}")
    day, month_name, year, hour, minute = m.groups()
    year = int(year)
    if year < 100:  # two-digit Buddhist year, e.g. 69 -> 2569
        year += 2500
    year -= 543
    return f"{year:04d}-{THAI_MONTHS[month_name]:02d}-{int(day):02d}T{int(hour):02d}:{minute}:00+07:00"


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--points", type=int, required=True, help="tier points (numerator of คะแนนปรับระดับ)")
    g = p.add_mutually_exclusive_group(required=True)
    g.add_argument("--updated", help="Thai text from 'อัปเดตล่าสุด', e.g. '27 ก.ย. 69, 08:24'")
    g.add_argument("--updated-iso", help="ISO 8601 timestamp with offset")
    args = p.parse_args()

    updated_at = args.updated_iso or parse_thai(args.updated)
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}", updated_at):
        sys.exit(f"bad ISO timestamp: {updated_at!r}")

    data = json.loads(DATA.read_text(encoding="utf-8"))
    old = (data["acc_points"], data["updated_at"])
    new = (args.points, updated_at)
    if old == new:
        print(f"already up to date: acc_points={new[0]} updated_at={new[1]}")
        sys.exit(3)

    data["acc_points"], data["updated_at"] = new
    # Match the existing style: 2-space indent, UTF-8 Thai, no trailing newline.
    DATA.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"acc_points {old[0]} -> {new[0]}; updated_at {old[1]} -> {new[1]}")


if __name__ == "__main__":
    main()
