"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Wine, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { useState, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/feed";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  const handleOAuth = async (provider: "google" | "github") => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
      },
    });
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="whiskey.architect@drunkedin.com"
            required
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/8 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-bourbon/40 focus:ring-1 focus:ring-bourbon/20 transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full pl-10 pr-11 py-3 rounded-xl bg-white/5 border border-white/8 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-bourbon/40 focus:ring-1 focus:ring-bourbon/20 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 accent-bourbon" />
          <span className="text-muted-foreground">Remember me</span>
        </label>
        <span className="text-bourbon hover:text-bourbon-light cursor-pointer transition-colors">
          Forgot your drink order?
        </span>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-bourbon to-bourbon-dark text-white font-semibold flex items-center justify-center gap-2 glow-bourbon disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            Enter the Lounge
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </motion.button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-xs text-muted-foreground">or continue with</span>
        <div className="flex-1 h-px bg-white/8" />
      </div>

      {/* Social login */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOAuth("google")}
          className="py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm font-medium hover:bg-white/8 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOAuth("github")}
          className="py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm font-medium hover:bg-white/8 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          GitHub
        </motion.button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        New to the bar?{" "}
        <Link href="/auth/signup" className="text-bourbon hover:text-bourbon-light transition-colors font-medium">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left: ambient animation */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bourbon/10 via-transparent to-neon-purple/10" />
        {/* Floating emojis */}
        {["🥃", "🍸", "🍷", "🍺", "🥂", "🫗", "🍹"].map((emoji, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl"
            style={{
              left: `${10 + (i * 12) % 80}%`,
              top: `${15 + (i * 17) % 70}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 15, -15, 0],
              opacity: [0.08, 0.15, 0.08],
            }}
            transition={{ duration: 5 + i * 0.7, repeat: Infinity, ease: "easeInOut" }}
          >
            {emoji}
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10 px-8"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Wine className="w-12 h-12 text-bourbon" />
            <span className="text-4xl font-bold">
              <span className="text-bourbon">Drunk</span>edIn
            </span>
          </div>
          <p className="text-2xl font-light text-muted-foreground max-w-md">
            Where professionals come to network,<br />
            one <span className="text-bourbon italic">pour</span> at a time.
          </p>
        </motion.div>
      </div>

      {/* Right: login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
                <Wine className="w-7 h-7 text-bourbon" />
                <span className="text-xl font-bold">
                  <span className="text-bourbon">Drunk</span>edIn
                </span>
              </div>
              <h1 className="text-2xl font-bold">Welcome Back, Connoisseur</h1>
              <p className="text-sm text-muted-foreground">
                Sign in to resume your drinking career
              </p>
            </div>

            <Suspense fallback={<div className="h-80 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-bourbon" /></div>}>
              <LoginForm />
            </Suspense>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
