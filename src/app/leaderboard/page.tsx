"use client";

import { motion } from "framer-motion";
import { Trophy, TrendingUp, TrendingDown, Minus, Crown, Medal, Star } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { useState, useEffect } from "react";
import { getLeaderboard, getBadges } from "@/lib/services/leaderboard";
import type { LeaderboardEntry } from "@/lib/services/leaderboard";
import type { BadgeRow } from "@/types/database";

const podiumData = [
  { label: "2nd", initialOffset: "mt-2 sm:mt-4", icon: "🥈", bg: "from-gray-400/20 to-gray-500/10", border: "border-gray-500/30", color: "text-gray-300" },
  { label: "1st", initialOffset: "-mt-2 sm:-mt-4", icon: "👑", bg: "from-amber-400/20 to-amber-600/10", border: "border-amber-500/40", color: "text-amber-400" },
  { label: "3rd", initialOffset: "mt-2 sm:mt-4", icon: "🥉", bg: "from-amber-700/20 to-amber-800/10", border: "border-amber-700/30", color: "text-amber-700" },
];

const rarityConfig: Record<string, { ring: string; bg: string; label: string }> = {
  common:    { ring: "ring-gray-600/40",  bg: "bg-gray-500/10", label: "text-gray-400" },
  rare:      { ring: "ring-blue-500/40",   bg: "bg-blue-500/10", label: "text-blue-400" },
  epic:      { ring: "ring-purple-500/40", bg: "bg-purple-500/10", label: "text-purple-400" },
  legendary: { ring: "ring-amber-500/40",  bg: "bg-amber-500/10", label: "text-amber-400" },
};

function AvatarLetter({ name, size = "md", className = "" }: { name: string; size?: "sm" | "md" | "lg"; className?: string }) {
  const sizes = { sm: "w-7 h-7 text-[10px]", md: "w-9 h-9 text-xs", lg: "w-14 h-14 text-xl" };
  return (
    <div className={`${sizes[size]} rounded-full bg-bourbon/20 border border-bourbon/20 flex items-center justify-center font-bold text-bourbon shrink-0 ${className}`}>
      {name?.charAt(0).toUpperCase() || "?"}
    </div>
  );
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [badges, setBadges] = useState<(BadgeRow & { earned: boolean; earned_date?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getLeaderboard().then(setLeaderboard),
      getBadges().then(setBadges),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-24">
          <div className="w-5 h-5 rounded-full border-2 border-bourbon border-t-transparent animate-spin" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-bourbon/10 border border-bourbon/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-bourbon" />
            </span>
            Leaderboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1 ml-12">The most distinguished drinking professionals</p>
        </motion.div>

        {/* Podium */}
        {leaderboard.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-3 sm:gap-4 items-end"
          >
            {[1, 0, 2].map((idx) => {
              const entry = leaderboard[idx];
              if (!entry) return null;
              const pd = podiumData[idx];
              return (
                <div key={entry.user.id} className={`flex flex-col items-center gap-3 ${pd.initialOffset}`}>
                  <span className="text-2xl">{idx === 0 ? "👑" : pd.icon}</span>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pd.bg} border-2 ${pd.border} flex items-center justify-center text-2xl font-bold ${pd.color}`}>
                    {entry.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">{entry.user.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate max-w-24">{entry.user.title}</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-lg font-bold ${pd.color}`}>{entry.xp.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">Level {entry.level}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Rankings table */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
          <div className="grid grid-cols-[3rem_1fr_5rem_3rem] sm:grid-cols-[4rem_1fr_6rem_4rem] gap-2 px-4 py-3 text-[11px] font-semibold text-muted-foreground border-b border-white/[0.06]">
            <span>Rank</span>
            <span>Member</span>
            <span className="text-right">XP</span>
            <span className="text-right">Lv</span>
          </div>
          {leaderboard.length > 0 ? leaderboard.map((entry, i) => (
            <div
              key={entry.user.id}
              className={`grid grid-cols-[3rem_1fr_5rem_3rem] sm:grid-cols-[4rem_1fr_6rem_4rem] gap-2 px-4 py-2.5 items-center border-b border-white/[0.03] last:border-0 transition-colors hover:bg-white/[0.02] ${
                i % 2 === 0 ? "bg-transparent" : "bg-white/[0.015]"
              }`}
            >
              <span className={`text-sm font-bold tabular-nums ${i < 3 ? podiumData[i].color : "text-muted-foreground"}`}>
                #{entry.rank}
              </span>
              <div className="flex items-center gap-2.5 min-w-0">
                <AvatarLetter name={entry.user.name} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{entry.user.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{entry.user.title}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-bourbon text-right tabular-nums">{entry.xp.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground text-right tabular-nums">{entry.level}</span>
            </div>
          )) : (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              <Star className="w-8 h-8 mx-auto mb-2 opacity-30" />
              No rankings yet. Be the first to earn XP!
            </div>
          )}
        </div>

        {/* Badges */}
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-5">
            <span className="w-7 h-7 rounded-lg bg-bourbon/10 border border-bourbon/20 flex items-center justify-center">
              <Medal className="w-4 h-4 text-bourbon" />
            </span>
            Badges
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {badges.map((badge, i) => {
              const cfg = rarityConfig[badge.rarity] || rarityConfig.common;
              return (
                <div
                  key={badge.id}
                  className={`rounded-xl p-4 text-center space-y-2.5 border transition-all duration-200 ${
                    badge.earned
                      ? `bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]`
                      : "bg-white/[0.01] border-white/[0.03] opacity-40 grayscale"
                  }`}
                >
                  <div className={`text-3xl ${badge.earned ? "" : "grayscale"}`}>{badge.icon}</div>
                  <div>
                    <p className="text-xs font-semibold">{badge.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{badge.description}</p>
                  </div>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-medium ${cfg.bg} ${cfg.label}`}>
                    {badge.rarity}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
