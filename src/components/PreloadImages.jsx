import { useEffect } from "react";

const suits = ["C", "D", "H", "S"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "0", "J", "Q", "K"];

const cardCodes = [];

suits.forEach((suit) => {
  values.forEach((val) => {
    cardCodes.push(`${val}${suit}`);
  });
});

cardCodes.push("back");

const PreloadImages = () => {
  useEffect(() => {
    cardCodes.forEach((code) => {
      const img = new Image();
      img.src = `https://deckofcardsapi.com/static/img/${code}.png`;
    });
  }, []);

  return null;
};

export default PreloadImages;
