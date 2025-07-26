import requests
from bs4 import BeautifulSoup
import json
import datetime

def scrape_html_from_url(url):
    site_data = []

    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise error for bad status codes
    except requests.RequestException as e:
        print(f"❌ Error fetching {url}: {e}")
        return site_data

    soup = BeautifulSoup(response.text, 'lxml')

    # Extract basic metadata
    page = {
        "url": url,
        "title": soup.title.string if soup.title else "",
    }

    # Extract headings (h1, h2, etc.)
    headings = [h.get_text(strip=True) for h in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])]
    page["headings"] = headings

    # Extract bio-relevant paragraphs
    paragraphs = [
        p.get_text(strip=True)
        for p in soup.find_all('p')
        if "education" in p.get_text().lower() or "experience" in p.get_text().lower()
    ]
    page["paragraphs"] = paragraphs

    # Extract lists (e.g., skills, certifications)
    lists = [
        [li.get_text(strip=True) for li in ul.find_all('li')]
        for ul in soup.find_all(['ul', 'ol'])
    ]
    page["lists"] = lists

    # Extract relevant links (e.g., "about" pages)
    links = [a['href'] for a in soup.find_all('a', href=True) if "about" in a.get_text().lower()]
    page["links"] = links

    # Extract tables
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
    # 🔗 Set your target URL here
    target_url = "https://www.advancedwellnessgcm.com/"  # Replace with your desired site
    
    # 🧠 Scrape the live site
    site_data = scrape_html_from_url(target_url)

    # 💾 Save the output with a timestamp
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = f"site_content_{timestamp}.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(site_data, f, ensure_ascii=False, indent=2)

    print(f"✅ Site content scraped from {target_url} and saved to {output_file}")
