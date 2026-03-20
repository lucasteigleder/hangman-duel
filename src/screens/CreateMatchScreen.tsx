import { useState } from "react";
import ScreenContainer from "../components/ScreenContainer";

type CreateMatchScreenProps = {
  onBack: () => void;
  onStartGame: (roomCode: string, secretWord: string) => void;
};

function CreateMatchScreen({ onBack, onStartGame }: CreateMatchScreenProps) {
  const [roomCode, setRoomCode] = useState("");
  const [secretWord, setSecretWord] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const cleanRoomCode = roomCode.trim().toUpperCase();
    const cleanSecretWord = secretWord.trim().toUpperCase();

    if (!cleanRoomCode || !cleanSecretWord) {
      alert("Bitte Room-Code und Wort eingeben.");
      return;
    }

    onStartGame(cleanRoomCode, cleanSecretWord);
  }

  return (
    <ScreenContainer title="Match erstellen">
      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gap: "1rem" }}>
          <label>
            <div>Room-Code</div>
            <input
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              placeholder="z. B. ABC123"
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
            Im nächsten Schritt bauen wir den echten Online-Raum. Aktuell ist das
            noch die lokale Testversion.
          </p>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button type="submit">Spiel starten</button>
            <button type="button" onClick={onBack}>
              Zurück
            </button>
          </div>
        </div>
      </form>
    </ScreenContainer>
  );
}

export default CreateMatchScreen;