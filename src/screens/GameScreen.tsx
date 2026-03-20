import { useMemo, useState } from "react";
import ScreenContainer from "../components/ScreenContainer";
import type { LocalGameState } from "../types/game";
import { getMaskedWord, normalizeLetter } from "../lib/game";

type GameScreenProps = {
  game: LocalGameState;
  onGuess: (letter: string) => void;
  onBackToHome: () => void;
};

function GameScreen({ game, onGuess, onBackToHome }: GameScreenProps) {
  const [currentLetter, setCurrentLetter] = useState("");

  const maskedWord = useMemo(() => {
    return getMaskedWord(game.secretWord, game.guessedLetters);
  }, [game.secretWord, game.guessedLetters]);

  const allTriedLetters = [...game.guessedLetters, ...game.wrongLetters];

  function handleGuess(e: React.FormEvent) {
    e.preventDefault();

    const letter = normalizeLetter(currentLetter);

    if (!letter) {
      alert("Bitte einen Buchstaben eingeben.");
      return;
    }

    onGuess(letter);
    setCurrentLetter("");
  }

  const isGameOver = game.phase === "won" || game.phase === "lost";

  return (
    <ScreenContainer title="Spiel läuft">
      <p>
        <strong>Room-Code:</strong> {game.roomCode}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        {game.phase === "playing" && "Spiel läuft"}
        {game.phase === "won" && "Gewonnen 🎉"}
        {game.phase === "lost" && "Verloren 💀"}
      </p>

      <p>
        <strong>Wort:</strong>
      </p>

      <div
        style={{
          fontSize: "2rem",
          letterSpacing: "0.3rem",
          marginBottom: "1.5rem",
          fontWeight: 700,
        }}
      >
        {maskedWord}
      </div>

      <p>
        <strong>Richtige Buchstaben:</strong>{" "}
        {game.guessedLetters.length > 0 ? game.guessedLetters.join(", ") : "keine"}
      </p>

      <p>
        <strong>Falsche Buchstaben:</strong>{" "}
        {game.wrongLetters.length > 0 ? game.wrongLetters.join(", ") : "keine"}
      </p>

      <p>
        <strong>Alle Versuche:</strong>{" "}
        {allTriedLetters.length > 0 ? allTriedLetters.join(", ") : "keine"}
      </p>

      <p>
        <strong>Fehlversuche:</strong> {game.wrongLetters.length} /{" "}
        {game.maxWrongGuesses}
      </p>

      {!isGameOver && (
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
      )}

      {game.phase === "won" && (
        <p style={{ marginTop: "1rem" }}>
          Stark! Du hast das Wort <strong>{game.secretWord}</strong> erraten.
        </p>
      )}

      {game.phase === "lost" && (
        <p style={{ marginTop: "1rem" }}>
          Schade! Das gesuchte Wort war <strong>{game.secretWord}</strong>.
        </p>
      )}

      <div style={{ marginTop: "2rem" }}>
        <button onClick={onBackToHome}>Zurück zur Startseite</button>
      </div>
    </ScreenContainer>
  );
}

export default GameScreen;