import { createClient } from "@/lib/supabase/client";
import type { ProfileRow, DrinkingGroupRow } from "@/types/database";

export interface ConnectionSuggestion {
  user: Pick<ProfileRow, "id" | "name" | "title" | "avatar" | "bio">;
  mutualBuddies: number;
  compatibility: number;
  reason: string;
}

export async function getConnectionSuggestions(): Promise<ConnectionSuggestion[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Get IDs of existing connections
  const { data: connections } = await supabase
    .from("connections")
    .select("requester_id, addressee_id")
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

  const connectedIds = new Set<string>();
  for (const c of connections ?? []) {
    connectedIds.add(c.requester_id === user.id ? c.addressee_id : c.requester_id);
  }

  // Get users who are not connected to the current user
  const { data: allProfiles } = await supabase
    .from("profiles")
    .select("id, name, title, avatar, bio")
    .neq("id", user.id)
    .limit(20);

  if (!allProfiles) return [];

  const suggestions = allProfiles.filter((p) => !connectedIds.has(p.id)).slice(0, 10);

  // Simulate compatibility scoring
  return suggestions.map((p, i) => ({
    user: p,
    mutualBuddies: Math.floor(Math.random() * 30) + 5,
    compatibility: Math.floor(Math.random() * 30) + 60,
    reason: [
      "Shared spirits expertise",
      "Both love craft cocktails",
      "Complementary tasting skills",
      "Fellow brewing enthusiast",
      "Mutual interest in whiskey",
      "Same drinking district",
      "Similar tolerance level",
      "Both open to drink",
    ][i % 8],
  }));
}

export async function sendConnectionRequest(userId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("connections").upsert(
    { requester_id: user.id, addressee_id: userId, status: "pending" },
    { onConflict: "requester_id, addressee_id", ignoreDuplicates: true }
  );
  if (error) throw error;
}

export async function getGroups(): Promise<(DrinkingGroupRow & { isJoined: boolean })[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: groups } = await supabase
    .from("drinking_groups")
    .select("*")
    .order("member_count", { ascending: false });

  if (!groups) return [];

  let joinedSet = new Set<string>();
  if (user) {
    const { data: members } = await supabase
      .from("group_members")
      .select("group_id")
      .eq("user_id", user.id);
    joinedSet = new Set(members?.map((m) => m.group_id) ?? []);
  }

  return groups.map((g) => ({
    ...g,
    isJoined: joinedSet.has(g.id),
  }));
}

export async function joinGroup(groupId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("group_members")
    .insert({ group_id: groupId, user_id: user.id });
  if (error && error.code !== "23505") throw error;

  if (!error) {
    const { data: group } = await supabase
      .from("drinking_groups")
      .select("member_count")
      .eq("id", groupId)
      .single();

    if (group) {
      await supabase
        .from("drinking_groups")
        .update({ member_count: (group.member_count ?? 0) + 1 })
        .eq("id", groupId);
    }
  }
}

export async function leaveGroup(groupId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", user.id);

  if (!error) {
    const { data: group } = await supabase
      .from("drinking_groups")
      .select("member_count")
      .eq("id", groupId)
      .single();

    if (group) {
      await supabase
        .from("drinking_groups")
        .update({ member_count: Math.max(0, (group.member_count ?? 0) - 1) })
        .eq("id", groupId);
    }
  }
}
