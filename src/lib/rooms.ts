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

export async function getRoomByCode(roomCode: string) {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("room_code", roomCode)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as RoomRow | null;
}