import requests
import random
from bs4 import BeautifulSoup
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
import os

# --- Selenium setup ---
options = Options()
options.add_argument("--headless")
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
options.add_argument("--window-size=1920,1080")
options.add_argument(
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/120.0.0.0 Safari/537.36"
)
driver = webdriver.Chrome(options=options)

# --- Variables ---
all_figures = []
page = 39
MAX_PAGES = 1000
SAVE_FILE = "all_fig.json"

# --- Load existing data ---
if os.path.exists(SAVE_FILE):
    with open(SAVE_FILE, "r", encoding="utf-8") as f:
        all_figures = json.load(f)
    print(f"[info] loaded {len(all_figures)} figs from existing JSON")

seen_urls = {fig["url"] for fig in all_figures}

# --- Scraping loop ---
while page <= MAX_PAGES:
    url = f"https://myanimeshelf.com/figures?page={page}"
    print(f"[info] getting page listing n{page}")

    # Retry logic for Selenium page
    retry = True
    while retry:
        driver.get(url)
        time.sleep(random.uniform(4, 7))  # Random delay

        soup = BeautifulSoup(driver.page_source, "html.parser")
        cards = soup.select("div.figure")

        if not cards:
            if "CAPTCHA" in driver.page_source or "access denied" in driver.page_source.lower():
                print(f"[warn] page {page} blocked, retrying in 30s...")
                time.sleep(30)
            else:
                print("[info] no more figs found on page.")
                retry = False
                break
        else:
            retry = False

    if not cards:
        break

    # --- Process each figure ---
    for card in cards:
        try:
            link_tag = card.select_one("a")
            if not link_tag:
                continue

            fig_url = link_tag["href"]
            if fig_url in seen_urls:
                continue

            # Random delay between figures
            time.sleep(random.uniform(1, 2))

            name_tag = card.select_one("h3")

            figure = {
                "name": name_tag.text.strip() if name_tag else None,
                "image": None,  # We'll set this after visiting the figure page
                "url": fig_url,
                "anime": [],
                "character": [],
                "release_date": None,
                "figure_type": None,
                "material": None,
                "height": None,
                "manufacturer": None,
                "sculptor": None,
                "manufacturer_price": None,
                "owners": None
            }

            figure_url_full = "https://myanimeshelf.com" + fig_url

            # Retry logic for requests.get
            success = False
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                              "AppleWebKit/537.36 (KHTML, like Gecko) "
                              "Chrome/120.0.0.0 Safari/537.36"
            }

            while not success:
                r = requests.get(figure_url_full, timeout=10, headers=headers)
                if r.status_code == 200:
                    success = True
                else:
                    print(f"[warn] {figure_url_full} returned {r.status_code}, retrying in 30s...")
                    time.sleep(30)

            fsoup = BeautifulSoup(r.text, "html.parser")

            # --- Grab main product image ---
            main_img_tag = fsoup.select_one("div.figPic img")
            if main_img_tag and main_img_tag.get("src"):
                figure["image"] = main_img_tag["src"]

            # --- Parsing ---
            og_desc = fsoup.select_one('meta[property="og:description"]')
            if og_desc:
                desc = og_desc.get("content", "")
                if "anime:" in desc:
                    anime_part = desc.split("anime:")[1].split(", manufacturer")[0].strip()
                    figure["anime"] = [a.strip() for a in anime_part.split("/")]

                if "Figure:" in desc:
                    figure["name"] = desc.split("Figure:")[1].split(", material")[0].strip()

                if "material:" in desc:
                    material_part = desc.split("material:")[1].split(", anime")[0].strip()
                    figure["material"] = material_part

            info_table = fsoup.select_one("table.infoTable")
            if info_table:
                for row in info_table.select("tr"):
                    key_td = row.select_one("td.a")
                    val_td = row.select_one("td.b")
                    if not key_td or not val_td:
                        continue
                    key = key_td.text.strip().lower()
                    val = val_td.text.strip()
                    if "character" in key:
                        figure["character"] = [c.strip() for c in val.split("\n") if c.strip()]
                    elif "release" in key:
                        figure["release_date"] = val
                    elif "figure type" in key:
                        figure["figure_type"] = val
                    elif "height" in key:
                        figure["height"] = val
                    elif "manufacturer price" in key:
                        figure["manufacturer_price"] = val
                    elif "manufacturer" in key:
                        figure["manufacturer"] = val
                    elif "sculptor" in key:
                        figure["sculptor"] = val
                    elif "owners" in key:
                        figure["owners"] = val

            all_figures.append(figure)
            seen_urls.add(fig_url)

            # Save after each figure
            with open(SAVE_FILE, "w", encoding="utf-8") as f:
                json.dump(all_figures, f, ensure_ascii=False, indent=2)

            print(f"[yay] saved: {figure['name']} | from: {figure['anime']} | image: {figure['image']}")

        except Exception as e:
            print(f"[err] failed on page {page}: {e}")

    page += 1
    # Random delay between pages (5–10s)
    time.sleep(random.uniform(7, 10))

driver.quit()
print(f"[yay] done, saved {len(all_figures)} figures in the file: {SAVE_FILE}!!!")
