const PLAYER_ID_KEY = "hangman-player-id";

export function getOrCreatePlayerId(): string {
  const existing = localStorage.getItem(PLAYER_ID_KEY);

  if (existing) {
    return existing;
  }

  const newId = crypto.randomUUID();
  localStorage.setItem(PLAYER_ID_KEY, newId);
  return newId;
}