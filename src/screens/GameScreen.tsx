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
  const [copySuccess, setCopySuccess] = useState(false);

  const isSetter = game.currentSetter === playerId;
  const isGuesser = game.currentGuesser === playerId;
  const isGameOver = game.phase === "won" || game.phase === "lost";
  const canStartNextRound = game.roundStatus === "finished" && isGuesser;

  const setterName =
    game.currentSetter === game.hostPlayerId ? game.hostName : game.guestName;

  const guesserName =
    game.currentGuesser === game.hostPlayerId ? game.hostName : game.guestName;

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

  async function handleCopyRoomCode() {
    try {
      await navigator.clipboard.writeText(game.roomCode);
      setCopySuccess(true);

      window.setTimeout(() => {
        setCopySuccess(false);
      }, 1800);
    } catch (error) {
      console.error(error);
      alert("Der Room-Code konnte nicht kopiert werden.");
    }
  }

  return (
    <ScreenContainer title="Spiel läuft">
      <div style={{ display: "grid", gap: "1rem" }}>
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #d9e3f3",
            borderRadius: "22px",
            padding: "1rem",
            display: "grid",
            gap: "0.9rem",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ color: "#5b6475", fontSize: "0.9rem" }}>Room-Code</div>
              <div style={{ fontSize: "1.35rem", fontWeight: 800, letterSpacing: "0.08em" }}>
                {game.roomCode}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyRoomCode}
              style={{
                background: copySuccess ? "#dcfce7" : "#e8eefc",
                color: "#0f172a",
                fontWeight: 700,
                minHeight: "48px",
              }}
            >
              {copySuccess ? "Kopiert!" : "Code kopieren"}
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "0.8rem",
            }}
          >
            <div
              style={{
                background: "#f8fbff",
                border: "1px solid #e2eaf7",
                borderRadius: "18px",
                padding: "0.9rem",
              }}
            >
              <div style={{ color: "#5b6475", fontSize: "0.9rem" }}>Runde</div>
              <div style={{ fontWeight: 800, fontSize: "1.25rem" }}>{game.roundNumber}</div>
            </div>

            <div
              style={{
                background: "#f8fbff",
                border: "1px solid #e2eaf7",
                borderRadius: "18px",
                padding: "0.9rem",
              }}
            >
              <div style={{ color: "#5b6475", fontSize: "0.9rem" }}>Status</div>
              <div style={{ fontWeight: 800, fontSize: "1rem" }}>
                {game.phase === "playing" && "Spiel läuft"}
                {game.phase === "won" && "Wort erraten 🎉"}
                {game.phase === "lost" && "Zu viele Fehler 💀"}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #d9e3f3",
            borderRadius: "22px",
            padding: "1rem",
            display: "grid",
            gap: "0.8rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "0.8rem",
            }}
          >
            <div
              style={{
                background: "#f8fbff",
                border: "1px solid #e2eaf7",
                borderRadius: "18px",
                padding: "0.9rem",
              }}
            >
              <div style={{ color: "#5b6475", fontSize: "0.9rem" }}>Wortgeber</div>
              <div style={{ fontWeight: 800 }}>{setterName}</div>
            </div>

            <div
              style={{
                background: "#f8fbff",
                border: "1px solid #e2eaf7",
                borderRadius: "18px",
                padding: "0.9rem",
              }}
            >
              <div style={{ color: "#5b6475", fontSize: "0.9rem" }}>Rater</div>
              <div style={{ fontWeight: 800 }}>{guesserName}</div>
            </div>

            <div
              style={{
                background: isSetter ? "#dbeafe" : isGuesser ? "#dcfce7" : "#f8fbff",
                border: "1px solid #e2eaf7",
                borderRadius: "18px",
                padding: "0.9rem",
              }}
            >
              <div style={{ color: "#5b6475", fontSize: "0.9rem" }}>Du bist</div>
              <div style={{ fontWeight: 800 }}>
                {isSetter && "Wortgeber"}
                {isGuesser && "Rater"}
                {!isSetter && !isGuesser && "Zuschauer"}
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#f8fbff",
              border: "1px solid #e2eaf7",
              borderRadius: "18px",
              padding: "1rem",
            }}
          >
            <div style={{ color: "#5b6475", fontSize: "0.9rem", marginBottom: "0.4rem" }}>
              Punkte
            </div>
            <div style={{ fontWeight: 800, fontSize: "1.1rem" }}>
              {game.hostName} {game.hostScore} : {game.guestScore} {game.guestName}
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #d9e3f3",
            borderRadius: "22px",
            padding: "1rem",
            display: "grid",
            gap: "1rem",
          }}
        >
          <div>
            <div
              style={{
                color: "#5b6475",
                fontSize: "0.9rem",
                marginBottom: "0.45rem",
              }}
            >
              Wort
            </div>

            <div
              style={{
                fontSize: "clamp(1.5rem, 5vw, 2.3rem)",
                letterSpacing: "0.28rem",
                fontWeight: 800,
                lineHeight: 1.3,
                wordBreak: "break-word",
              }}
            >
              {maskedWord}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              background: "#f8fbff",
              border: "1px solid #e2eaf7",
              borderRadius: "20px",
              padding: "0.5rem",
            }}
          >
            <HangmanFigure wrongGuessCount={game.wrongLetters.length} />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "0.8rem",
            }}
          >
            <div
              style={{
                background: "#f8fbff",
                border: "1px solid #e2eaf7",
                borderRadius: "18px",
                padding: "0.9rem",
              }}
            >
              <div style={{ color: "#5b6475", fontSize: "0.9rem" }}>
                Richtige Buchstaben
              </div>
              <div style={{ fontWeight: 700, marginTop: "0.35rem" }}>
                {game.guessedLetters.length > 0
                  ? game.guessedLetters.join(", ")
                  : "keine"}
              </div>
            </div>

            <div
              style={{
                background: "#fff7f7",
                border: "1px solid #ffd6d6",
                borderRadius: "18px",
                padding: "0.9rem",
              }}
            >
              <div style={{ color: "#5b6475", fontSize: "0.9rem" }}>
                Falsche Buchstaben
              </div>
              <div style={{ fontWeight: 700, marginTop: "0.35rem" }}>
                {game.wrongLetters.length > 0
                  ? game.wrongLetters.join(", ")
                  : "keine"}
              </div>
            </div>

            <div
              style={{
                background: "#f8fbff",
                border: "1px solid #e2eaf7",
                borderRadius: "18px",
                padding: "0.9rem",
              }}
            >
              <div style={{ color: "#5b6475", fontSize: "0.9rem" }}>Fehlversuche</div>
              <div style={{ fontWeight: 800, marginTop: "0.35rem" }}>
                {game.wrongLetters.length} / {game.maxWrongGuesses}
              </div>
            </div>
          </div>
        </div>

        {isGuesser && !isGameOver && (
          <form
            onSubmit={handleGuess}
            style={{
              background: "#ffffff",
              border: "1px solid #d9e3f3",
              borderRadius: "22px",
              padding: "1rem",
            }}
          >
            <div style={{ display: "grid", gap: "0.8rem" }}>
              <div style={{ fontWeight: 700 }}>Dein Tipp</div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "0.8rem",
                }}
              >
                <input
                  value={currentLetter}
                  onChange={(e) => setCurrentLetter(e.target.value)}
                  maxLength={1}
                  placeholder="A"
                  disabled={isSubmittingGuess}
                />
                <button
                  type="submit"
                  disabled={isSubmittingGuess}
                  style={{
                    background: "#2563eb",
                    color: "#fff",
                    fontWeight: 700,
                    minWidth: "120px",
                  }}
                >
                  {isSubmittingGuess ? "Speichert..." : "Raten"}
                </button>
              </div>
            </div>
          </form>
        )}

        {isSetter && !isGameOver && (
          <div
            style={{
              background: "#fffbea",
              border: "1px solid #f6e7b0",
              borderRadius: "18px",
              padding: "1rem",
            }}
          >
            Du hast das Wort gesetzt. <strong>{guesserName}</strong> ist jetzt dran.
          </div>
        )}

        {!game.guestPlayerId && (
          <div
            style={{
              background: "#fffbea",
              border: "1px solid #f6e7b0",
              borderRadius: "18px",
              padding: "1rem",
            }}
          >
            Warte darauf, dass ein zweiter Spieler dem Raum beitritt.
          </div>
        )}

        {game.roundStatus === "finished" && (
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #d9e3f3",
              borderRadius: "22px",
              padding: "1rem",
              display: "grid",
              gap: "1rem",
            }}
          >
            <h2 style={{ fontSize: "1.2rem" }}>Nächste Runde</h2>

            {canStartNextRound ? (
              <form onSubmit={handleStartNextRound}>
                <div style={{ display: "grid", gap: "1rem" }}>
                  <label>
                    <div style={{ fontWeight: 600 }}>Neues geheimes Wort</div>
                    <input
                      value={nextSecretWord}
                      onChange={(e) => setNextSecretWord(e.target.value)}
                      placeholder="z. B. BANANE"
                      disabled={isSubmittingNextRound}
                    />
                  </label>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmittingNextRound}
                      style={{
                        background: "#2563eb",
                        color: "#fff",
                        fontWeight: 700,
                        minHeight: "52px",
                      }}
                    >
                      {isSubmittingNextRound ? "Startet..." : "Neues Spiel"}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <p style={{ margin: 0 }}>
                Warte darauf, dass <strong>{guesserName}</strong> das nächste Wort setzt.
              </p>
            )}
          </div>
        )}

        <button
          onClick={onBackToHome}
          style={{
            background: "#e8eefc",
            color: "#0f172a",
            fontWeight: 700,
            minHeight: "54px",
          }}
        >
          Zurück zur Startseite
        </button>
      </div>
    </ScreenContainer>
  );
}

export default GameScreen;