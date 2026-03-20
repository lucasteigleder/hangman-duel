import { useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import CreateMatchScreen from "./screens/CreateMatchScreen";
import JoinMatchScreen from "./screens/JoinMatchScreen";
import GameScreen from "./screens/GameScreen";
import type { AppScreen, LocalGameState } from "./types/game";
import { applyGuess, normalizeSecretWord } from "./lib/game";

function App() {
  const [screen, setScreen] = useState<AppScreen>("home");
  const [game, setGame] = useState<LocalGameState | null>(null);

  function handleCreateMatch() {
    setScreen("create");
  }

  function handleJoinMatch() {
    setScreen("join");
  }

  function handleStartGame(roomCode: string, secretWord: string) {
    setGame({
      roomCode,
      secretWord: normalizeSecretWord(secretWord),
      guessedLetters: [],
      wrongLetters: [],
      maxWrongGuesses: 6,
      phase: "playing",
    });

    setScreen("game");
  }

  function handleJoinRoom(roomCode: string) {
    setGame({
      roomCode,
      secretWord: "BEISPIEL",
      guessedLetters: [],
      wrongLetters: [],
      maxWrongGuesses: 6,
      phase: "playing",
    });

    setScreen("game");
  }

  function handleGuess(letter: string) {
    setGame((currentGame) => {
      if (!currentGame) return currentGame;
      return applyGuess(currentGame, letter);
    });
  }

  function handleBackToHome() {
    setScreen("home");
    setGame(null);
  }

  if (screen === "home") {
    return (
      <HomeScreen
        onCreateMatch={handleCreateMatch}
        onJoinMatch={handleJoinMatch}
      />
    );
  }

  if (screen === "create") {
    return (
      <CreateMatchScreen
        onBack={() => setScreen("home")}
        onStartGame={handleStartGame}
      />
    );
  }

  if (screen === "join") {
    return (
      <JoinMatchScreen
        onBack={() => setScreen("home")}
        onJoin={handleJoinRoom}
      />
    );
  }

  if (screen === "game" && game) {
    return (
      <GameScreen
        game={game}
        onGuess={handleGuess}
        onBackToHome={handleBackToHome}
      />
    );
  }

  return null;
}

export default App;