export async function getNewDeck() {
    const res = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
    const data = await res.json();
    return data.deck_id;
  }
  
  export async function drawCards(deckId, count = 2) {
    const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`);
    const data = await res.json();
    return data.cards;
  }
  