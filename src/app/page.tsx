"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Wine,
  Users,
  Star,
  Bot,
  Trophy,
  Compass,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { testimonials } from "@/lib/mock-data";

const features = [
  { icon: Wine, title: "Drink Portfolio", description: "Curate your professional drinking resume. Log tastings, rate spirits, build credibility." },
  { icon: Users, title: "Drinking Buddies", description: "Network with fellow connoisseurs. Find your perfect drinking partner based on taste compatibility." },
  { icon: Star, title: "Cheers & Endorsements", description: "Give and receive Cheers for drink recommendations. Build your reputation one sip at a time." },
  { icon: Bot, title: "BarGPT Assistant", description: "AI-powered bartender that recommends drinks, roasts your taste, and generates corporate drinking quotes." },
  { icon: Trophy, title: "Gamification", description: "Earn XP, unlock badges, climb the leaderboard. From 'Casual Sipper' to 'Legendary Sommelier'." },
  { icon: Compass, title: "Trending Drinks", description: "Discover what's trending in the drinking world. Real-time charts, regional heatmaps, taste analytics." },
];

const stats = [
  { value: "500K+", label: "Drinking Buddies" },
  { value: "1M+", label: "Cheers Given" },
  { value: "50K+", label: "Drinks Reviewed" },
  { value: "10K+", label: "Rooms Created" },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

export default function LandingPage() {
  return (
    <div className="relative">
      {/* ====== HERO ====== */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Floating glasses decoration */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {["🥃", "🍸", "🍷", "🍺", "🥂"].map((emoji, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-10"
              style={{
                left: `${15 + i * 18}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-bourbon/20 text-bourbon text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            The #1 Professional Network for Liquor Enthusiasts
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6"
          >
            <span className="text-foreground">Network.</span>
            <br />
            <span className="text-bourbon text-glow-bourbon">Sip.</span>
            <br />
            <span className="text-foreground">Repeat.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Where Whiskey Architects meet Beer Stack Developers. Build your drinking career, earn Cheers, and connect with 500K+ professionals who take their spirits{" "}
            <span className="text-bourbon italic">very</span> seriously.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/feed">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-bourbon to-bourbon-dark text-white font-semibold text-lg flex items-center gap-2 glow-bourbon"
              >
                Join the Bar
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link href="/explore">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 rounded-xl glass border border-white/10 text-foreground font-semibold text-lg flex items-center gap-2 hover:border-bourbon/30 transition-colors"
              >
                Explore Drinks
                <Compass className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ====== FEATURES ====== */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to{" "}
              <span className="text-bourbon">level up</span> your drinking career
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From building your drink portfolio to networking with industry leaders.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={fadeUp}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  className="glass-card p-6 glass-hover cursor-pointer group transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-bourbon/10 flex items-center justify-center mb-4 group-hover:bg-bourbon/20 transition-colors">
                    <Icon className="w-6 h-6 text-bourbon" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ====== STATS ====== */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card p-8 sm:p-12"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl sm:text-4xl font-bold text-bourbon mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What our <span className="text-bourbon">members</span> say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card p-6 flex flex-col"
              >
                <div className="flex mb-2">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber fill-amber" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic flex-1 mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-bourbon to-neon-purple flex items-center justify-center text-xs font-bold text-white">
                    {t.author.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.author.name}</p>
                    <p className="text-xs text-muted-foreground">{t.author.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass-card p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-bourbon/5 via-neon-purple/5 to-bourbon/5 pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 relative z-10">
            Ready to pour your first connection?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 relative z-10">
            Join 500,000+ professionals who network with a glass in hand.
          </p>
          <Link href="/feed">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-bourbon to-bourbon-dark text-white font-semibold text-lg flex items-center gap-2 mx-auto glow-bourbon relative z-10"
            >
              Get Started — It&apos;s Free
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="border-t border-white/5 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Wine className="w-5 h-5 text-bourbon" />
            <span className="font-bold">
              <span className="text-bourbon">Drunk</span>edIn
            </span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Network. Sip. Repeat. — &copy; {new Date().getFullYear()} DrunkedIn. All rights reserved. Drink responsibly.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="hover:text-foreground cursor-pointer transition-colors">About</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
