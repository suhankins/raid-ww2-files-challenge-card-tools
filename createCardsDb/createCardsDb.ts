const [strings, dump] = await Promise.all([
    Deno.readTextFile('./gamedata/inventory.json').then((raw) =>
        JSON.parse(raw)
    ),
    Deno.readTextFile('./gamedata/dump.json').then((raw) => JSON.parse(raw)),
]);

const cardsDb = [];

for (const cardId in dump) {
    if (cardId === 'empty') {
        continue;
    }
    const card = dump[cardId];
    cardsDb.push({
        id: cardId,
        name: strings[card.name],
        positiveEffect: card.positive_description && strings[card.positive_description.desc_id].replace(
            '$EFFECT_VALUE_1;',
            card.positive_description?.desc_params?.EFFECT_VALUE_1
        ),
        negativeEffect: card.negative_description && strings[card.negative_description.desc_id].replace(
            '$EFFECT_VALUE_1;',
            card.negative_description?.desc_params?.EFFECT_VALUE_1
        ),
        rarity: card.rarity.split('_')[2],
        category: card.card_category.split('_')[2],
        type: card.card_type.split('_')[2],
        texture: card.texture,
        bonusXp: card.bonus_xp,
        bonusXpMultiplier: card.bonus_xp_multiplier,
    });
}

await Deno.writeTextFile('cardsdb.json', JSON.stringify(cardsDb));
