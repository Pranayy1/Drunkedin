import { createClient } from "@/lib/supabase/client";
import type { PostRow, PostWithAuthor, CommentWithAuthor } from "@/types/database";

export async function getPosts(): Promise<PostWithAuthor[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: posts } = await supabase
    .from("posts")
    .select(`
      *,
      profiles:author_id (id, name, title, avatar)
    `)
    .order("created_at", { ascending: false });

  if (!posts) return [];

  const postIds = posts.map((p) => p.id);

  // Compute reaction counts from reactions table
  const { data: allReactions } = await supabase
    .from("reactions")
    .select("post_id, type")
    .in("post_id", postIds);

  const reactionCounts: Record<string, Record<string, number>> = {};
  for (const r of allReactions ?? []) {
    if (!reactionCounts[r.post_id]) {
      reactionCounts[r.post_id] = { cheers: 0, smooth: 0, strong: 0, legendary: 0 };
    }
    reactionCounts[r.post_id][r.type] = (reactionCounts[r.post_id][r.type] ?? 0) + 1;
  }

  // Compute comment counts from comments table
  const { data: allComments } = await supabase
    .from("comments")
    .select("post_id, id")
    .in("post_id", postIds);

  const commentCountMap: Record<string, number> = {};
  for (const c of allComments ?? []) {
    commentCountMap[c.post_id] = (commentCountMap[c.post_id] ?? 0) + 1;
  }

  // Get user's bookmarks and reactions
  let bookmarkedSet = new Set<string>();
  let reactedMap = new Map<string, string>();

  if (user) {
    const { data: bookmarks } = await supabase
      .from("bookmarks")
      .select("post_id")
      .eq("user_id", user.id);

    bookmarkedSet = new Set(bookmarks?.map((b) => b.post_id) ?? []);

    const { data: reactions } = await supabase
      .from("reactions")
      .select("post_id, type")
      .eq("user_id", user.id);

    for (const r of reactions ?? []) {
      reactedMap.set(r.post_id, r.type);
    }
  }

  return posts.map((p: any) => ({
    ...p,
    reactions: reactionCounts[p.id] ?? { cheers: 0, smooth: 0, strong: 0, legendary: 0 },
    comment_count: commentCountMap[p.id] ?? 0,
    bookmarked: bookmarkedSet.has(p.id),
    user_reaction: reactedMap.get(p.id) ?? null,
  }));
}

export async function createPost(content: string, hashtags: string[] = [], image?: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("posts").insert({
    author_id: user.id,
    content,
    hashtags,
    image: image ?? "",
  });
  if (error) throw error;
}

export async function toggleBookmark(postId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const existing = await supabase
    .from("bookmarks")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing.data) {
    await supabase.from("bookmarks").delete().eq("id", existing.data.id);
  } else {
    await supabase.from("bookmarks").insert({ post_id: postId, user_id: user.id });
  }
}

export async function addReaction(postId: string, type: "cheers" | "smooth" | "strong" | "legendary") {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const existing = await supabase
    .from("reactions")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: post } = await supabase
    .from("posts")
    .select("reactions")
    .eq("id", postId)
    .single();

  const currentReactions = post?.reactions ?? { cheers: 0, smooth: 0, strong: 0, legendary: 0 };

  if (existing.data) {
    await supabase.from("reactions").delete().eq("id", existing.data.id);
    currentReactions[type] = Math.max(0, (currentReactions[type] ?? 0) - 1);
  } else {
    await supabase.from("reactions").insert({ post_id: postId, user_id: user.id, type });
    currentReactions[type] = (currentReactions[type] ?? 0) + 1;
  }

  await supabase
    .from("posts")
    .update({ reactions: currentReactions })
    .eq("id", postId);
}

export async function getComments(postId: string): Promise<CommentWithAuthor[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("comments")
    .select(`
      *,
      profiles:author_id (id, name, title, avatar)
    `)
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  return data ?? [];
}

export async function createComment(postId: string, content: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    author_id: user.id,
    content,
  });
  if (error) throw error;

  const { data: post } = await supabase
    .from("posts")
    .select("comment_count")
    .eq("id", postId)
    .single();

  if (post) {
    await supabase
      .from("posts")
      .update({ comment_count: (post.comment_count ?? 0) + 1 })
      .eq("id", postId);
  }
}

export async function getTrendingHashtags() {
  const supabase = createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("hashtags")
    .limit(100);

  const tagCounts = new Map<string, number>();
  for (const post of posts ?? []) {
    for (const tag of post.hashtags) {
      tagCounts.set(`#${tag}`, (tagCounts.get(`#${tag}`) ?? 0) + 1);
    }
  }

  return Array.from(tagCounts.entries())
    .map(([tag, posts]) => ({ tag, posts: posts * 100 }))
    .sort((a, b) => b.posts - a.posts)
    .slice(0, 8);
}
