#!/usr/bin/env python3
"""
Mock Metaboard - Generate test data
Equivalent of PHP's bin/fake/metaboard.php

Usage:
    python generate_sample.py                         # Normal form with 2 items
    python generate_sample.py --reprint IPO_235827    # Form with a reprint item
    python generate_sample.py --quality 0700          # Custom quality code (Velvet)
    python generate_sample.py --name custom_form      # Custom form name
"""

import os
import zipfile
import shutil
import argparse
from datetime import datetime

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FTP_INBOUND = os.path.join(BASE_DIR, "..", "metaboard-ftp", "inbound")
TEMP_DIR = os.path.join(BASE_DIR, "temp_layout")

# Quality code → name mapping (from Part 16)
QUALITY_NAMES = {
    "0201": "Pearl",
    "0334": "Country",
    "0411": "Globossoft",
    "0413": "Melody",
    "0499": "Viva",
    "0500": "Viva",
    "0600": "Patio",
    "0607": "ImpactPro",
    "0610": "Level",
    "0700": "Velvet",
    "0701": "Velvet",
    "0705": "Volta",
    "1001": "PrestigeVilt",
    "1002": "EleganceRubbermix",
}


def generate_form(form_name: str, items: list[dict], reprint_suffix: str = "", quality: str = "0600"):
    """
    Generate a Metaboard ZIP with the given items.
    Each item: {"id": "IPO_123", "width": 120, "height": 200, "x": 10, "y": 20}
    """
    os.makedirs(FTP_INBOUND, exist_ok=True)
    if os.path.exists(TEMP_DIR):
        shutil.rmtree(TEMP_DIR)
    os.makedirs(TEMP_DIR, exist_ok=True)

    # Build PlacedObject XML elements
    placed_objects_xml = ""
    image_names = []
    for item in items:
        item_id = item["id"] + reprint_suffix
        image_names.append(f"{item_id}.png")
        placed_objects_xml += f"""
  <PlacedObject ComponentName="{item_id}" Width="{item['width']}" Height="{item['height']}">
    <Placement CTM="1 0 0 1 {item['x']:.1f} {item['y']:.1f}"/>
  </PlacedObject>"""

    # Calculate form dimensions from items
    form_width = max(item.get("x", 0) + item.get("width", 0) for item in items)
    form_height = max(item.get("y", 0) + item.get("height", 0) for item in items)

    xml_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<Layout CutSheetSize="{form_width} {form_height}" Quality="{quality}" Border="None">{placed_objects_xml}
</Layout>
"""

    # Write XML
    xml_path = os.path.join(TEMP_DIR, "layout.xml")
    with open(xml_path, "w", encoding="utf-8") as f:
        f.write(xml_content)

    # Write dummy PNG images
    DUMMY_PNG = (
        b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
        b"\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00"
        b"\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82"
    )
    for img_name in image_names:
        with open(os.path.join(TEMP_DIR, img_name), "wb") as f:
            f.write(DUMMY_PNG)

    # Create ZIP
    timestamp = datetime.now().strftime("%Y_%m_%d_%H%M%S")
    zip_name = f"{form_name}_{timestamp}.zip"
    zip_path = os.path.join(FTP_INBOUND, zip_name)

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for file in os.listdir(TEMP_DIR):
            zipf.write(os.path.join(TEMP_DIR, file), file)

    shutil.rmtree(TEMP_DIR)
    print(f"✅ Generated: {zip_path}")
    print(f"   Items: {[item['id'] + reprint_suffix for item in items]}")
    return zip_path


def main():
    parser = argparse.ArgumentParser(description="Generate fake Metaboard ZIP data")
    parser.add_argument("--reprint", metavar="ORDER_ITEM_ID",
                        help="Generate a reprint ZIP for the given OrderItem ID (adds _R1 suffix)")
    parser.add_argument("--quality", default="0600",
                        help="Quality code for the items (default: 0600 = Patio)")
    parser.add_argument("--name", default="form_layout",
                        help="Base name for the form ZIP file")
    args = parser.parse_args()

    if args.reprint:
        # Path B: Reprint flow (Part 15)
        # Simulates a reprint layout sent by Metaboard with _R1 suffix
        print(f"🔄 Generating REPRINT layout for OrderItem: {args.reprint}")
        items = [{"id": args.reprint, "width": 120, "height": 200, "x": 10.0, "y": 20.0}]
        generate_form(f"{args.name}_reprint", items, reprint_suffix="_R1", quality=args.quality)
    else:
        # Normal form with 2 items (IPO + PCC)
        print(f"📋 Generating NORMAL form layout (quality: {args.quality} = {QUALITY_NAMES.get(args.quality, 'Unknown')})")
        items = [
            {"id": "IPO_235827", "width": 120, "height": 200, "x": 10.0, "y": 20.0},
            {"id": "PCC_100-3",  "width": 70,  "height": 100, "x": 135.0, "y": 20.0},
        ]
        generate_form(args.name, items, quality=args.quality)


if __name__ == "__main__":
    main()
