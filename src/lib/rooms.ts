import { applyGuess } from "./game";
import { supabase } from "./supabase";

export type RoomRow = {
  id: string;
  room_code: string;
  host_secret_word: string;
  guessed_letters: string[];
  wrong_letters: string[];
  max_wrong_guesses: number;
  phase: string;
  created_at: string;
  updated_at: string;
  host_player_id: string | null;
  guest_player_id: string | null;
  current_setter: string | null;
  current_guesser: string | null;
  host_score: number;
  guest_score: number;
  round_number: number;
  round_status: string;
};

export function generateRoomCode(length = 6): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";

  for (let i = 0; i < length; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}

export async function getRoomByCode(roomCode: string): Promise<RoomRow | null> {
  if (!supabase) {
    throw new Error("Supabase ist noch nicht konfiguriert.");
  }

  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("room_code", roomCode)
    .maybeSingle();

  if (error) throw error;

  return data as RoomRow | null;
}

export async function createRoom(
  secretWord: string,
  hostPlayerId: string
): Promise<RoomRow> {
  if (!supabase) {
    throw new Error("Supabase ist noch nicht konfiguriert.");
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const roomCode = generateRoomCode();

    const { data, error } = await supabase
      .from("rooms")
      .insert({
        room_code: roomCode,
        host_secret_word: secretWord,
        guessed_letters: [],
        wrong_letters: [],
        max_wrong_guesses: 6,
        phase: "playing",
        host_player_id: hostPlayerId,
        guest_player_id: null,
        current_setter: hostPlayerId,
        current_guesser: null,
        host_score: 0,
        guest_score: 0,
        round_number: 1,
        round_status: "waiting_for_guesser",
      })
      .select("*")
      .single();

    if (!error && data) {
      return data as RoomRow;
    }
  }

  throw new Error("Raum konnte nicht erstellt werden.");
}

export async function joinRoom(
  roomCode: string,
  guestPlayerId: string
): Promise<RoomRow> {
  if (!supabase) {
    throw new Error("Supabase ist noch nicht konfiguriert.");
  }

  const room = await getRoomByCode(roomCode);

  if (!room) {
    throw new Error("Raum nicht gefunden.");
  }

  if (room.guest_player_id && room.guest_player_id !== guestPlayerId) {
    throw new Error("Raum ist bereits voll.");
  }

  if (room.host_player_id === guestPlayerId) {
    return room;
  }

  if (room.guest_player_id === guestPlayerId) {
    return room;
  }

  const { data, error } = await supabase
    .from("rooms")
    .update({
      guest_player_id: guestPlayerId,
      current_guesser: guestPlayerId,
      round_status: "playing",
      updated_at: new Date().toISOString(),
    })
    .eq("room_code", roomCode)
    .select("*")
    .single();

  if (error) throw error;

  return data as RoomRow;
}

export async function submitGuess(
  roomCode: string,
  letter: string,
  playerId: string
): Promise<RoomRow> {
  if (!supabase) {
    throw new Error("Supabase ist noch nicht konfiguriert.");
  }

  const room = await getRoomByCode(roomCode);

  if (!room) {
    throw new Error("Raum nicht gefunden.");
  }

  if (room.current_guesser !== playerId) {
    throw new Error("Du bist in dieser Runde nicht der Rater.");
  }

  const updatedGame = applyGuess(
    {
      roomId: room.id,
      roomCode: room.room_code,
      secretWord: room.host_secret_word,
      guessedLetters: room.guessed_letters ?? [],
      wrongLetters: room.wrong_letters ?? [],
      maxWrongGuesses: room.max_wrong_guesses ?? 6,
      phase: (room.phase as "playing" | "won" | "lost") ?? "playing",
      hostPlayerId: room.host_player_id,
      guestPlayerId: room.guest_player_id,
      currentSetter: room.current_setter,
      currentGuesser: room.current_guesser,
      hostScore: room.host_score ?? 0,
      guestScore: room.guest_score ?? 0,
      roundNumber: room.round_number ?? 1,
      roundStatus: room.round_status ?? "playing",
    },
    letter
  );

  let nextHostScore = room.host_score ?? 0;
  let nextGuestScore = room.guest_score ?? 0;
  let nextRoundStatus = room.round_status ?? "playing";

  if (updatedGame.phase === "won") {
    if (room.current_guesser === room.host_player_id) {
      nextHostScore += 1;
    } else if (room.current_guesser === room.guest_player_id) {
      nextGuestScore += 1;
    }

    nextRoundStatus = "finished";
  }

  if (updatedGame.phase === "lost") {
    if (room.current_setter === room.host_player_id) {
      nextHostScore += 1;
    } else if (room.current_setter === room.guest_player_id) {
      nextGuestScore += 1;
    }

    nextRoundStatus = "finished";
  }

  const { data, error } = await supabase
    .from("rooms")
    .update({
      guessed_letters: updatedGame.guessedLetters,
      wrong_letters: updatedGame.wrongLetters,
      phase: updatedGame.phase,
      host_score: nextHostScore,
      guest_score: nextGuestScore,
      round_status: nextRoundStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("room_code", roomCode)
    .select("*")
    .single();

  if (error) throw error;

  return data as RoomRow;
}

export async function startNextRound(
  roomCode: string,
  newSecretWord: string,
  playerId: string
): Promise<RoomRow> {
  if (!supabase) {
    throw new Error("Supabase ist noch nicht konfiguriert.");
  }

  const room = await getRoomByCode(roomCode);

  if (!room) {
    throw new Error("Raum nicht gefunden.");
  }

  if (!room.host_player_id || !room.guest_player_id) {
    throw new Error("Es müssen zwei Spieler im Raum sein.");
  }

  if (room.round_status !== "finished") {
    throw new Error("Die aktuelle Runde ist noch nicht beendet.");
  }

  const previousGuesser = room.current_guesser;
  const previousSetter = room.current_setter;

  if (!previousGuesser || !previousSetter) {
    throw new Error("Rollen konnten nicht bestimmt werden.");
  }

  if (playerId !== previousGuesser) {
    throw new Error("Nur der bisherige Rater darf das neue Spiel starten.");
  }

  const nextSetter = previousGuesser;
  const nextGuesser = previousSetter;

  const { data, error } = await supabase
    .from("rooms")
    .update({
      host_secret_word: newSecretWord,
      guessed_letters: [],
      wrong_letters: [],
      phase: "playing",
      current_setter: nextSetter,
      current_guesser: nextGuesser,
      round_number: (room.round_number ?? 1) + 1,
      round_status: "playing",
      updated_at: new Date().toISOString(),
    })
    .eq("room_code", roomCode)
    .select("*")
    .single();

  if (error) throw error;

  return data as RoomRow;
}