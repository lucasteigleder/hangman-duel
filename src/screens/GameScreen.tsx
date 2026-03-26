import { useMemo, useState } from "react";
import ScreenContainer from "../components/ScreenContainer";
import HangmanFigure from "../components/HangmanFigure";
import type { LocalGameState } from "../types/game";
import { getMaskedWord, normalizeLetter } from "../lib/game";

type GameScreenProps = {
  game: LocalGameState;
  playerId: string;
  onGuess: (letter: string) => void | Promise<void>;
  onStartNextRound: (secretWord: string) => void | Promise<void>;
  onBackToHome: () => void;
};

function GameScreen({
  game,
  playerId,
  onGuess,
  onStartNextRound,
  onBackToHome,
}: GameScreenProps) {
  const [currentLetter, setCurrentLetter] = useState("");
  const [nextSecretWord, setNextSecretWord] = useState("");
  const [isSubmittingGuess, setIsSubmittingGuess] = useState(false);
  const [isSubmittingNextRound, setIsSubmittingNextRound] = useState(false);

  const isSetter = game.currentSetter === playerId;
  const isGuesser = game.currentGuesser === playerId;
  const isGameOver = game.phase === "won" || game.phase === "lost";
  const canStartNextRound = game.roundStatus === "finished" && isGuesser;

  const maskedWord = useMemo(() => {
    if (isSetter) {
      return game.secretWord.split("").join(" ");
    }

    return getMaskedWord(game.secretWord, game.guessedLetters);
  }, [game.secretWord, game.guessedLetters, isSetter]);

  async function handleGuess(e: React.FormEvent) {
    e.preventDefault();

    const letter = normalizeLetter(currentLetter);

    if (!letter) {
      alert("Bitte einen Buchstaben eingeben.");
      return;
    }

    try {
      setIsSubmittingGuess(true);
      await onGuess(letter);
      setCurrentLetter("");
    } finally {
      setIsSubmittingGuess(false);
    }
  }

  async function handleStartNextRound(e: React.FormEvent) {
    e.preventDefault();

    const cleanWord = nextSecretWord.trim().toUpperCase();

    if (!cleanWord) {
      alert("Bitte ein neues Wort eingeben.");
      return;
    }

    try {
      setIsSubmittingNextRound(true);
      await onStartNextRound(cleanWord);
      setNextSecretWord("");
    } finally {
      setIsSubmittingNextRound(false);
    }
  }

  return (
    <ScreenContainer title="Spiel läuft">
      <p>
        <strong>Room-Code:</strong> {game.roomCode}
      </p>

      <p>
        <strong>Runde:</strong> {game.roundNumber}
      </p>

      <p>
        <strong>Deine Rolle:</strong>{" "}
        {isSetter && "Wortgeber"}
        {isGuesser && "Rater"}
        {!isSetter && !isGuesser && "Zuschauer"}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        {game.phase === "playing" && "Spiel läuft"}
        {game.phase === "won" && "Wort erraten 🎉"}
        {game.phase === "lost" && "Zu viele Fehler 💀"}
      </p>

      <p>
        <strong>Punkte:</strong> Host {game.hostScore} : {game.guestScore} Guest
      </p>

      <p>
        <strong>Wort:</strong>
      </p>

      <div
        style={{
          fontSize: "2rem",
          letterSpacing: "0.3rem",
          marginBottom: "1rem",
          fontWeight: 700,
        }}
      >
        {maskedWord}
      </div>

      <HangmanFigure wrongGuessCount={game.wrongLetters.length} />

      <p>
        <strong>Richtige Buchstaben:</strong>{" "}
        {game.guessedLetters.length > 0
          ? game.guessedLetters.join(", ")
          : "keine"}
      </p>

      <p>
        <strong>Falsche Buchstaben:</strong>{" "}
        {game.wrongLetters.length > 0
          ? game.wrongLetters.join(", ")
          : "keine"}
      </p>

      <p>
        <strong>Fehlversuche:</strong> {game.wrongLetters.length} /{" "}
        {game.maxWrongGuesses}
      </p>

      {isGuesser && !isGameOver && (
        <form onSubmit={handleGuess} style={{ marginTop: "1.5rem" }}>
          <div style={{ display: "flex", gap: "1rem" }}>
            <input
              value={currentLetter}
              onChange={(e) => setCurrentLetter(e.target.value)}
              maxLength={1}
              placeholder="A"
              disabled={isSubmittingGuess}
            />
            <button type="submit" disabled={isSubmittingGuess}>
              {isSubmittingGuess ? "Speichert..." : "Buchstaben raten"}
            </button>
          </div>
        </form>
      )}

      {isSetter && !isGameOver && (
        <p style={{ marginTop: "1rem" }}>
          Du hast das Wort gesetzt. Der andere Spieler ist jetzt dran.
        </p>
      )}

      {!game.guestPlayerId && (
        <p style={{ marginTop: "1rem" }}>
          Warte darauf, dass ein zweiter Spieler dem Raum beitritt.
        </p>
      )}

      {game.roundStatus === "finished" && (
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ marginBottom: "0.75rem" }}>Nächste Runde</h2>

          {canStartNextRound ? (
            <form onSubmit={handleStartNextRound}>
              <div style={{ display: "grid", gap: "1rem" }}>
                <label>
                  <div>Neues geheimes Wort</div>
                  <input
                    value={nextSecretWord}
                    onChange={(e) => setNextSecretWord(e.target.value)}
                    placeholder="z. B. BANANE"
                    disabled={isSubmittingNextRound}
                  />
                </label>

                <div>
                  <button type="submit" disabled={isSubmittingNextRound}>
                    {isSubmittingNextRound ? "Startet..." : "Neues Spiel"}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <p>
              Warte darauf, dass der bisherige Rater das nächste Wort setzt.
            </p>
          )}
        </div>
      )}

      <div style={{ marginTop: "2rem" }}>
        <button onClick={onBackToHome}>Zurück zur Startseite</button>
      </div>
    </ScreenContainer>
  );
}

export default GameScreen;