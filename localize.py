#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# title: localize
# author: Hsieh-Ting Lin, the Lizard 🦎
# description: localize is a script about...
# date: "2024-12-28"
# --END-- #

import argparse
import hashlib
import os
import random
import time
from urllib.parse import urljoin, urlparse
from io import BytesIO

import requests
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPM


class HTMLImageDownloader:
    def __init__(self, input_path, assets_dir=None):
        # If assets_dir is not specified, create it relative to input file
        if assets_dir is None:
            input_dir = os.path.dirname(os.path.abspath(input_path))
            self.assets_dir = os.path.join(input_dir, "assets")
        else:
            self.assets_dir = assets_dir

        # Create assets directory if it doesn't exist
        os.makedirs(self.assets_dir, exist_ok=True)

        # Create session with retries and backoff
        self.session = requests.Session()
        retries = Retry(
            total=5,  # number of retries
            backoff_factor=1,  # wait 1, 2, 4, 8, 16 seconds between retries
            status_forcelist=[429, 500, 502, 503, 504],  # retry on these status codes
        )
        self.session.mount("https://", HTTPAdapter(max_retries=retries))
        self.session.mount("http://", HTTPAdapter(max_retries=retries))

        # Common headers to mimic a browser
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "Referer": "https://imgur.com/",
        }

        # Rate limiting
        self.last_request_time = 0
        self.min_request_interval = 1.0  # minimum seconds between requests

    def rate_limit(self):
        """Ensure minimum time between requests"""
        current_time = time.time()
        elapsed = current_time - self.last_request_time
        if elapsed < self.min_request_interval:
            time.sleep(self.min_request_interval - elapsed + random.uniform(0.1, 0.5))
        self.last_request_time = time.time()

    def download_image(self, img_url, base_url=None):
        """Download image and return local path."""
        if base_url:
            img_url = urljoin(base_url, img_url)

        try:
            # Skip data URLs and twemoji
            if img_url.startswith("data:") or 'twemoji' in img_url:
                return img_url

            # Generate filename from URL
            url_hash = hashlib.md5(img_url.encode()).hexdigest()
            file_extension = os.path.splitext(urlparse(img_url).path)[1].lower()
            
            # Set appropriate extension and headers based on file type
            headers = self.headers.copy()
            is_svg = file_extension == '.svg' or 'svg' in img_url.lower()
            
            if is_svg:
                headers.update({
                    'Accept': 'image/svg+xml,application/xml,*/*',
                })
                file_extension = '.svg'
            elif not file_extension:
                file_extension = ".jpg"  # Default extension

            local_filename = f"{url_hash}{file_extension}"
            local_path = os.path.join(self.assets_dir, local_filename)

            # Make path relative to the assets directory
            relative_path = os.path.join("assets", local_filename)

            # Don't download if already exists
            if os.path.exists(local_path):
                return relative_path

            # Apply rate limiting
            self.rate_limit()

            # Download the image
            print(f"Downloading {img_url}...")
            response = self.session.get(img_url, headers=headers)
            response.raise_for_status()

            # Save the file
            with open(local_path, 'wb') as f:
                f.write(response.content)

            print(f"Successfully downloaded to {relative_path}")
            return relative_path

        except Exception as e:
            print(f"Error downloading {img_url}: {str(e)}")
            return img_url

    def process_html(self, html_content, base_url=None):
        """Process HTML content, download images, and update src attributes."""
        soup = BeautifulSoup(html_content, "html.parser")

        # Find all elements with src attributes (img, embed, object)
        elements_with_src = soup.find_all(lambda tag: tag.get('src', None) is not None)
        
        # Find all elements with background-image in style
        elements_with_bg = soup.find_all(lambda tag: tag.get('style', '').find('background-image') != -1)
        
        # Find all SVG images (both inline and referenced)
        svg_elements = soup.find_all('svg')
        svg_uses = soup.find_all('use')
        
        total_images = len(elements_with_src) + len(elements_with_bg) + len(svg_uses)
        print(f"\nFound {total_images} images to process")
        
        # Process elements with src attributes
        for i, elem in enumerate(elements_with_src, 1):
            src = elem.get("src")
            if src:
                print(f"\nProcessing image {i}/{total_images}")
                local_path = self.download_image(src, base_url)
                elem["src"] = local_path

        # Process background images
        for i, elem in enumerate(elements_with_bg, len(elements_with_src) + 1):
            style = elem.get("style", "")
            if "background-image" in style:
                url_start = style.find("url(") + 4
                url_end = style.find(")", url_start)
                if url_start > 4 and url_end != -1:
                    url = style[url_start:url_end].strip("'\"")
                    print(f"\nProcessing background image {i}/{total_images}")
                    local_path = self.download_image(url, base_url)
                    new_style = style[:url_start] + f"'{local_path}'" + style[url_end:]
                    elem["style"] = new_style

        # Process SVG use elements (external references)
        for i, use_elem in enumerate(svg_uses, len(elements_with_src) + len(elements_with_bg) + 1):
            href = use_elem.get('href') or use_elem.get('xlink:href')
            if href and (href.startswith('http://') or href.startswith('https://')):
                print(f"\nProcessing SVG reference {i}/{total_images}")
                local_path = self.download_image(href, base_url)
                use_elem['href'] = local_path
                if 'xlink:href' in use_elem.attrs:
                    use_elem['xlink:href'] = local_path

        return str(soup)

    def process_file(self, html_file_path, output_file_path=None):
        """Process HTML file and save the result."""
        print(f"\nProcessing HTML file: {html_file_path}")

        # Read HTML file
        with open(html_file_path, "r", encoding="utf-8") as f:
            html_content = f.read()

        # Get base URL from HTML file path
        base_url = None
        if html_file_path.startswith(("http://", "https://")):
            base_url = html_file_path

        # Process HTML
        processed_html = self.process_html(html_content, base_url)

        # Save processed HTML in the same directory as input file
        if output_file_path is None:
            input_dir = os.path.dirname(os.path.abspath(html_file_path))
            input_name = os.path.splitext(os.path.basename(html_file_path))[0]
            output_file_path = os.path.join(input_dir, f"{input_name}.local.html")

        with open(output_file_path, "w", encoding="utf-8") as f:
            f.write(processed_html)

        return output_file_path


def main():
    parser = argparse.ArgumentParser(
        description="Download images from HTML and replace src with local paths"
    )
    parser.add_argument("input", help="Input HTML file path or URL")
    parser.add_argument(
        "-o", "--output", help="Output HTML file path (default: processed_<input>)"
    )
    parser.add_argument(
        "-a",
        "--assets",
        help="Assets directory (default: ./assets relative to input file)",
    )
    parser.add_argument("-b", "--base-url", help="Base URL for relative paths")
    parser.add_argument(
        "-w",
        "--wait",
        type=float,
        default=1.0,
        help="Minimum wait time between requests in seconds (default: 1.0)",
    )

    args = parser.parse_args()

    try:
        # Initialize downloader with input path and optional assets directory
        downloader = HTMLImageDownloader(args.input, args.assets)
        downloader.min_request_interval = args.wait

        # Process the HTML file
        output_path = args.output or f"processed_{os.path.basename(args.input)}"
        processed_file = downloader.process_file(args.input, output_path)
        print(f"\nProcessed HTML saved to: {processed_file}")
        print(f"Images downloaded to: {downloader.assets_dir}/")
    except Exception as e:
        print(f"\nError processing HTML: {str(e)}")
        exit(1)


if __name__ == "__main__":
    main()
