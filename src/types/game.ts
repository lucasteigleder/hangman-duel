export type AppScreen = "home" | "create" | "join" | "game";

export type GamePhase = "setup" | "playing" | "won" | "lost";

export interface LocalGameState {
  roomId: string;
  roomCode: string;
  secretWord: string;
  guessedLetters: string[];
  wrongLetters: string[];
  maxWrongGuesses: number;
  phase: GamePhase;
  hostPlayerId: string | null;
  guestPlayerId: string | null;
  currentSetter: string | null;
  currentGuesser: string | null;
  hostScore: number;
  guestScore: number;
  roundNumber: number;
  roundStatus: string;
}