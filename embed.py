import json
import openai
from tqdm import tqdm
import os

# Function to decode Base64
import base64

def decode_base64(encoded_string):
    return base64.b64decode(encoded_string).decode('utf-8')

# Use the encoded API key
encoded_api_key = "c2stcHJvai1WSVhfUnJ5bEw4ZW5ZbHFTNnFndzBmNjYyNVl1YVZIS3FIbHhwR05uM2tfc24taTlfMGhtWVRicUhkZnpZT3N6dUo4N2NsV09BMVQzQmxia0ZKd2s5ajBqQ0VUUDMtR19kdjlRRnNDZ052THZHR1RrN2EyYUlPY19DM2hTSjVDai1kWXRzeDlzRkVLdVBoWXQzSThWd3JTRzdVSUE="
decoded_api_key = decode_base64(encoded_api_key)


# 🔑 Make sure you set your API key
openai.api_key = decoded_api_key  # or just hardcode it: openai.api_key = "your-key-here"

# 📂 Load your site content
with open("site_content.json", "r", encoding="utf-8") as f:
    site_data = json.load(f)

# 🧠 Prepare text chunks (you can choose what to embed — paragraphs, headings, etc.)
texts_to_embed = []
metadata = []

for page in site_data:
    for para in page["paragraphs"]:
        texts_to_embed.append(para)
        metadata.append({"filename": page["filename"], "type": "paragraph"})
    
    for heading in page["headings"]:
        texts_to_embed.append(heading)
        metadata.append({"filename": page["filename"], "type": "heading"})

# ⚙️ Generate embeddings
embedded_data = []

for i, text in enumerate(tqdm(texts_to_embed, desc="Generating embeddings")):
    try:
        response = openai.embeddings.create(
            input=text,
            model="text-embedding-ada-002"
        )
        embedding = response.data[0].embedding
        embedded_data.append({
            "text": text,
            "embedding": embedding,
            "metadata": metadata[i]
        })
    except Exception as e:
        print(f"❌ Error embedding text #{i}: {e}")

# 💾 Save to a JSON file
with open("site_embeddings.json", "w", encoding="utf-8") as f:
    json.dump(embedded_data, f, ensure_ascii=False, indent=2)

print("✅ Embeddings saved to site_embeddings.json")
