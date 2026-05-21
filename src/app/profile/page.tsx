"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, Sparkles, Award, Wine, Star, Beer, Martini, GlassWater } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import AppShell from "@/components/layout/AppShell";
import { useAuth } from "@/components/providers/AuthProvider";
import { getBadges } from "@/lib/services/leaderboard";
import { useState, useEffect } from "react";
import type { BadgeRow } from "@/types/database";

const peakHours = [
  { hour: "6PM", value: 30 }, { hour: "7PM", value: 55 }, { hour: "8PM", value: 85 },
  { hour: "9PM", value: 100 }, { hour: "10PM", value: 90 }, { hour: "11PM", value: 70 },
  { hour: "12AM", value: 45 }, { hour: "1AM", value: 20 },
];

export default function ProfilePage() {
  const { profile: u } = useAuth();
  const [badges, setBadges] = useState<(BadgeRow & { earned: boolean; earned_date?: string })[]>([]);

  useEffect(() => {
    getBadges().then(setBadges);
  }, []);

  if (!u) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 rounded-full border-2 border-bourbon border-t-transparent animate-spin" />
        </div>
      </AppShell>
    );
  }
  const toleranceColor =
    u.tolerance_level > 75 ? "from-red-500 to-amber-500" :
    u.tolerance_level > 50 ? "from-amber-500 to-yellow-500" :
    "from-green-500 to-emerald-500";

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-6">
        {/* Banner + Avatar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
          <div className="h-40 sm:h-52 bg-gradient-to-r from-bourbon/30 via-neon-purple/20 to-bourbon/30 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-[#12121f] to-transparent" />
          </div>
          <div className="px-6 pb-6 -mt-14 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-bourbon to-bourbon-dark flex items-center justify-center text-3xl font-bold text-white border-4 border-[#12121f] shrink-0">
                AB
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold">{u.name}</h1>
                  {u.open_to_drink && (
                    <motion.span
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-neon-green/10 text-neon-green border border-neon-green/20"
                    >
                      🍺 Open to Drink
                    </motion.span>
                  )}
                </div>
                <p className="text-bourbon font-medium text-sm">{u.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{u.bio}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {u.location}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Joined {new Date(u.joined_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-5 py-2 rounded-xl bg-gradient-to-r from-bourbon to-bourbon-dark text-white font-medium text-sm">
                  🍻 Cheers
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-5 py-2 rounded-xl glass border border-white/10 text-sm font-medium">
                  Connect
                </motion.button>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/5">
              {[
                { value: u.cheers_received.toLocaleString(), label: "Cheers" },
                { value: u.drinking_buddies.toLocaleString(), label: "Buddies" },
                { value: u.drinks_reviewed.toLocaleString(), label: "Reviews" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-xl font-bold text-bourbon">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tolerance Meter */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <GlassWater className="w-5 h-5 text-bourbon" /> Tolerance Meter
              </h2>
              <div className="relative h-4 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${u.tolerance_level}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${toleranceColor}`}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Lightweight</span>
                <span className="text-bourbon font-semibold">{u.tolerance_level}%</span>
                <span>Iron Liver</span>
              </div>
            </motion.div>

            {/* Experience Timeline */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-bourbon" /> Drinking Career
              </h2>
              <div className="space-y-0">
                {(u as any).experience?.map((exp: any, i: number) => (
                  <div key={exp.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-xl bg-bourbon/10 flex items-center justify-center text-xl shrink-0">{exp.icon}</div>
                      {i < (u as any).experience?.length - 1 && <div className="w-px flex-1 bg-white/10 my-2" />}
                    </div>
                    <div className="pb-6">
                      <p className="text-sm font-semibold">{exp.title}</p>
                      <p className="text-xs text-bourbon">{exp.company}</p>
                      <p className="text-xs text-muted-foreground mb-1">{exp.period}</p>
                      <p className="text-xs text-muted-foreground">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Peak Performance Hours */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-bourbon" /> Peak Performance Hours
              </h2>
              <div className="flex items-end gap-2 h-32">
                {peakHours.map((h) => (
                  <div key={h.hour} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${h.value}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="w-full rounded-t-md bg-gradient-to-t from-bourbon to-amber"
                      style={{ minHeight: 4 }}
                    />
                    <span className="text-[10px] text-muted-foreground">{h.hour}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Top Beverages */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Wine className="w-5 h-5 text-bourbon" /> Top Beverages
              </h2>
              <div className="space-y-3">
                {((u as any).top_beverages ?? []).map((d: any) => (
                  <div key={d.id ?? d.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5">{d.icon} {d.name}</span>
                      <span className="text-muted-foreground">{d.percentage}%</span>
                    </div>
                    <Progress value={d.percentage} className="h-1.5 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-bourbon [&>div]:to-amber" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-bourbon" /> Achievements
              </h2>
              <div className="grid grid-cols-4 gap-2">
                {badges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    whileHover={{ scale: 1.1 }}
                    className={`aspect-square rounded-xl flex items-center justify-center text-2xl cursor-pointer transition-all rarity-${badge.rarity} border-2 ${
                      badge.earned ? "" : "opacity-30 grayscale"
                    }`}
                    style={{ background: "rgba(255,255,255,0.03)" }}
                    title={`${badge.name}: ${badge.description}`}
                  >
                    {badge.icon}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* XP Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber" /> Level {u.level}
                </span>
                <span className="text-xs text-bourbon font-medium">{u.xp.toLocaleString()} XP</span>
              </div>
              <Progress value={(u.xp / ((u.level + 1) * 600)) * 100} className="h-2 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-bourbon [&>div]:to-amber" />
              <p className="text-xs text-muted-foreground mt-2">
                {((u.level + 1) * 600 - u.xp).toLocaleString()} XP to Level {u.level + 1}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
