with open('sitemap.xml', encoding='utf-8') as f:
    text = f.read()

target = """  <url>
    <loc>https://rrclawassociates.com/litigation-dispute-resolution</loc>
    <priority>0.8</priority>
  </url>"""

new_block = """  <url>
    <loc>https://rrclawassociates.com/litigation-dispute-resolution</loc>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>https://rrclawassociates.com/cheque-bounce-lawyer</loc>
    <priority>0.8</priority>
  </url>"""

if target in text:
    text = text.replace(target, new_block)
    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write(text)
    print("sitemap.xml updated with cheque-bounce-lawyer!")
else:
    print("Target not found in sitemap.xml!")

