import { createClient } from "@/lib/supabase/client";
import type { RoomWithParticipants } from "@/types/database";

export async function getRooms(): Promise<RoomWithParticipants[]> {
  const supabase = createClient();

  const { data: rooms } = await supabase
    .from("rooms")
    .select(`
      *,
      host:host_id (id, name, title, avatar),
      participants:room_participants(
        user:user_id (id, name, title, avatar)
      )
    `)
    .order("is_live", { ascending: false })
    .order("created_at", { ascending: false });

  if (!rooms) return [];

  return rooms.map((r: any) => ({
    ...r,
    host: r.host,
    participants: r.participants?.map((p: any) => p.user) ?? [],
    participant_count: r.participants?.length ?? 0,
    scheduled_time: r.scheduled_time,
  }));
}

export async function createRoom(data: {
  name: string;
  theme: string;
  description: string;
  maxParticipants: number;
  tags: string[];
  music?: string;
  scheduledTime?: string;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("rooms").insert({
    name: data.name,
    theme: data.theme,
    description: data.description,
    host_id: user.id,
    max_participants: data.maxParticipants,
    tags: data.tags,
    music: data.music ?? "",
    scheduled_time: data.scheduledTime ?? null,
    is_live: !data.scheduledTime,
  });
  if (error) throw error;
}

export async function joinRoom(roomId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("room_participants")
    .insert({ room_id: roomId, user_id: user.id });
  if (error && error.code !== "23505") throw error;
}

export async function getUserRoomIds(): Promise<Set<string>> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Set();

  const { data } = await supabase
    .from("room_participants")
    .select("room_id")
    .eq("user_id", user.id);

  return new Set(data?.map((r) => r.room_id) ?? []);
}

export async function leaveRoom(roomId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("room_participants")
    .delete()
    .eq("room_id", roomId)
    .eq("user_id", user.id);
}
