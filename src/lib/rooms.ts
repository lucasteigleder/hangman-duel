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
};

export function generateRoomCode(length = 6): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";

  for (let i = 0; i < length; i += 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}

export async function getRoomByCode(roomCode: string) {
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

export async function createRoom(secretWord: string) {
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
      })
      .select("*")
      .single();

    if (!error && data) {
      return data as RoomRow;
    }
  }

  throw new Error("Raum konnte nicht erstellt werden.");
}