// https://github.com/steam-test1/Raid-WW2-Lua-Complete/blob/5e7bda7fefb4dc101672184be0c30dd59cd78055/lib/tweak_data/challengecardstweakdata.lua
const [strings, lua] = await Promise.all([
    Deno.readTextFile('./gamedata/inventory.json').then((raw) =>
        JSON.parse(raw)
    ),
    Deno.readTextFile('./gamedata/challengecardstweakdata.lua'),
]);

const rarities = ['uncommon', 'common', 'rare', 'halloween'];
const types = ['raid', 'operation'];
const categories = ['booster', 'challenge'];

/**
 * @example getNumberFromLine('bonus_xp = 300,') // 300
 */
function getNumberFromLine(line: string) {
    return parseInt(line.split(' = ')[1].split(',')[0]);
}

/**
 * @example getStringFromLine('texture = "cc_raid_common_on_the_scrounge_hud",') // "cc_raid_common_on_the_scrounge_hud"
 */
function getStringFromLine(line: string) {
    return line.split('"')[1];
}

/**
 * @example getLocalizedStringFromLine('texture = "card_ra_on_the_scrounge_name_id",') // "On the Scrounge"
 */
function getLocalizedStringFromLine(line: string) {
    return strings[getStringFromLine(line)];
}

let currentObject: Record<string, string | number> = {};
let cardsDb: Record<string, string | number>[] = [];

for (const rawLine of lua.split('\n')) {
    const line = rawLine.trim();
    if (line.startsWith('self.cards.')) {
        cardsDb = [...cardsDb, currentObject];
        currentObject = {
            id: line.split('.')[2].split(' = ')[0],
        };
        continue;
    }
    if (line.startsWith('name = ') && currentObject.name === undefined) {
        currentObject.name = getLocalizedStringFromLine(line);
        continue;
    }
    if (line.startsWith('desc_id =')) {
        if (currentObject.positiveEffect === undefined) {
            currentObject.positiveEffect = getLocalizedStringFromLine(line);
        } else {
            currentObject.negativeEffect = getLocalizedStringFromLine(line);
        }
        continue;
    }
    if (line.startsWith('EFFECT_VALUE_1')) {
        if (currentObject.negativeEffect === undefined) {
            currentObject.positiveEffect = (
                currentObject.positiveEffect as string
            ).replace('$EFFECT_VALUE_1;', getStringFromLine(line));
        } else {
            currentObject.negativeEffect = (
                currentObject.negativeEffect as string
            ).replace('$EFFECT_VALUE_1;', getStringFromLine(line));
        }
        continue;
    }
    if (line.startsWith('rarity = ')) {
        currentObject.rarity =
            rarities.find((rarity) =>
                line.toLocaleLowerCase().includes(rarity)
            ) ?? '';
        continue;
    }
    if (line.startsWith('card_type = ')) {
        currentObject.type =
            types.find((type) => line.toLocaleLowerCase().includes(type)) ?? '';
        continue;
    }
    if (line.startsWith('card_category = ')) {
        currentObject.category =
            categories.find((category) =>
                line.toLocaleLowerCase().includes(category)
            ) ?? '';
        continue;
    }
    if (line.startsWith('texture = ')) {
        currentObject.texture = getStringFromLine(line);
        continue;
    }
    if (line.startsWith('bonus_xp = ')) {
        currentObject.bonusXp = getNumberFromLine(line);
        continue;
    }
    if (line.startsWith('bonus_xp_multiplier = ')) {
        currentObject.bonusXpMultiplier = getNumberFromLine(line);
        continue;
    }
}
cardsDb = [...cardsDb, currentObject];

// Removing empty cards generated on accident
cardsDb = cardsDb.filter((card) => card.name !== undefined);

await Deno.writeTextFile('cardsdb.json', JSON.stringify(cardsDb));
