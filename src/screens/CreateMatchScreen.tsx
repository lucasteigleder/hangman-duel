import { useState } from "react";
import ScreenContainer from "../components/ScreenContainer";

type CreateMatchScreenProps = {
  onBack: () => void;
  onStartGame: (playerName: string, secretWord: string) => void | Promise<void>;
};

function CreateMatchScreen({ onBack, onStartGame }: CreateMatchScreenProps) {
  const [playerName, setPlayerName] = useState("");
  const [secretWord, setSecretWord] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const cleanPlayerName = playerName.trim();
    const cleanSecretWord = secretWord.trim().toUpperCase();

    if (!cleanPlayerName) {
      alert("Bitte einen Namen eingeben.");
      return;
    }

    if (!cleanSecretWord) {
      alert("Bitte ein geheimes Wort eingeben.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onStartGame(cleanPlayerName, cleanSecretWord);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScreenContainer title="Match erstellen">
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gap: "1rem" }}>
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
            <label>
              <div style={{ fontWeight: 600 }}>Dein Name</div>
              <input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="z. B. Max"
              />
            </label>

            <label>
              <div style={{ fontWeight: 600 }}>Geheimes Wort</div>
              <input
                value={secretWord}
                onChange={(e) => setSecretWord(e.target.value)}
                placeholder="z. B. APFEL"
              />
            </label>
          </div>

          <p style={{ margin: 0, color: "#5b6475" }}>
            Der Room-Code wird automatisch erstellt.
          </p>

          <div style={{ display: "grid", gap: "0.8rem" }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: "#2563eb",
                color: "#fff",
                fontWeight: 700,
                minHeight: "54px",
              }}
            >
              {isSubmitting ? "Erstelle..." : "Spiel starten"}
            </button>

            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              style={{
                background: "#e8eefc",
                color: "#0f172a",
                fontWeight: 700,
                minHeight: "54px",
              }}
            >
              Zurück
            </button>
          </div>
        </div>
      </form>
    </ScreenContainer>
  );
}

export default CreateMatchScreen;