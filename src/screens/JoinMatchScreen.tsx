import { useState } from "react";
import ScreenContainer from "../components/ScreenContainer";

type JoinMatchScreenProps = {
  onBack: () => void;
  onJoin: (roomCode: string) => void;
};

function JoinMatchScreen({ onBack, onJoin }: JoinMatchScreenProps) {
  const [roomCode, setRoomCode] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const cleanRoomCode = roomCode.trim().toUpperCase();

    if (!cleanRoomCode) {
      alert("Bitte einen Room-Code eingeben.");
      return;
    }

    onJoin(cleanRoomCode);
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
            <button type="submit">Beitreten</button>
            <button type="button" onClick={onBack}>
              Zurück
            </button>
          </div>
        </div>
      </form>
    </ScreenContainer>
  );
}

export default JoinMatchScreen;