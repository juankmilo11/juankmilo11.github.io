"""Extract original front/back/side palettes. Requires Pillow; never alters sheets."""
from pathlib import Path
from collections import deque
from collections import Counter
import json
import colorsys
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[1]
SPRITES = ROOT / 'sprites'
OUT = SPRITES / 'characters'
OUT.mkdir(exist_ok=True)

characters = []
PALETTES = json.loads((ROOT / 'scripts' / 'character-palettes.json').read_text(encoding='utf-8'))
FEMININE = {'Squire':'Escudera','Knight':'Caballera','Dragoon':'Dragoon','White Mage':'Maga blanca','Black Mage':'Maga negra','Summoner':'Invocadora'}
MASCULINE = {'Squire':'Escudero','Knight':'Caballero','Dragoon':'Dragoon','White Mage':'Mago blanco','Black Mage':'Mago negro','Summoner':'Invocador'}
for stem, label in [('Squire', 'Escudero'), ('Knight', 'Caballero'), ('Dragoon', 'Dragón'),
                    ('White Mage', 'Mago blanco'), ('Black Mage', 'Mago negro'), ('Summoner', 'Invocador')]:
    for gender in ['Female', 'Male']:
        filename = f'{stem} ({gender}).png'
        if stem == 'Squire':
            filename = 'PlayStation - Final Fantasy Tactics - Unit Classes - ' + filename
        characters.append((f'{stem.lower().replace(" ", "-")}-{gender.lower()}',
                           f'{FEMININE[stem] if gender == "Female" else MASCULINE[stem]}{(" · F" if gender == "Female" else " · M") if stem == "Dragoon" else ""}', filename, 5))
for key, name, filename, palettes in [
    ('agrias', 'Agrias', 'Playable Characters - Agrias Oaks', 1),
    ('ramza', 'Ramza', 'Playable Characters - Ramza Beoulve', 3),
    ('delita', 'Delita', 'Non-Playable Characters - Delita Hyral', 3),
    ('teta', 'Teta', 'Non-Playable Characters - Teta Hyral', 3),
]:
    characters.append((key, name, f'PlayStation - Final Fantasy Tactics - {filename}.png', palettes))

for stem in ['Monk', 'Thief', 'Archer', 'Geomancer', 'Samurai', 'Ninja']:
    for gender in ['Female', 'Male']:
        characters.append((f'{stem.lower()}-{gender.lower()}', f'{stem} · {gender}', f'{stem} ({gender}).png', 5))
for name in ['Cloud','Orlandu','Mustadio','Beowulf','Dycedarg','Gaff Gafgarion','Ovelia','Balmafula','Dancer','Mime (Female)']:
    key=name.lower().replace(' (female)','-female').replace(' ','-')
    characters.append((key,name,name+'.png',5 if name in ['Dancer','Mime (Female)'] else 1))

EXTRA_COLORS=[('Azul','#497bbd'),('Carmesí','#ba4654'),('Jade','#438c73'),('Amatista','#9362b1'),('Oro','#b39543')]
def recolor(image, color):
    result=image.copy()
    hue=colorsys.rgb_to_hls(*(int(color[i:i+2],16)/255 for i in [1,3,5]))[0]
    for y in range(result.height):
        for x in range(result.width):
            r,g,b,a=result.getpixel((x,y))
            if not a: continue
            h,l,s=colorsys.rgb_to_hls(r/255,g/255,b/255)
            # Retain skin, blond/brown hair, white highlights and the dark outline.
            protected=.02<h<.18 and l>.32 and s>.25
            if .08<l<.79 and not protected:
                rgb=colorsys.hls_to_rgb(hue,l,max(.35,min(.68,s)))
                result.putpixel((x,y),tuple(round(c*255) for c in rgb)+(a,))
    return result

def transparent(image):
    image = image.convert('RGBA')
    background = image.getpixel((image.width - 1, 0))[:3]
    # Remove only exterior background; preserve enclosed white/black clothing.
    def is_background(x, y):
        p = image.getpixel((x, y))
        return max(abs(p[c] - background[c]) for c in range(3)) <= 3
    queue = deque()
    seen = set()
    for x in range(image.width):
        for y in [0, image.height - 1]:
            if is_background(x, y): queue.append((x, y)); seen.add((x, y))
    for y in range(image.height):
        for x in [0, image.width - 1]:
            if is_background(x, y): queue.append((x, y)); seen.add((x, y))
    while queue:
        x, y = queue.popleft()
        image.putpixel((x, y), (0, 0, 0, 0))
        for nx, ny in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
            if 0 <= nx < image.width and 0 <= ny < image.height and (nx,ny) not in seen and is_background(nx,ny):
                queue.append((nx,ny)); seen.add((nx,ny))
    return image

