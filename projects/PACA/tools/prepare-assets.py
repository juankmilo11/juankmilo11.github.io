"""Regenerate curated web assets from selection.json. Run from the repository root."""
from pathlib import Path
from PIL import Image, ImageOps
import json
import shutil

selection = json.loads(Path('projects/PACA/selection.json').read_text(encoding='utf-8'))
output = Path('pages/paula/assets')
output.mkdir(parents=True, exist_ok=True)
entries = []
for row in selection:
    source = Path(row['source'])
    if not source.is_file():
        raise FileNotFoundError(f'Archive source missing: {source}')
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert('RGB')
        image.thumbnail((1400, 1600), Image.Resampling.LANCZOS)
        image.save(output / f"{row['id']}.webp", 'WEBP', quality=85, method=6)
        entry = {key: row[key] for key in ['id', 'category', 'title', 'alt', 'date', 'publication']}
        entry['translations'] = row['translations']
        entry.update(src=f"assets/{row['id']}.webp", width=image.width, height=image.height)
    if row.get('videoSource'):
        shutil.copyfile(row['videoSource'], Path('pages/paula') / row['video'])
        entry['video'] = row['video']
    if row['category']:
        entries.append(entry)
(output / 'catalog.json').write_text(json.dumps({'version': 1, 'entries': entries}, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print(f'{len(entries)} works and {len(selection)} optimized images ready.')
