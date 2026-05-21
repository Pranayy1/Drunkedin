"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, Wine, Zap, MessageCircle } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { getMessages, sendMessage as sendBartenderMessage } from "@/lib/services/bartender";
import type { BartenderMessageWithDrink } from "@/lib/services/bartender";

const quickActions = [
  { label: "Recommend a Drink", icon: Wine, color: "text-bourbon" },
  { label: "Pair with My Mood", icon: Sparkles, color: "text-neon-purple" },
  { label: "Corporate Quote", icon: MessageCircle, color: "text-neon-blue" },
  { label: "Roast My Tolerance", icon: Zap, color: "text-neon-pink" },
];

export default function BartenderPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<BartenderMessageWithDrink[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      getMessages(user.id).then((msgs) => {
        setMessages(msgs);
        setLoading(false);
      });
    }
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !user) return;
    const userMsg: BartenderMessageWithDrink = {
      id: `um-${Date.now()}`,
      user_id: user.id,
      role: "user",
      content: text,
      drink_suggestion_id: null,
      drink_suggestion: null,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    await sendBartenderMessage(user.id, text);

    // Reload messages from DB to get the bot response
    const updated = await getMessages(user.id);
    setMessages(updated);
    setTyping(false);
  };

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto p-4 lg:p-6 h-[calc(100vh-4rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-bourbon to-neon-purple flex items-center justify-center"
          >
            <Bot className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold">BarGPT</h1>
            <p className="text-xs text-muted-foreground">Your AI-powered bartender. Sarcasm included at no extra charge.</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neon-green/10 text-neon-green text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" /> Online
          </div>
        </div>

        {/* Chat area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-bourbon/20 border border-bourbon/20 text-foreground"
                    : "glass-card border border-white/5"
                }`}>
                  {msg.role === "bartender" && (
                    <div className="flex items-center gap-1.5 text-xs text-bourbon font-medium mb-1.5">
                      <Bot className="w-3 h-3" /> BarGPT
                    </div>
                  )}
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="glass-card border border-white/5 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-1.5 text-xs text-bourbon font-medium mb-1.5">
                  <Bot className="w-3 h-3" /> BarGPT
                </div>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      className="w-2 h-2 rounded-full bg-bourbon/50"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 mb-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => sendMessage(action.label)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-muted-foreground hover:text-foreground hover:bg-white/8 transition-all"
              >
                <Icon className={`w-3 h-3 ${action.color}`} />
                {action.label}
              </motion.button>
            );
          })}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask BarGPT anything about drinks..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-bourbon/30 focus:ring-1 focus:ring-bourbon/20 transition-all"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!input.trim() || typing}
            className="p-3 rounded-xl bg-gradient-to-r from-bourbon to-bourbon-dark text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </form>
      </div>
    </AppShell>
  );
}
