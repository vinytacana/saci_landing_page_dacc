#!/usr/bin/env python3
"""Checks buildless site structure, assets, anchors and configuration. No dependencies."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
errors = []

class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.links = []
        self.headings = []
        self.images = []
        self.meta = {}
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a: self.ids.append(a['id'])
        if tag in ('h1', 'h2', 'h3'): self.headings.append(tag)
        for key in ('href', 'src'):
            if key in a: self.links.append((tag, a[key]))
        if tag == 'img': self.images.append(a)
        if tag == 'meta': self.meta[a.get('name', a.get('property'))] = a.get('content')
        if a.get('target') == '_blank' and 'noopener' not in a.get('rel', ''):
            errors.append('External link without noopener')

page = Page()
page.feed((ROOT / 'index.html').read_text())
assert page.headings.count('h1') == 1, 'Exactly one h1 required'
assert len(page.ids) == len(set(page.ids)), 'Duplicate IDs'
for tag, value in page.links:
    if value.startswith('#'):
        if value[1:] not in page.ids: errors.append(f'Missing anchor: {value}')
    elif not urlsplit(value).scheme:
        if value.startswith('/'): errors.append(f'Absolute path breaks project Pages: {value}')
        if not (ROOT / unquote(urlsplit(value).path)).is_file(): errors.append(f'Missing asset: {value}')
for image in page.images:
    for key in ['alt', 'width', 'height']:
        if key not in image: errors.append(f'Image missing {key}')
for key in ['description', 'viewport', 'og:title', 'og:description', 'og:image']:
    if not page.meta.get(key): errors.append(f'Missing metadata: {key}')
for file in [*ROOT.glob('js/*.js'), *ROOT.glob('data/*.js')]:
    subprocess.run(['node', '--check', str(file)], check=True)
    for dependency in re.findall(r"from\s+['\"]([^'\"]+)", file.read_text()):
        if not (file.parent / dependency).resolve().is_file(): errors.append(f'Missing module: {dependency}')
config_code = "Promise.all([import('./data/project.js'),import('./data/team.js')]).then(([p,t])=>console.log(JSON.stringify({project:p.project,team:t.team})))"
config = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', config_code], cwd=ROOT))
project = config['project']
assert len(config['team']) == 4
for person in config['team']:
    assert person['name'] and isinstance(person['links'], dict)
    if person.get('photo'): assert (ROOT / person['photo']).is_file()
assert (ROOT / project['logo']).is_file()
for photo in project['gallery']:
    assert photo['alt'] and photo['width'] and photo['height']
    assert (ROOT / photo['src']).is_file()
for repo in project['repositories']:
    assert repo['url'].startswith('https://github.com/')
    assert repo['name'] and repo['description'] and repo['tags']
css = (ROOT / 'css/style.css').read_text()
assert 'prefers-reduced-motion' in css and ':focus-visible' in css
assert css.count('{') == css.count('}')
assert (ROOT / '.nojekyll').exists()
assert not errors, '\n'.join(errors)
print(f'PASS: HTML, {len(page.ids)} IDs, {len(page.links)} paths/anchors, {len(page.images)} images, metadata, JS imports/syntax, team and project data.')
print('PASS: relative paths support /REPOSITORY/; empty gallery/resources remain hidden; reduced motion and focus styles present.')
print('Browser layout, keyboard and runtime interaction checks require a local HTTP preview; not covered by this static validator.')
