import { createClient } from "@/lib/supabase/client";
import type { BartenderMessageRow, DrinkRow } from "@/types/database";

export interface BartenderMessageWithDrink extends BartenderMessageRow {
  drink_suggestion?: DrinkRow | null;
}

export async function getMessages(userId: string): Promise<BartenderMessageWithDrink[]> {
  const supabase = createClient();

  const { data: messages } = await supabase
    .from("bartender_messages")
    .select(`
      *,
      drink_suggestion:drink_suggestion_id (*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  return (messages ?? []).map((m: any) => ({
    ...m,
    drink_suggestion: m.drink_suggestion ?? null,
  }));
}

export async function sendMessage(userId: string, content: string) {
  const supabase = createClient();

  // Save user message
  const { error } = await supabase.from("bartender_messages").insert({
    user_id: userId,
    role: "user",
    content,
  });
  if (error) throw error;

  // Generate bartender response (simple mock — replace with AI later)
  const responses = [
    "Interesting choice. Based on your profile, I'd suggest pairing that with a slice of humble pie. Just kidding — try the Yamazaki 18. It's smoother than your last performance review.",
    "You want something to match your mood? Let me guess: it's a Monday, you're 3 meetings deep, and questioning every life choice. I prescribe a double Old Fashioned. Heavy on the 'old', like your coping mechanisms.",
    "A corporate drinking quote? Here you go: 'In Q3, we leveraged our core competency in fermentation to deliver a 40-proof solution that exceeded all expectations. Synergies were achieved. Hangovers were minimized.'",
    "Roast your tolerance? With pleasure. Your tolerance level is impressive — for someone who lists 'wine coolers' as a specialty. The bar at Applebee's called, they want their regular back. 😏",
  ];

  const randomResponse = responses[Math.floor(Math.random() * responses.length)];

  // Pick a random drink suggestion
  const { data: drinks } = await supabase
    .from("drinks")
    .select("id")
    .limit(1);

  const { error: botError } = await supabase.from("bartender_messages").insert({
    user_id: userId,
    role: "bartender",
    content: randomResponse,
    drink_suggestion_id: drinks?.[0]?.id ?? null,
  });
  if (botError) throw botError;
}
