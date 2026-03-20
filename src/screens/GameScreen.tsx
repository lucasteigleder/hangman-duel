import { useMemo, useState } from "react";
import ScreenContainer from "../components/ScreenContainer";
import type { LocalGameState } from "../types/game";

type GameScreenProps = {
  game: LocalGameState;
  onBackToHome: () => void;
};

function GameScreen({ game, onBackToHome }: GameScreenProps) {
  const [currentLetter, setCurrentLetter] = useState("");

  const maskedWord = useMemo(() => {
    return game.secretWord
      .split("")
      .map((letter) => {
        if (letter === " ") return " ";
        return game.guessedLetters.includes(letter) ? letter : "_";
      })
      .join(" ");
  }, [game.secretWord, game.guessedLetters]);

  function handleGuess(e: React.FormEvent) {
    e.preventDefault();
    alert(`Später wird geraten: ${currentLetter.toUpperCase()}`);
    setCurrentLetter("");
  }

  return (
    <ScreenContainer title="Spiel läuft">
      <p>
        <strong>Room-Code:</strong> {game.roomCode}
      </p>

      <p>
        <strong>Wort:</strong>
      </p>

      <div
        style={{
          fontSize: "2rem",
          letterSpacing: "0.3rem",
          marginBottom: "1.5rem",
        }}
      >
        {maskedWord}
      </div>

      <p>
        <strong>Falsche Buchstaben:</strong>{" "}
        {game.wrongLetters.length > 0 ? game.wrongLetters.join(", ") : "keine"}
      </p>

      <p>
        <strong>Fehlversuche:</strong> {game.wrongLetters.length} /{" "}
        {game.maxWrongGuesses}
      </p>

      <form onSubmit={handleGuess} style={{ marginTop: "1.5rem" }}>
        <div style={{ display: "flex", gap: "1rem" }}>
          <input
            value={currentLetter}
            onChange={(e) => setCurrentLetter(e.target.value)}
            maxLength={1}
            placeholder="A"
          />
          <button type="submit">Buchstaben raten</button>
        </div>
      </form>

      <div style={{ marginTop: "2rem" }}>
        <button onClick={onBackToHome}>Zurück zur Startseite</button>
      </div>
    </ScreenContainer>
  );
}

export default GameScreen;