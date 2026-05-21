"use client";

import { useState, useEffect } from "react";
import { getComments, createComment } from "@/lib/services/feed";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageCircle } from "lucide-react";
import type { CommentWithAuthor } from "@/types/database";

export default function CommentsSheet({
  postId,
  open,
  onClose,
}: {
  postId: string;
  open: boolean;
  onClose: () => void;
}) {
  const { profile } = useAuth();
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getComments(postId).then((data) => {
      setComments(data);
      setLoading(false);
    });
  }, [postId, open]);

  const handleSubmit = async () => {
    if (!newComment.trim() || submitting) return;
    setSubmitting(true);
    try {
      await createComment(postId, newComment.trim());
      setNewComment("");
      const updated = await getComments(postId);
      setComments(updated);
    } catch (e) {
      console.error("Failed to add comment", e);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/10 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full sm:max-w-sm bg-popover border-l shadow-lg flex flex-col h-full animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span className="font-semibold text-sm">Comments</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-sm">
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">No comments yet. Be the first!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-bourbon to-neon-purple flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5">
                  {comment.profiles?.name?.charAt(0) ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">{comment.profiles?.name ?? "Unknown"}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-sm mt-0.5">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-white/5 p-4">
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-bourbon to-bourbon-dark flex items-center justify-center text-[10px] font-bold text-white shrink-0">
              {profile?.name?.charAt(0) ?? "?"}
            </div>
            <div className="flex-1 flex gap-2">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={1}
                className="min-h-0 text-sm resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <Button size="sm" onClick={handleSubmit} disabled={!newComment.trim() || submitting}>
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Send"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
