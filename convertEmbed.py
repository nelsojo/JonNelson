import json

# 📂 Load the JSON data
with open("site_embeddings.json", "r", encoding="utf-8") as f:
    embeddings = json.load(f)

# 📜 Write to a JS file
with open("site_embeddings.js", "w", encoding="utf-8") as f:
    f.write("export const siteEmbeddings = ")
    json.dump(embeddings, f, indent=2, ensure_ascii=False)
    f.write(";")
