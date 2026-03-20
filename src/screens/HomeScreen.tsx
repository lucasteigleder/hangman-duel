import ScreenContainer from "../components/ScreenContainer";

type HomeScreenProps = {
  onCreateMatch: () => void;
  onJoinMatch: () => void;
};

function HomeScreen({ onCreateMatch, onJoinMatch }: HomeScreenProps) {
  return (
    <ScreenContainer title="Galgenmännchen Duel">
      <p>
        Spiele Galgenmännchen gegen eine andere Person auf einem zweiten Gerät.
      </p>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        <button onClick={onCreateMatch}>Match erstellen</button>
        <button onClick={onJoinMatch}>Match beitreten</button>
      </div>
    </ScreenContainer>
  );
}

export default HomeScreen;