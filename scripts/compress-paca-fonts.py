"""Losslessly package the existing editorial fonts as WOFF2. Requires fonttools/brotli."""
from pathlib import Path
from fontTools.ttLib import TTFont
import shutil
root=Path(__file__).resolve().parents[1]
for original,name in [('Cinzel','PacaEditorial'),('CrimsonPro','PacaScript')]:
    source=root/'projects/FCT/public/fonts'/f'{original}.ttf'
    target=root/'pages/paula/assets/fonts'/f'{name}.woff2'
    font=TTFont(source);font.flavor='woff2';font.save(target)
    shutil.copyfile(source.with_name(f'{original}-OFL.txt'),target.with_name(f'{name}-OFL.txt'))
    print(name,source.stat().st_size,'->',target.stat().st_size)
