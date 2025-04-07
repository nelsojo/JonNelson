from bs4 import BeautifulSoup
import os
import json

def scrape_html_from_folder(folder_path):
    site_data = []

    # Loop through each HTML file in the folder
    for filename in os.listdir(folder_path):
        if filename.endswith(".html"):
            filepath = os.path.join(folder_path, filename)
            with open(filepath, 'r', encoding='utf-8') as file:
                soup = BeautifulSoup(file, 'lxml')

                # Extract basic metadata
                page = {
                    "filename": filename,
                    "title": soup.title.string if soup.title else "",
                }

                # Extract headings (h1, h2, etc.)
                headings = [h.get_text(strip=True) for h in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])]
                page["headings"] = headings

                # Extract paragraphs, focusing on those likely to contain bio-related information
                paragraphs = [p.get_text(strip=True) for p in soup.find_all('p') if "education" in p.get_text().lower() or "experience" in p.get_text().lower()]
                page["paragraphs"] = paragraphs

                # Extract lists (e.g., skills, certifications)
                lists = [
                    [li.get_text(strip=True) for li in ul.find_all('li')]
                    for ul in soup.find_all(['ul', 'ol'])
                ]
                page["lists"] = lists

                # Extract relevant links (optional - if they point to bio-related content)
                links = [a['href'] for a in soup.find_all('a', href=True) if "about" in a.get_text().lower()]
                page["links"] = links

                # Add structured table data, if present
                tables = [
                    {
                        "headers": [th.get_text(strip=True) for th in table.find_all('th')],
                        "rows": [
                            [td.get_text(strip=True) for td in row.find_all('td')]
                            for row in table.find_all('tr')
                        ]
                    }
                    for table in soup.find_all('table')
                ]
                page["tables"] = tables

                site_data.append(page)

    return site_data

if __name__ == "__main__":
    # 🔧 Set your local site folder path
    folder_path = "./"  # Change to the correct path if necessary
    
    # 🧠 Scrape the site
    site_data = scrape_html_from_folder(folder_path)

    # 💾 Dump the output into a JSON file
    output_file = "site_content.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(site_data, f, ensure_ascii=False, indent=2)

    print(f"✅ Site content dumped to {output_file}")
