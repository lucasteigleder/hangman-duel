import { useState } from "react";
import ScreenContainer from "../components/ScreenContainer";

type JoinMatchScreenProps = {
  onBack: () => void;
  onJoin: (roomCode: string) => void | Promise<void>;
};

function JoinMatchScreen({ onBack, onJoin }: JoinMatchScreenProps) {
  const [roomCode, setRoomCode] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const cleanRoomCode = roomCode.trim().toUpperCase();

    if (!cleanRoomCode) {
      alert("Bitte einen Room-Code eingeben.");
      return;
    }

    try {
      setIsChecking(true);
      await onJoin(cleanRoomCode);
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <ScreenContainer title="Match beitreten">
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

          <div style={{ display: "flex", gap: "1rem" }}>
            <button type="submit" disabled={isChecking}>
              {isChecking ? "Prüfe..." : "Beitreten"}
            </button>
            <button type="button" onClick={onBack} disabled={isChecking}>
              Zurück
            </button>
          </div>
        </div>
      </form>
    </ScreenContainer>
  );
}

export default JoinMatchScreen;