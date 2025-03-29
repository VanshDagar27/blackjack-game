import { useState, useRef, useEffect } from "react";
import { getNewDeck, drawCards } from "./utils/deck";
import PreloadImages from "./components/PreloadImages";
import IntroScreen from "./components/IntroScreen";
import "./App.css";

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [deckId, setDeckId] = useState(null);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");

  const audioRef = useRef(null);
  const clickRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 1;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const playClick = () => {
    if (clickRef.current) {
      clickRef.current.currentTime = 0;
      clickRef.current.volume = 0.6;
      clickRef.current.play();
    }
  };

  const initGame = async () => {
    const newDeck = await getNewDeck();
    const playerCards = await drawCards(newDeck, 2);
    const dealerCards = await drawCards(newDeck, 2);

    setDeckId(newDeck);
    setPlayerHand(playerCards);
    setDealerHand(dealerCards);
    setGameOver(false);
    setMessage("");
  };

  const beginFromIntro = async () => {
    playClick();

    if (audioRef.current) {
      let vol = 1;
      const fade = setInterval(() => {
        vol -= 0.05;
        if (vol <= 0.2) {
          vol = 0.2;
          clearInterval(fade);
        }
        audioRef.current.volume = vol;
      }, 100);
    }

    await initGame();
    setShowIntro(false);
  };

  const getValue = (hand) => {
    let total = 0;
    let aces = 0;

    hand.forEach((card) => {
      if (card.value === "ACE") {
        total += 11;
        aces++;
      } else if (["KING", "QUEEN", "JACK"].includes(card.value)) {
        total += 10;
      } else {
        total += parseInt(card.value);
      }
    });

    while (total > 21 && aces > 0) {
      total -= 10;
      aces--;
    }

    return total;
  };

  const drawCard = async () => {
    playClick();
    if (gameOver || !deckId) return;

    const [newCard] = await drawCards(deckId, 1);
    const updated = [...playerHand, newCard];
    setPlayerHand(updated);

    if (getValue(updated) > 21) {
      setMessage("Bust! You lose.");
      setGameOver(true);
    }
  };

  const hold = async () => {
    playClick();
    let dealerUpdated = [...dealerHand];

    while (getValue(dealerUpdated) < 17) {
      const [extra] = await drawCards(deckId, 1);
      dealerUpdated.push(extra);
    }

    setDealerHand(dealerUpdated);

    const userTotal = getValue(playerHand);
    const dealerTotal = getValue(dealerUpdated);

    if (dealerTotal > 21 || userTotal > dealerTotal) {
      setMessage("You win!");
    } else if (userTotal < dealerTotal) {
      setMessage("Dealer wins!");
    } else {
      setMessage("It's a draw!");
    }

    setGameOver(true);
  };

  return (
    <>
      <audio ref={audioRef} loop>
        <source src="/music/tuyo.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={clickRef}>
        <source src="/sounds/click.mp3" type="audio/mpeg" />
      </audio>

      {showIntro ? (
        <IntroScreen onStart={beginFromIntro} />
      ) : (
        <div className="App">
          <PreloadImages />
          <h1>BLACKJACK</h1>

          <div className="falling-effects">
            {Array.from({ length: 40 }).map((_, i) => (
              <span
                key={i}
                className="falling-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>

          <div className="game-grid">
            <div className="dealer-area card-overlay">
              <h2>DEALER'S HAND ({dealerHand.length})</h2>
              <img src="/images/dealer.png" alt="Dealer" className="dealer-photo" />
              <div className="hand-value styled-value">
                Value: {gameOver ? getValue(dealerHand) : "?"}
              </div>
              <div className="card-grid fixed-height">
                {dealerHand.map((card, i) => (
                  <img
                    key={i}
                    className="card small hoverable"
                    src={gameOver || i !== 0 ? card.image : "https://deckofcardsapi.com/static/img/back.png"}
                    alt="card"
                  />
                ))}
              </div>
            </div>

            <div className="player-area card-overlay">
              <h2>YOUR HAND ({playerHand.length})</h2>
              <img src="https://i.pinimg.com/474x/39/2e/0f/392e0f462c42eff5c04a836ef86fa3ca.jpg" alt="Player" className="dealer-photo" />
              <div className="hand-value styled-value">
                Value: {getValue(playerHand)}
              </div>
              <div className="card-grid fixed-height">
                {playerHand.map((card, i) => (
                  <img
                    key={i}
                    className="card small hoverable"
                    src={card.image}
                    alt={`${card.value} of ${card.suit}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="controls">
            {!gameOver ? (
              <>
                <button onClick={drawCard}>Hit</button>
                <button onClick={hold}>Stand</button>
              </>
            ) : (
              <button onClick={initGame}>Play Again</button>
            )}
          </div>

          {message && <h2 className="game-message">{message}</h2>}
        </div>
      )}
    </>
  );
}

export default App;
