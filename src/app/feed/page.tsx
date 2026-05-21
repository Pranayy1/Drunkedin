"use client";

import { motion } from "framer-motion";
import { MessageCircle, Share2, Bookmark, TrendingUp } from "lucide-react";
import { REACTION_EMOJI } from "@/types";
import type { ReactionType } from "@/types";
import type { PostWithAuthor } from "@/types/database";
import AppShell from "@/components/layout/AppShell";
import { useState, useEffect } from "react";
import { getPosts, getTrendingHashtags, addReaction, toggleBookmark } from "@/lib/services/feed";
import { useAuth } from "@/components/providers/AuthProvider";
import CreatePostModal from "@/components/feed/CreatePostModal";
import CommentsSheet from "@/components/feed/CommentsSheet";

function PostCard({ post, index }: { post: PostWithAuthor; index: number }) {
  const [reactionCounts, setReactionCounts] = useState(
    post.reactions ?? { cheers: 0, smooth: 0, strong: 0, legendary: 0 }
  );
  const [bookmarked, setBookmarked] = useState(post.bookmarked ?? false);
  const [currentReaction, setCurrentReaction] = useState<ReactionType | null>(post.user_reaction as ReactionType | null ?? null);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comment_count ?? 0);

  const handleReaction = async (type: ReactionType) => {
    setReactionCounts((prev) => {
      const next = { ...prev };
      if (currentReaction === type) {
        next[type] = Math.max(0, next[type] - 1);
        setCurrentReaction(null);
      } else {
        if (currentReaction) {
          next[currentReaction] = Math.max(0, next[currentReaction] - 1);
        }
        next[type] = (next[type] ?? 0) + 1;
        setCurrentReaction(type);
      }
      return next;
    });
    await addReaction(post.id, type);
  };

  const handleBookmark = async () => {
    setBookmarked(!bookmarked);
    await toggleBookmark(post.id);
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="glass-card p-5 space-y-4 glass-hover transition-all duration-300"
      >
        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-bourbon to-neon-purple flex items-center justify-center text-sm font-bold text-white shrink-0">
            {(post.profiles as any)?.name?.charAt(0) ?? "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{(post.profiles as any)?.name ?? "Unknown"}</p>
            <p className="text-xs text-muted-foreground">{(post.profiles as any)?.title ?? ""}</p>
          </div>
        </div>

        {/* Content */}
        <p className="text-sm leading-relaxed whitespace-pre-line">{post.content}</p>

        {/* Hashtags */}
        {post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.hashtags.map((tag) => (
              <span key={tag} className="text-xs text-bourbon hover:text-bourbon-light cursor-pointer transition-colors">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Reactions bar */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-1">
            {(Object.entries(REACTION_EMOJI) as [ReactionType, string][]).map(([type, emoji]) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleReaction(type)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  currentReaction === type
                    ? "bg-bourbon/15 text-bourbon"
                    : "hover:bg-white/5"
                }`}
              >
                <span>{emoji}</span>
                <span className={currentReaction === type ? "text-bourbon" : "text-muted-foreground"}>
                  {reactionCounts[type]}
                </span>
              </motion.button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setCommentsOpen(true)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {commentCount}
            </motion.button>
            <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleBookmark}
              className="p-1.5 rounded-lg transition-colors"
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-bourbon text-bourbon" : "text-muted-foreground hover:text-foreground"}`} />
            </motion.button>
          </div>
        </div>
      </motion.article>
      <CommentsSheet
        postId={post.id}
        open={commentsOpen}
        onClose={() => {
          setCommentsOpen(false);
          // Refresh comment count
          getPosts().then((posts) => {
            const updated = posts.find((p) => p.id === post.id);
            if (updated) setCommentCount(updated.comment_count ?? 0);
          });
        }}
      />
    </>
  );
}

function TrendingWidget({ trending }: { trending: { tag: string; posts: number }[] }) {
  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <TrendingUp className="w-4 h-4 text-bourbon" />
        Trending on DrunkedIn
      </div>
      {trending.slice(0, 5).map((item) => (
        <div key={item.tag} className="flex items-center justify-between group cursor-pointer">
          <span className="text-sm text-bourbon hover:text-bourbon-light transition-colors">{item.tag}</span>
          <span className="text-xs text-muted-foreground">{(item.posts / 1000).toFixed(1)}K</span>
        </div>
      ))}
    </div>
  );
}

export default function FeedPage() {
  const { profile } = useAuth();
  const [feedPosts, setFeedPosts] = useState<PostWithAuthor[]>([]);
  const [trending, setTrending] = useState<{ tag: string; posts: number }[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFeed = () => {
    setLoading(true);
    Promise.all([
      getPosts().then(setFeedPosts),
      getTrendingHashtags().then(setTrending),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFeed();
  }, []);

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        <div className="flex gap-6">
          {/* Main feed */}
          <div className="flex-1 space-y-4">
            <div className="glass-card p-4">
              <CreatePostModal userName={profile?.name ?? "Connoisseur"} onPostCreated={loadFeed} />
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 rounded-full border-2 border-bourbon border-t-transparent animate-spin" />
              </div>
            ) : (
              feedPosts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))
            )}
          </div>

          {/* Sidebar widgets (desktop) */}
          <div className="hidden xl:flex flex-col gap-4 w-72 shrink-0">
            <TrendingWidget trending={trending} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
