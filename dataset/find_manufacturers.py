import json
import re

# Load your dataset
with open('all_fig.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

manufacturers = set()

# Collect all manufacturer names
for fig in data:
    manu = fig.get('manufacturer')
    if manu and manu.strip() != "":
        manufacturers.add(manu.strip())

manufacturers = sorted(manufacturers)

# Function to create a "suggested URL" for a manufacturer
def make_url(name):
    # Remove non-alphanumeric characters, lowercase, replace spaces with dashes
    safe_name = re.sub(r'[^a-zA-Z0-9 ]', '', name).lower().replace(' ', '')
    # Simple heuristic for URL
    return f'https://www.{safe_name}.com'

# Print the list
print("Manufacturer -> Suggested URL")
for m in manufacturers:
    url = make_url(m)
    print(f"{m} -> {url}")

# Optional: write to a file
with open('manufacturers_urls.txt', 'w', encoding='utf-8') as f:
    for m in manufacturers:
        url = make_url(m)
        f.write(f"{m} -> {url}\n")

print("\nDone! List saved to manufacturers_urls.txt")
