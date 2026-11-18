"""Build deterministic crouched/defeated royal sprites from each team's artwork.

Run after build-characters.py; source sheets and standing thumbnails are untouched.
The same segmentation used for the 3D rig gives every royal its own two poses.
"""
from pathlib import Path
import json
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'sprites'/'characters'
ROYALS={'agrias','teta','dancer','mime-female','ovelia','balmafula',
        'ramza','delita','cloud','orlandu','mustadio','beowulf',
        'dycedarg','gaff-gafgarion'}

def grounded(image):
    bbox=image.getbbox()
    if not bbox: raise ValueError('Empty royal sprite')
    tight=image.crop(bbox)
    if tight.width>30 or tight.height>38:
        factor=min(30/tight.width,38/tight.height)
        tight=tight.resize((max(1,round(tight.width*factor)),max(1,round(tight.height*factor))),Image.Resampling.NEAREST)
    canvas=Image.new('RGBA',(32,40))
    canvas.alpha_composite(tight,((32-tight.width)//2,39-tight.height))
    return canvas

def crouched(sprite):
    tight=sprite.crop(sprite.getbbox());w,h=tight.size
    neck=round(h*.31);hips=round(h*.73)
    head=tight.crop((0,0,w,neck))
    torso=tight.crop((0,neck,w,hips))
    legs=tight.crop((0,hips,w,h))
    # Kneeling folds the shins and lowers the torso; the head is bowed slightly.
    legs=legs.resize((w,max(2,round(legs.height*.54))),Image.Resampling.NEAREST)
    head=head.rotate(8,Image.Resampling.NEAREST,expand=True)
    canvas=Image.new('RGBA',(48,48));x=(48-w)//2;bottom=46
    canvas.alpha_composite(legs,(x,bottom-legs.height))
    torso_y=bottom-legs.height-torso.height+2
    canvas.alpha_composite(torso,(x+1,torso_y))
    canvas.alpha_composite(head,(x+2,torso_y-head.height+2))
    return grounded(canvas)

def defeated(sprite):
    tight=sprite.crop(sprite.getbbox())
    # A separate resting silhouette lies on its side, no standing/idle frame.
    fallen=tight.rotate(90,Image.Resampling.NEAREST,expand=True)
    return grounded(fallen)

count=0
for character in json.loads((OUT/'catalog.json').read_text(encoding='utf-8')):
    if character['id'] not in ROYALS: continue
    for variant in character['variants']:
        stem=f'{character["id"]}-{variant["id"]}'
        sprite=Image.open(OUT/(stem+'-thumb.png')).convert('RGBA')
        for name,create in [('check',crouched),('defeated',defeated)]:
            create(sprite).save(OUT/(stem+'-'+name+'.png'),optimize=True)
            count+=1
print(f'{count} royal pose sprites generated; standing artwork preserved.')
