import { createClient } from "@/lib/supabase/client";
import type { BadgeRow } from "@/types/database";

export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    name: string;
    title: string;
    avatar: string;
  };
  xp: number;
  level: number;
  change: "up" | "down" | "same";
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const supabase = createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name, title, avatar, xp, level")
    .order("xp", { ascending: false })
    .limit(20);

  if (!profiles) return [];

  return profiles.map((p, i) => ({
    rank: i + 1,
    user: { id: p.id, name: p.name, title: p.title, avatar: p.avatar },
    xp: p.xp,
    level: p.level,
    change: "same" as const,
  }));
}

export async function getBadges(): Promise<(BadgeRow & { earned: boolean; earned_date?: string })[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: allBadges } = await supabase
    .from("badges")
    .select("*")
    .order("rarity");

  if (!allBadges) return [];

  if (!user) {
    return allBadges.map((b) => ({ ...b, earned: false }));
  }

  const { data: userBadges } = await supabase
    .from("user_badges")
    .select("badge_id, earned_date")
    .eq("user_id", user.id);

  const earnedMap = new Map(
    (userBadges ?? []).map((ub) => [ub.badge_id, ub.earned_date])
  );

  return allBadges.map((b) => ({
    ...b,
    earned: earnedMap.has(b.id),
    earned_date: earnedMap.get(b.id) ?? undefined,
  }));
}
