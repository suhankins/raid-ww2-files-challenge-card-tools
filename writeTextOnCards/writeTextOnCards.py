from PIL import Image, ImageDraw, ImageFont
import json
from pathlib import Path

def getPath(textureName):
    return "./gamedata/challenge_cards/" + textureName + ".png"

width = 358
height = 512
textColor = (255, 255, 255)

with open('./gamedata/cardsdb.json') as rawJson:
    cards = json.load(rawJson)
    cardNameFont = ImageFont.truetype("./gamedata/DINEngschrift.ttf", 42)
    xpFont = ImageFont.truetype("./gamedata/DINEngschrift.ttf", 32)

    for card in cards:
        if (not Path(getPath(card['texture'])).is_file()):
            card['texture'] = "cc_debug_card_hud"

        with Image.open(getPath(card['texture'])).convert("RGBA") as image:
            # Removing empty pixels
            bbox = image.getbbox()
            # Some cards have barely visible pixels on top which make bounding box bigger, offsetting text
            # To prevent that, we shrink bounding box
            if image.getpixel((width/2, 2))[3] > 0 and image.getpixel((width/2, 2))[3] < 150:
                bbox = (bbox[0], bbox[1] + 3, bbox[2], bbox[3] - 3)
            image = image.crop(bbox)
            # resizing all cards to the same size
            image = image.resize((width, height))

            context = ImageDraw.Draw(image)

            # halloween cards already have title on them
            if not ('rarity' in card) or card['rarity'] != 'halloween':
                context.text((width/2, 457), card['name'].upper(), font=cardNameFont, fill=textColor, align='center', anchor='mt')

            if 'bonusXp' in card and card['bonusXp'] != 0:
                context.text((width/2, 13), "+" + str(card['bonusXp']), font=xpFont, fill=textColor, align='center', anchor='mt')

            if 'bonusXpMultiplier' in card and card['bonusXpMultiplier'] != 0:
                context.text((width/2, 13), 'x%.2f' % (card['bonusXpMultiplier'] + 1), font=xpFont, fill=textColor, align='center', anchor='mt')
            
            Path("./new_challenge_cards/").mkdir(parents=True, exist_ok=True)

            filename = card['id'] + ".png"
            print("Saving " + filename)
            image.save("./new_challenge_cards/" + filename)
