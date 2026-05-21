import { createClient } from "@/lib/supabase/client";
import type { DrinkRow, DrinkCategoryDB, DrinkReviewWithAuthor } from "@/types/database";

export async function getDrinks(): Promise<DrinkRow[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("drinks")
    .select("*")
    .order("rating", { ascending: false });
  return data ?? [];
}

export async function getDrinksByCategory(category: DrinkCategoryDB | "All"): Promise<DrinkRow[]> {
  const supabase = createClient();
  let query = supabase.from("drinks").select("*");

  if (category !== "All") {
    query = query.eq("category", category);
  }

  const { data } = await query.order("rating", { ascending: false });
  return data ?? [];
}

export async function searchDrinks(search: string): Promise<DrinkRow[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("drinks")
    .select("*")
    .ilike("name", `%${search}%`)
    .order("rating", { ascending: false })
    .limit(20);
  return data ?? [];
}

export async function getDrinkById(id: string): Promise<DrinkRow | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("drinks")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export async function getDrinkReviews(drinkId: string): Promise<DrinkReviewWithAuthor[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("drink_reviews")
    .select(`
      *,
      profiles:user_id (id, name, avatar)
    `)
    .eq("drink_id", drinkId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function createDrinkReview(drinkId: string, rating: number, review: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("drink_reviews").insert({
    drink_id: drinkId,
    user_id: user.id,
    rating,
    review,
  });
  if (error && error.code === "23505") throw new Error("You have already reviewed this drink");
  if (error) throw error;
}

export async function deleteDrinkReview(reviewId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: review } = await supabase
    .from("drink_reviews")
    .select("id")
    .eq("id", reviewId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!review) throw new Error("Review not found");

  const { error } = await supabase
    .from("drink_reviews")
    .delete()
    .eq("id", reviewId);
  if (error) throw error;
}
