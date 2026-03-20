import { useState } from "react";
import ScreenContainer from "../components/ScreenContainer";
import { getRoomByCode } from "../lib/rooms";

type JoinMatchScreenProps = {
  onBack: () => void;
  onJoin: (roomCode: string) => void;
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

      const room = await getRoomByCode(cleanRoomCode);

      if (!room) {
        alert("Kein Raum mit diesem Code gefunden.");
        return;
      }

      alert(`Raum gefunden: ${room.room_code}`);
      onJoin(cleanRoomCode);
    } catch (error) {
      console.error(error);
      alert("Fehler beim Verbinden mit Supabase.");
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