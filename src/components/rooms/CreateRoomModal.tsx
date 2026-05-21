"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createRoom } from "@/lib/services/rooms";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus } from "lucide-react";

export default function CreateRoomModal({
  onRoomCreated,
}: {
  onRoomCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [theme, setTheme] = useState("");
  const [description, setDescription] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [tagsInput, setTagsInput] = useState("");
  const [music, setMusic] = useState("");
  const [creating, setCreating] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || creating) return;
    setCreating(true);
    try {
      const tags = tagsInput
        .split(/[\s,]+/)
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
      await createRoom({
        name: name.trim(),
        theme: theme.trim(),
        description: description.trim(),
        maxParticipants,
        tags,
        music: music.trim(),
      });
      setName("");
      setTheme("");
      setDescription("");
      setTagsInput("");
      setMusic("");
      setMaxParticipants(10);
      setOpen(false);
      onRoomCreated();
    } catch (e) {
      console.error("Failed to create room", e);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-bourbon to-bourbon-dark text-white font-medium text-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Room
        </motion.button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a room</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium">Room name *</label>
            <Input
              placeholder="e.g. Friday Night Whiskey Club"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium">Theme</label>
            <Input
              placeholder="e.g. Bourbon Tasting"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium">Description</label>
            <Textarea
              placeholder="What's the vibe?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Max participants</label>
              <Input
                type="number"
                min={2}
                max={100}
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Music genre</label>
              <Input
                placeholder="e.g. Jazz, Lo-Fi"
                value={music}
                onChange={(e) => setMusic(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium">Tags</label>
            <Input
              placeholder="whisky, tasting, friday"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!name.trim() || creating}>
              {creating && <Loader2 className="w-4 h-4 animate-spin" />}
              Create Room
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
