import re
from html.parser import HTMLParser

class TagBalanceChecker(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.void_tags = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}
        self.errors = []
    def handle_starttag(self, tag, attrs):
        if tag.lower() not in self.void_tags:
            self.stack.append((tag.lower(), self.getpos()))
    def handle_endtag(self, tag):
        tag = tag.lower()
        if tag in self.void_tags:
            return
        if not self.stack:
            self.errors.append(f"Unexpected closing tag </{tag}> at line {self.getpos()[0]}")
            return
        last_tag, pos = self.stack.pop()
        if last_tag != tag:
            self.errors.append(f"Mismatched tag: expected </{last_tag}> (opened at line {pos[0]}), got </{tag}> at line {self.getpos()[0]}")

with open('oci-card-eligibility-legal-status.html', 'r', encoding='utf-8') as f:
    content = f.read()

checker = TagBalanceChecker()
checker.feed(content)

if checker.stack:
    print(f"Unclosed tags remaining in stack: {len(checker.stack)}")
    for t, p in checker.stack[-5:]:
        print(f" - <{t}> opened at line {p[0]}")
else:
    print("All tags cleanly closed!")

if checker.errors:
    print(f"Errors found: {len(checker.errors)}")
    for e in checker.errors[:5]:
        print(f" - {e}")
else:
    print("Zero HTML tag mismatches found!")
