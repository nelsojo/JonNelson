import json
import openai
from tqdm import tqdm
import os
import base64

def decode_base64(encoded_string):
    return base64.b64decode(encoded_string).decode('utf-8')

# Load and decode your API key
encoded_api_key = "c2stcHJvai1WSVhfUnJ5bEw4ZW5ZbHFTNnFndzBmNjYyNVl1YVZIS3FIbHhwR05uM2tfc24taTlfMGhtWVRicUhkZnpZT3N6dUo4N2NsV09BMVQzQmxia0ZKd2s5ajBqQ0VUUDMtR19kdjlRRnNDZ052THZHR1RrN2EyYUlPY19DM2hTSjVDai1kWXRzeDlzRkVLdVBoWXQzSThWd3JTRzdVSUE="
decoded_api_key = decode_base64(encoded_api_key)

# Initialize client
client = openai.OpenAI(api_key=decoded_api_key)

# Load scraped site content
with open("site_content.json", "r", encoding="utf-8") as f:
    site_data = json.load(f)

texts_to_embed = []
metadata = []

for page in site_data:
    combined_texts = []

    # Add paragraphs
    combined_texts.extend(page.get("paragraphs", []))

    # Add list items (flatten the lists of lists)
    for lst in page.get("lists", []):
        combined_texts.extend(lst)

    # Optionally: add headings
    combined_texts.extend(page.get("headings", []))

    for text in combined_texts:
        if text.strip():  # only if text isn't empty
            texts_to_embed.append(text)
            metadata.append({
                "filename": page["filename"],
                "title": page["title"]
            })


site_embeddings = []

print(f"Embedding {len(texts_to_embed)} text chunks...")

for i, text in enumerate(tqdm(texts_to_embed, desc="Embedding site content")):
    try:
        response = client.embeddings.create(
            input=text,
            model="text-embedding-ada-002"
        )
        embedding = response.data[0].embedding

        site_embeddings.append({
            "metadata": metadata[i],
            "text": text,
            "embedding": embedding
        })
    except Exception as e:
        print(f"❗ Error embedding text #{i}: {e}")

# Save the embeddings
with open("site_embeddings.json", "w", encoding="utf-8") as f:
    json.dump(site_embeddings, f, ensure_ascii=False, indent=2)

print(f"✅ Embeddings saved to site_embeddings.json")
