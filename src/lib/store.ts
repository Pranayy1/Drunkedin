"use client";
import { create } from "zustand";
import type { ReactionType } from "@/types";

interface AppState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  // Feed
  bookmarkedPosts: Set<string>;
  toggleBookmark: (postId: string) => void;
  postReactions: Record<string, Record<ReactionType, number>>;
  addReaction: (postId: string, type: ReactionType) => void;
  // Active room
  activeRoom: string | null;
  setActiveRoom: (roomId: string | null) => void;
  // Bartender
  bartenderInput: string;
  setBartenderInput: (v: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  bookmarkedPosts: new Set(),
  toggleBookmark: (postId) =>
    set((s) => {
      const next = new Set(s.bookmarkedPosts);
      next.has(postId) ? next.delete(postId) : next.add(postId);
      return { bookmarkedPosts: next };
    }),
  postReactions: {},
  addReaction: (postId, type) =>
    set((s) => {
      const prev = s.postReactions[postId] ?? { cheers: 0, smooth: 0, strong: 0, legendary: 0 };
      return { postReactions: { ...s.postReactions, [postId]: { ...prev, [type]: prev[type] + 1 } } };
    }),
  activeRoom: null,
  setActiveRoom: (roomId) => set({ activeRoom: roomId }),
  bartenderInput: "",
  setBartenderInput: (v) => set({ bartenderInput: v }),
}));
