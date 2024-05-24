from PIL import Image, ImageDraw, ImageFont
import json

with open('./gamedata/cardsdb.json') as rawJson:
    cards = json.load(rawJson)
    cardNameFont = ImageFont.truetype("./gamedata/DINEngschrift.ttf", 42)
    xpFont = ImageFont.truetype("./gamedata/DINEngschrift.ttf", 32)
    textColor = (255, 255, 255)

    for card in cards:
        with Image.open("./gamedata/challenge_cards/" + card['texture'] + ".png").convert("RGBA") as image:
            # Removing empty pixels
            bbox = image.getbbox()
            image = image.crop(bbox)
            # resizing all cards to the same size
            width = 358
            height = 512
            image = image.resize((width, height))

            context = ImageDraw.Draw(image)

            # halloween cards already have title on them
            if card['rarity'] != 'halloween':
                context.text((width/2, 457), card['name'].upper(), font=cardNameFont, fill=textColor, align='center', anchor='mt')

            if 'bonusXp' in card and card['bonusXp'] != 0:
                context.text((width/2, 13), "+" + str(card['bonusXp']), font=xpFont, fill=textColor, align='center', anchor='mt')

            if 'bonusXpMultiplier' in card and card['bonusXpMultiplier'] != 0:
                context.text((width/2, 13), 'x%.2f' % (card['bonusXpMultiplier'] + 1), font=xpFont, fill=textColor, align='center', anchor='mt')

            image.save("./new_challenge_cards/" + card['texture'] + ".png")
