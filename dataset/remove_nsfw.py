import json

# List of manufacturers to block (case-insensitive)
blocked_manufacturers = ["wanderer", "insight", "native", "freeing", "taito"]

# Load your dataset
with open("all_fig.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Filter out blocked manufacturers
filtered_data = [
    fig for fig in data 
    if fig.get("manufacturer") and fig["manufacturer"].strip().lower() not in blocked_manufacturers
]

# Save the filtered dataset
with open("all_fig_filtered.json", "w", encoding="utf-8") as f:
    json.dump(filtered_data, f, indent=2, ensure_ascii=False)

print(f"Filtered dataset saved. {len(filtered_data)} items remain out of {len(data)}.")
