import { useEffect, useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import CreateMatchScreen from "./screens/CreateMatchScreen";
import JoinMatchScreen from "./screens/JoinMatchScreen";
import GameScreen from "./screens/GameScreen";
import type { AppScreen, LocalGameState } from "./types/game";
import { normalizeSecretWord } from "./lib/game";
import {
  createRoom,
  getRoomByCode,
  submitGuess,
  type RoomRow,
} from "./lib/rooms";
import { supabase } from "./lib/supabase";

function mapRoomToGame(room: RoomRow): LocalGameState {
  return {
    roomId: room.id,
    roomCode: room.room_code,
    secretWord: room.host_secret_word,
    guessedLetters: room.guessed_letters ?? [],
    wrongLetters: room.wrong_letters ?? [],
    maxWrongGuesses: room.max_wrong_guesses ?? 6,
    phase: (room.phase as LocalGameState["phase"]) ?? "playing",
  };
}

function App() {
  const [screen, setScreen] = useState<AppScreen>("home");
  const [game, setGame] = useState<LocalGameState | null>(null);

  useEffect(() => {
    if (!game?.roomCode || !supabase) return;

    const channel = supabase
      .channel(`room-${game.roomCode}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rooms",
          filter: `room_code=eq.${game.roomCode}`,
        },
        (payload) => {
          const updatedRoom = payload.new as RoomRow;
          setGame(mapRoomToGame(updatedRoom));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [game?.roomCode]);

  function handleCreateMatch() {
    setScreen("create");
  }

  function handleJoinMatch() {
    setScreen("join");
  }

  async function handleStartGame(_: string, secretWord: string) {
    try {
      const room = await createRoom(normalizeSecretWord(secretWord));
      setGame(mapRoomToGame(room));
      setScreen("game");
    } catch (error) {
      console.error(error);
      alert("Raum konnte nicht erstellt werden.");
    }
  }

  async function handleJoinRoom(roomCode: string) {
    try {
      const room = await getRoomByCode(roomCode);

      if (!room) {
        alert("Kein Raum mit diesem Code gefunden.");
        return;
      }

      setGame(mapRoomToGame(room));
      setScreen("game");
    } catch (error) {
      console.error(error);
      alert("Raum konnte nicht geladen werden.");
    }
  }

  async function handleGuess(letter: string) {
    if (!game) return;

    try {
      const updatedRoom = await submitGuess(game.roomCode, letter);
      setGame(mapRoomToGame(updatedRoom));
    } catch (error) {
      console.error(error);
      alert("Buchstabe konnte nicht gespeichert werden.");
    }
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