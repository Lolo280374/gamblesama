import json
from collections import Counter
import csv

# Path to your JSON dataset
DATA_PATH = "all_fig.json"
OUTPUT_PATH = "anime_counts.csv"

with open(DATA_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

anime_counter = Counter()

for fig in data:
    animes = fig.get("anime", [])
    if isinstance(animes, str):
        animes = [animes]
    for anime in animes:
        anime_counter[anime.strip()] += 1

# Sort by most common
sorted_animes = anime_counter.most_common()

# Write to CSV for LibreOffice
with open(OUTPUT_PATH, "w", newline="", encoding="utf-8") as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(["Anime", "Number of Figurines"])
    writer.writerows(sorted_animes)

print(f"✅ Done! Found {len(sorted_animes)} unique anime titles.")
print(f"Top 10 animes by number of figurines:")
for anime, count in sorted_animes[:10]:
    print(f"{anime}: {count}")
print(f"\nSaved to '{OUTPUT_PATH}' for LibreOffice.")
