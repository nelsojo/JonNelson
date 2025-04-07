from bs4 import BeautifulSoup
import os
import json

def scrape_html_from_folder(folder_path):
    site_data = []

    for filename in os.listdir(folder_path):
        if filename.endswith(".html"):
            filepath = os.path.join(folder_path, filename)
            with open(filepath, 'r', encoding='utf-8') as file:
                soup = BeautifulSoup(file, 'lxml')
                
                page = {
                    "filename": filename,
                    "title": soup.title.string if soup.title else "",
                    "headings": [h.get_text(strip=True) for h in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])],
                    "paragraphs": [p.get_text(strip=True) for p in soup.find_all('p')],
                    "links": [a['href'] for a in soup.find_all('a', href=True)],
                    "images": [
                        {"src": img['src'], "alt": img.get('alt', '')}
                        for img in soup.find_all('img', src=True)
                    ],
                    "lists": [
                        [li.get_text(strip=True) for li in ul.find_all('li')]
                        for ul in soup.find_all(['ul', 'ol'])
                    ],
                    "meta": {
                        meta.get('name'): meta.get('content')
                        for meta in soup.find_all('meta')
                        if meta.get('name') and meta.get('content')
                    },
                    "tables": [
                        {
                            "headers": [th.get_text(strip=True) for th in table.find_all('th')],
                            "rows": [
                                [td.get_text(strip=True) for td in row.find_all('td')]
                                for row in table.find_all('tr')
                            ]
                        }
                        for table in soup.find_all('table')
                    ]
            }

                site_data.append(page)

    return site_data

if __name__ == "__main__":
    # 🔧 Set your local site folder path
    folder_path = "./"  # Change to "." if script is inside the folder
    
    # 🧠 Scrape the site
    site_data = scrape_html_from_folder(folder_path)

    # 💾 Dump the output into a JSON file
    output_file = "site_content.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(site_data, f, ensure_ascii=False, indent=2)

    print(f"✅ Site content dumped to {output_file}")