def mask(image):
    bg = image.getpixel((image.width - 1, 0))[:3]
    return {(x,y) for x in range(image.width) for y in range(min(40, image.height))
            if max(abs(image.getpixel((x,y))[c]-bg[c]) for c in range(3)) > 3}

def origins(image, count):
    if count == 1: return [(0,0)]
    points = mask(image)
    xs = sorted({x for x,y in points})
    groups = []
    for x in xs:
        if not groups or x - groups[-1][-1] > 25: groups.append([x])
        else: groups[-1].append(x)
    # Match silhouettes, not colors. Sheets have slightly different paste offsets.
    reference = {(x,y) for x,y in points if 64 <= x < 160}
    bg = image.getpixel((image.width - 1,0))[:3]
    diff=ImageChops.difference(image,Image.new('RGB',image.size,bg))
    channels=diff.split()
    binary=ImageChops.lighter(ImageChops.lighter(channels[0],channels[1]),channels[2]).point(lambda v:255 if v>3 else 0).convert('1')
    stride=(image.width+7)//8
    reverse=bytes(int(f'{v:08b}'[::-1],2) for v in range(256))
    packed=binary.tobytes().translate(reverse)
    rows=[int.from_bytes(packed[y*stride:(y+1)*stride],'little') for y in range(image.height)]
    bits=(1<<96)-1
    reference_rows=[(rows[y]>>64)&bits for y in range(40)]
    def score(ox, oy):
        if ox+64<0 or ox+160>image.width or oy<0 or oy+40>image.height:return 99999
        return sum((reference_rows[y]^((rows[y+oy]>>(64+ox))&bits)).bit_count() for y in range(40))
    result = [(0,0)]
    for group in groups[1:]:
        estimate = group[0] - groups[0][0]
        result.append(min(((x,y) for x in range(estimate-8,estimate+9) for y in range(0,5)), key=lambda p: score(*p)))
    if count > len(result):
        # Generic second rows are near 306px; Teta's short sheet uses ~224px.
        lower = range(205,240) if image.height < 550 else range(295,325)
        for group_index in range(count-len(result)):
            estimate = result[group_index][0]
            result.append(min(((x,y) for x in range(max(0,estimate-8),estimate+9) for y in lower), key=lambda p: score(*p)))
    return result[:count]

catalog = []
for key, label, filename, count in characters:
    sheet = Image.open(SPRITES / filename).convert('RGB')
    offsets = origins(sheet,count)
    variants = []
    for index in range(5):
        ox,oy=offsets[index%len(offsets)]
        atlas = Image.new('RGBA',(96,40))
        for direction, column in enumerate([2,4,0]):
            crop = transparent(sheet.crop((ox+column*32,oy,ox+(column+1)*32,oy+40)))
            bbox = crop.getbbox()
            if not bbox: raise ValueError(f'Empty view: {key} {index} {direction}')
            content = crop.crop(bbox)
            normalized = Image.new('RGBA',(32,40))
            normalized.alpha_composite(content, ((32-content.width)//2,40-content.height))
            atlas.alpha_composite(normalized, (direction*32,0))
        if index>=len(offsets): atlas=recolor(atlas,EXTRA_COLORS[index][1])
        atlas.save(OUT / f'{key}-{index}.png', optimize=True)
        front = atlas.crop((0,0,32,40))
        tight = front.crop(front.getbbox())
        thumb = Image.new('RGBA',(32,40))
        thumb.alpha_composite(tight,((32-tight.width)//2,(40-tight.height)//2))
        thumb.save(OUT / f'{key}-{index}-thumb.png', optimize=True)
        name,color = PALETTES.get(key,EXTRA_COLORS)[index] if index<len(PALETTES.get(key,EXTRA_COLORS)) else EXTRA_COLORS[index]
        if key not in PALETTES and index<len(offsets):
            clothing=Counter()
            for r,g,b,a in atlas.getdata():
                h,l,s=colorsys.rgb_to_hls(r/255,g/255,b/255)
                if a and s>.22 and .12<l<.7 and not (.02<h<.18):clothing[(r,g,b)]+=1
            if clothing:
                rgb=clothing.most_common(1)[0][0]
                color='#'+''.join(f'{v:02x}' for v in rgb)
                hue=colorsys.rgb_to_hls(*(v/255 for v in rgb))[0]
                name=['Rojo','Ámbar','Oro','Lima','Verde','Jade','Turquesa','Cian','Azul','Violeta','Magenta','Rosa'][round(hue*12)%12]
        variants.append({'id': index, 'label': name, 'swatch': color})
    catalog.append({'id':key, 'name':label, 'variants':variants, 'source':filename, 'origins':offsets, 'aiOnly':key in ['dycedarg','gaff-gafgarion']})
    print(key, offsets)
(OUT / 'catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'{len(catalog)} characters, {sum(len(c["variants"]) for c in catalog)} palettes (original and derived)')
