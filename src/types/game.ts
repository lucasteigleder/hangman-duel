export type AppScreen = "home" | "create" | "join" | "game";

export type GamePhase = "setup" | "playing" | "won" | "lost";

export type PlayerRole = "host" | "guest";

export interface LocalGameState {
    roomCode: string;
    secretWord: string;
    guessedLetters: string[];
    wrongLetters: string[];
    maxWrongGuesses: number;
    phase: GamePhase;
}