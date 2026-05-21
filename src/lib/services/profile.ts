import { createClient } from "@/lib/supabase/client";
import type { ProfileRow, ProfileWithBadges } from "@/types/database";

export async function getProfile(userId: string): Promise<ProfileWithBadges | null> {
  const supabase = createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!profile) return null;

  const { data: badges } = await supabase
    .from("user_badges")
    .select("badges(*), earned_date")
    .eq("user_id", userId);

  const { data: experience } = await supabase
    .from("experience_entries")
    .select("*")
    .eq("user_id", userId)
    .order("sort_order");

  const { data: topBeverages } = await supabase
    .from("beverages")
    .select("*")
    .eq("user_id", userId)
    .order("sort_order");

  return {
    ...profile,
    badges: (badges ?? []).map((ub: any) => ({ ...ub.badges, earned_date: ub.earned_date })),
    experience: experience ?? [],
    top_beverages: topBeverages ?? [],
  };
}

export async function getCurrentProfile(): Promise<ProfileWithBadges | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return getProfile(user.id);
}

export async function updateProfile(userId: string, updates: Partial<ProfileRow>) {
  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId);
  if (error) throw error;
}
