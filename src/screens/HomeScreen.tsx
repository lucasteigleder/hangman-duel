import ScreenContainer from "../components/ScreenContainer";

type HomeScreenProps = {
  onCreateMatch: () => void;
  onJoinMatch: () => void;
};

function HomeScreen({ onCreateMatch, onJoinMatch }: HomeScreenProps) {
  return (
    <ScreenContainer title="Galgenmännchen Duel">
      <div
        style={{
          display: "grid",
          gap: "1.25rem",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #d9e3f3",
            borderRadius: "22px",
            padding: "1.15rem",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#5b6475",
              fontSize: "1rem",
            }}
          >
            Spiele Galgenmännchen live gegen eine andere Person auf einem zweiten
            Gerät.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: "0.9rem",
          }}
        >
          <button
            onClick={onCreateMatch}
            style={{
              background: "#2563eb",
              color: "#fff",
              fontWeight: 700,
              minHeight: "56px",
              boxShadow: "0 10px 24px rgba(37, 99, 235, 0.2)",
            }}
          >
            Match erstellen
          </button>

          <button
            onClick={onJoinMatch}
            style={{
              background: "#e8eefc",
              color: "#0f172a",
              fontWeight: 700,
              minHeight: "56px",
            }}
          >
            Match beitreten
          </button>
        </div>
      </div>
    </ScreenContainer>
  );
}

export default HomeScreen;