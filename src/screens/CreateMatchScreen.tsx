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
          <label>
            <div>Dein Name</div>
            <input
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="z. B. Max"
            />
          </label>

          <label>
            <div>Geheimes Wort</div>
            <input
              value={secretWord}
              onChange={(e) => setSecretWord(e.target.value)}
              placeholder="z. B. APFEL"
            />
          </label>

          <p style={{ margin: 0, fontSize: "0.95rem", opacity: 0.75 }}>
            Der Room-Code wird automatisch erstellt.
          </p>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Erstelle..." : "Spiel starten"}
            </button>
            <button type="button" onClick={onBack} disabled={isSubmitting}>
              Zurück
            </button>
          </div>
        </div>
      </form>
    </ScreenContainer>
  );
}

export default CreateMatchScreen;