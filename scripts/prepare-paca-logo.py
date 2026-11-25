"""Trace the supplied PACA JPG faithfully; requires Pillow, numpy and vtracer.
Usage: python scripts/prepare-paca-logo.py path/to/paca.jpg
The committed SVG is used directly; deployment does not need these tools.
"""
import sys, shutil, json
from pathlib import Path
import xml.etree.ElementTree as ET
import numpy as np
from PIL import Image
import vtracer

root=Path(__file__).resolve().parents[1]
assets=root/'pages/paula/assets'
source=Path(sys.argv[1])
image=Image.open(source).convert('RGB')
pixels=np.array(image)
corners=np.concatenate([pixels[:80,:80].reshape(-1,3),pixels[-80:,-80:].reshape(-1,3)])
background=tuple(np.median(corners,axis=0).astype(int))
background_hex='#'+''.join(f'{value:02x}' for value in background)
mask=(pixels.min(axis=2)>238).astype(np.uint8)
work=root/'dist/logo-trace';work.mkdir(parents=True,exist_ok=True)
groups=[]
for name,start,end in [('symbol',0,710),('wordmark',710,1024)]:
    part=np.full_like(pixels,255);part[start:end][mask[start:end]>0]=0
    bitmap=work/(name+'.png');svg_file=work/(name+'.svg')
    Image.fromarray(part).save(bitmap)
    vtracer.convert_image_to_svg_py(str(bitmap),str(svg_file),colormode='binary',mode='spline',filter_speckle=12,corner_threshold=60,length_threshold=4,path_precision=2)
    svg=ET.parse(svg_file).getroot();paths=[]
    for node in svg.iter():
        if node.tag.endswith('path') and node.attrib.get('fill','').lower() not in ('#ffffff','white'):
            attrs=' '.join(f'{key}="{value}"' for key,value in node.attrib.items() if key in ('d','transform','fill-rule'))
            paths.append('<path '+attrs+'/>')
    groups.append('<g data-logo-part="'+name+'">'+''.join(paths)+'</g>')
result='<svg xmlns="http://www.w3.org/2000/svg" viewBox="180 170 650 710" fill="currentColor">'+''.join(groups)+'</svg>'
(assets/'logo-paca.svg').write_text(result,encoding='utf-8')
shutil.copyfile(source,assets/'logo-paca.jpg')
(assets/'logo-paca.json').write_text(json.dumps({'background':background_hex,'source':'User supplied paca.jpg','method':'vtracer binary spline, separate symbol and wordmark'},indent=2),encoding='utf-8')
print(background_hex, 'paths:', result.count('<path'), 'bytes:',len(result.encode()))
