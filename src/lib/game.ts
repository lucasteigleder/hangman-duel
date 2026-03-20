import type { GamePhase, LocalGameState } from "../types/game";

export function normalizeSecretWord(value: string): string {
  return value.trim().toUpperCase();
}

export function normalizeLetter(value: string): string {
  return value.trim().toUpperCase().slice(0, 1);
}

export function isLetterInWord(secretWord: string, letter: string): boolean {
  return secretWord.includes(letter);
}

export function getMaskedWord(secretWord: string, guessedLetters: string[]): string {
  return secretWord
    .split("")
    .map((char) => {
      if (char === " ") return " ";
      return guessedLetters.includes(char) ? char : "_";
    })
    .join(" ");
}

export function getUniqueLetters(secretWord: string): string[] {
  return Array.from(new Set(secretWord.replaceAll(" ", "").split("")));
}

export function getGamePhase(
  secretWord: string,
  guessedLetters: string[],
  wrongLetters: string[],
  maxWrongGuesses: number
): GamePhase {
  const uniqueLetters = getUniqueLetters(secretWord);
  const hasWon = uniqueLetters.every((letter) => guessedLetters.includes(letter));
  const hasLost = wrongLetters.length >= maxWrongGuesses;

  if (hasWon) return "won";
  if (hasLost) return "lost";
  return "playing";
}

export function applyGuess(game: LocalGameState, rawLetter: string): LocalGameState {
  const letter = normalizeLetter(rawLetter);

  if (!letter) return game;
  if (game.phase !== "playing") return game;
  if (game.guessedLetters.includes(letter) || game.wrongLetters.includes(letter)) {
    return game;
  }

  const isCorrect = isLetterInWord(game.secretWord, letter);

  const nextGuessedLetters = isCorrect
    ? [...game.guessedLetters, letter]
    : game.guessedLetters;

  const nextWrongLetters = isCorrect
    ? game.wrongLetters
    : [...game.wrongLetters, letter];

  const nextPhase = getGamePhase(
    game.secretWord,
    nextGuessedLetters,
    nextWrongLetters,
    game.maxWrongGuesses
  );

  return {
    ...game,
    guessedLetters: nextGuessedLetters,
    wrongLetters: nextWrongLetters,
    phase: nextPhase,
  };
}