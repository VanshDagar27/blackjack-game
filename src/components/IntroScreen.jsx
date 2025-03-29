import React from "react";
import "./IntroScreen.css";

const IntroScreen = ({ onStart }) => {
  const handleClick = () => {
    const click = new Audio("/sounds/click.mp3");
    click.volume = 1.0;
    click.play();
    onStart();
  };

  return (
    <div className="intro-screen">
      <div className="particles">
        {[...Array(120)].map((_, i) => (
          <span key={i} className="particle" style={{ '--i': i }} />
        ))}
      </div>

      <div className="intro-content">
        <div className="title-glow-wrapper">
          <h1 className="intro-title">♠ Welcome to Blackjack ♣</h1>
        </div>

        <button className="start-button" onClick={handleClick}>
          Start Game
        </button>

        <img src="/images/dealer.png" alt="Dealer" className="dealer-photo" />

        <p className="intro-sub">Ready to face the dealer?</p>
      </div>
    </div>
  );
};

export default IntroScreen;