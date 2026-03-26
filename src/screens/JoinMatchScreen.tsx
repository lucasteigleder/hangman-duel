import { useState } from "react";
import ScreenContainer from "../components/ScreenContainer";

type JoinMatchScreenProps = {
  onBack: () => void;
  onJoin: (roomCode: string, playerName: string) => void | Promise<void>;
};

function JoinMatchScreen({ onBack, onJoin }: JoinMatchScreenProps) {
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const cleanRoomCode = roomCode.trim().toUpperCase();
    const cleanPlayerName = playerName.trim();

    if (!cleanRoomCode) {
      alert("Bitte einen Room-Code eingeben.");
      return;
    }

    if (!cleanPlayerName) {
      alert("Bitte einen Namen eingeben.");
      return;
    }

    try {
      setIsChecking(true);
      await onJoin(cleanRoomCode, cleanPlayerName);
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <ScreenContainer title="Match beitreten">
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
                placeholder="z. B. Lena"
              />
            </label>

            <label>
              <div style={{ fontWeight: 600 }}>Room-Code</div>
              <input
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="z. B. ABC123"
              />
            </label>
          </div>

          <div style={{ display: "grid", gap: "0.8rem" }}>
            <button
              type="submit"
              disabled={isChecking}
              style={{
                background: "#2563eb",
                color: "#fff",
                fontWeight: 700,
                minHeight: "54px",
              }}
            >
              {isChecking ? "Prüfe..." : "Beitreten"}
            </button>

            <button
              type="button"
              onClick={onBack}
              disabled={isChecking}
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

export default JoinMatchScreen;