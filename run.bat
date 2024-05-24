cd createCardsDb
deno run createCardsDb.ts

cd ..
move .\createCardsDb\cardsdb.json .\writeTextOnCards\gamedata\cardsdb.json

cd writeTextOnCards
python3 writeTextOnCards.py
