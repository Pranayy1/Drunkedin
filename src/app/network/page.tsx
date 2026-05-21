"use client";

import { motion } from "framer-motion";
import { UserPlus, Users, Search, Percent, Wine } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { useState, useEffect } from "react";
import { getConnectionSuggestions, sendConnectionRequest, getGroups, joinGroup, leaveGroup } from "@/lib/services/network";
import type { ConnectionSuggestion } from "@/lib/services/network";
import type { DrinkingGroupRow } from "@/types/database";

export default function NetworkPage() {
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());
  const [suggestions, setSuggestions] = useState<ConnectionSuggestion[]>([]);
  const [drinkingGroups, setDrinkingGroups] = useState<(DrinkingGroupRow & { isJoined: boolean })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getConnectionSuggestions().then(setSuggestions),
      getGroups().then(setDrinkingGroups),
    ]).finally(() => setLoading(false));
  }, []);

  const handleInvite = async (userId: string) => {
    await sendConnectionRequest(userId);
    setConnectedIds((prev) => new Set(prev).add(userId));
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 rounded-full border-2 border-bourbon border-t-transparent animate-spin" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto p-4 lg:p-6 space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Network</h1>
          <p className="text-sm text-muted-foreground">Find your next Drinking Buddy</p>
        </div>

        {/* Connection Suggestions */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-bourbon" /> People You May Want to Drink With
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((cs, i) => {
              const connected = connectedIds.has(cs.user.id);
              return (
                <motion.div
                  key={cs.user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -3 }}
                  className="glass-card p-5 space-y-4 glass-hover transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-bourbon to-neon-purple flex items-center justify-center text-lg font-bold text-white shrink-0">
                      {cs.user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{cs.user.name}</p>
                      <p className="text-xs text-bourbon truncate">{cs.user.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {cs.mutualBuddies} mutual
                    </span>
                    <span className="flex items-center gap-1">
                      <Percent className="w-3 h-3 text-neon-green" />
                      <span className="text-neon-green font-medium">{cs.compatibility}%</span> match
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground italic">&ldquo;{cs.reason}&rdquo;</p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleInvite(cs.user.id)}
                    className={`w-full py-2 rounded-xl text-sm font-medium transition-all ${
                      connected
                        ? "bg-neon-green/10 text-neon-green border border-neon-green/20"
                        : "bg-bourbon/10 text-bourbon border border-bourbon/20 hover:bg-bourbon hover:text-white"
                    }`}
                  >
                    {connected ? "🍻 Buddies!" : "🥂 Invite for a Drink"}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Groups */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Wine className="w-5 h-5 text-bourbon" /> Drinking Clubs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {drinkingGroups.map((group, i) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 + 0.3 }}
                className="glass-card p-4 space-y-3 glass-hover transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">
                    {group.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{group.name}</p>
                    <p className="text-xs text-muted-foreground">{group.member_count.toLocaleString()} members</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{group.description}</p>
                <button
                  onClick={async () => {
                    if (group.isJoined) {
                      await leaveGroup(group.id);
                      setDrinkingGroups((prev) => prev.map((g) => g.id === group.id ? { ...g, isJoined: false } : g));
                    } else {
                      await joinGroup(group.id);
                      setDrinkingGroups((prev) => prev.map((g) => g.id === group.id ? { ...g, isJoined: true } : g));
                    }
                  }}
                  className={`w-full py-1.5 rounded-lg text-xs font-medium transition-all ${
                    group.isJoined
                      ? "bg-white/5 text-muted-foreground"
                      : "bg-bourbon/10 text-bourbon border border-bourbon/20 hover:bg-bourbon hover:text-white"
                  }`}
                >
                  {group.isJoined ? "Joined ✓" : "Join Club"}
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
