"use client";

import { useState } from "react";
import { createPost } from "@/lib/services/feed";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ImageIcon, Hash, Loader2 } from "lucide-react";

export default function CreatePostModal({
  userName,
  onPostCreated,
}: {
  userName: string;
  onPostCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [hashtagInput, setHashtagInput] = useState("");
  const [posting, setPosting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || posting) return;
    setPosting(true);
    try {
      const hashtags = hashtagInput
        .split(/[\s,]+/)
        .map((h) => h.replace(/^#/, ""))
        .filter(Boolean);
      await createPost(content.trim(), hashtags);
      setContent("");
      setHashtagInput("");
      setOpen(false);
      onPostCreated();
    } catch (e) {
      console.error("Failed to create post", e);
    } finally {
      setPosting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-bourbon to-bourbon-dark flex items-center justify-center text-xs font-bold text-white">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 rounded-xl bg-white/5 border border-white/5 px-4 py-2.5 text-sm text-muted-foreground hover:bg-white/8 transition-colors">
            What&apos;s your latest pour, {userName.split(" ")[0]}?
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <div className="flex items-center gap-3">
            <Hash className="w-4 h-4 text-muted-foreground shrink-0" />
            <Input
              placeholder="Add hashtags (comma or space separated)"
              value={hashtagInput}
              onChange={(e) => setHashtagInput(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" disabled>
              <ImageIcon className="w-3.5 h-3.5 text-neon-blue" /> Photo
            </Button>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!content.trim() || posting}>
              {posting && <Loader2 className="w-4 h-4 animate-spin" />}
              Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
