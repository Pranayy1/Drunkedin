"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wine,
  Mail,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Check,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const drinkTitles = [
  "Senior Whiskey Architect",
  "Beer Stack Developer",
  "Certified Vodka Engineer",
  "RumOps Specialist",
  "Cocktail Product Manager",
  "Sake DevOps Lead",
  "Chief Brewing Officer",
  "Agave Solutions Architect",
  "Full Stack Bartender",
  "Wine Quality Assurance Lead",
  "Gin Infrastructure Engineer",
  "Tequila Sunrise Developer",
];

const drinkOptions = [
  { emoji: "🥃", label: "Whiskey" },
  { emoji: "🍺", label: "Beer" },
  { emoji: "🍷", label: "Wine" },
  { emoji: "🍸", label: "Cocktails" },
  { emoji: "🫗", label: "Vodka" },
  { emoji: "🥃", label: "Rum" },
  { emoji: "🫗", label: "Tequila" },
  { emoji: "🍸", label: "Gin" },
  { emoji: "🍶", label: "Sake" },
  { emoji: "🥂", label: "Champagne" },
];

const TOTAL_STEPS = 4;

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Basic info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2: Drink title
  const [drinkTitle, setDrinkTitle] = useState("");

  // Step 3: Favorite drinks
  const [favoriteDrinks, setFavoriteDrinks] = useState<string[]>([]);

  // Step 4: Tolerance
  const [tolerance, setTolerance] = useState(50);

  const toggleDrink = (drink: string) => {
    setFavoriteDrinks((prev) =>
      prev.includes(drink) ? prev.filter((d) => d !== drink) : [...prev, drink]
    );
  };

  const canProceed = () => {
    switch (step) {
      case 1: return name.trim() && email.trim() && password.length >= 6;
      case 2: return drinkTitle.trim();
      case 3: return favoriteDrinks.length >= 1;
      case 4: return true;
      default: return false;
    }
  };

  const handleSignup = async () => {
    setError("");
    setLoading(true);

    const supabase = createClient();

    // Create user
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          drink_title: drinkTitle,
          favorite_drinks: favoriteDrinks,
          tolerance_level: tolerance,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // If email confirmation is enabled, show success
    if (data.user && !data.session) {
      setStep(5);
      setLoading(false);
      return;
    }

    // Auto-logged in — store favorite drinks as beverages
    if (data.user) {
      const beverageInserts = favoriteDrinks.map((drink, i) => ({
        user_id: data.user!.id,
        name: drink,
        percentage: 100 - i * 15,
        icon: ["🥃", "🍺", "🍸", "🍷", "🫗", "🥂"][i % 6],
        sort_order: i,
      }));
      await supabase.from("beverages").insert(beverageInserts);
    }

    router.push("/feed");
    router.refresh();
  };

  const nextStep = () => {
    if (step === TOTAL_STEPS) {
      handleSignup();
    } else {
      setStep((s) => s + 1);
    }
  };

  const fillProgress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="glass-card p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-2">
              <Wine className="w-7 h-7 text-bourbon" />
              <span className="text-xl font-bold">
                <span className="text-bourbon">Drunk</span>edIn
              </span>
            </Link>
            {step <= TOTAL_STEPS && (
              <>
                <h1 className="text-2xl font-bold">Create Your Account</h1>
                <p className="text-sm text-muted-foreground">
                  Step {step} of {TOTAL_STEPS}
                </p>
              </>
            )}
          </div>

          {/* Progress bar — drink glass filling */}
          {step <= TOTAL_STEPS && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  animate={{ width: `${fillProgress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-bourbon to-amber"
                />
              </div>
              <span className="text-xs text-bourbon font-medium">{Math.round(fillProgress)}%</span>
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Steps */}
          <AnimatePresence mode="wait">
            {/* Step 1: Basic info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Barrel"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/8 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-bourbon/40 focus:ring-1 focus:ring-bourbon/20 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@drunkedin.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/8 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-bourbon/40 focus:ring-1 focus:ring-bourbon/20 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/8 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-bourbon/40 focus:ring-1 focus:ring-bourbon/20 transition-all"
                    />
                  </div>
                  {password.length > 0 && password.length < 6 && (
                    <p className="text-xs text-amber">Password must be at least 6 characters</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 2: Choose drink title */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <h2 className="text-lg font-semibold">Choose Your Drink Title</h2>
                  <p className="text-xs text-muted-foreground">This will be your professional identity</p>
                </div>
                <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1">
                  {drinkTitles.map((title) => (
                    <motion.button
                      key={title}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setDrinkTitle(title)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all ${
                        drinkTitle === title
                          ? "bg-bourbon/20 border border-bourbon/30 text-bourbon"
                          : "bg-white/5 border border-white/5 text-muted-foreground hover:bg-white/8 hover:text-foreground"
                      }`}
                    >
                      {drinkTitle === title && <Check className="inline w-4 h-4 mr-2" />}
                      {title}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Favorite drinks */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <h2 className="text-lg font-semibold">Select Your Specialties</h2>
                  <p className="text-xs text-muted-foreground">Pick at least one (we won&apos;t judge)</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {drinkOptions.map((drink) => {
                    const selected = favoriteDrinks.includes(drink.label);
                    return (
                      <motion.button
                        key={drink.label}
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggleDrink(drink.label)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          selected
                            ? "bg-bourbon/20 border border-bourbon/30 text-bourbon"
                            : "bg-white/5 border border-white/5 text-muted-foreground hover:bg-white/8"
                        }`}
                      >
                        <span className="text-xl">{drink.emoji}</span>
                        {drink.label}
                        {selected && <Check className="w-3.5 h-3.5 ml-auto" />}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 4: Tolerance level */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-lg font-semibold">Set Your Tolerance Level</h2>
                  <p className="text-xs text-muted-foreground">Be honest — we&apos;ll find out eventually</p>
                </div>
                <div className="space-y-6 px-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>🍼 Lightweight</span>
                    <span className="text-lg font-bold text-bourbon">{tolerance}%</span>
                    <span>🦾 Iron Liver</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={tolerance}
                    onChange={(e) => setTolerance(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10 accent-bourbon [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-bourbon [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(200,130,58,0.5)]"
                  />
                  <div className="relative h-3 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      animate={{ width: `${tolerance}%` }}
                      className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${
                        tolerance > 75 ? "from-red-500 to-amber-500" :
                        tolerance > 50 ? "from-amber-500 to-yellow-500" :
                        "from-green-500 to-emerald-500"
                      }`}
                    />
                  </div>
                  <p className="text-center text-sm text-muted-foreground italic">
                    {tolerance < 30
                      ? '"I get tipsy from the alcohol aisle at the grocery store."'
                      : tolerance < 60
                      ? '"A couple glasses in and I start networking aggressively."'
                      : tolerance < 85
                      ? '"I can out-drink most of my colleagues and still ship code."'
                      : '"I once used whiskey as coffee creamer and nobody noticed."'}
                  </p>
                </div>

                {/* Summary */}
                <div className="glass-card p-4 space-y-2">
                  <h3 className="text-sm font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber" /> Your Profile Summary
                  </h3>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong className="text-foreground">{name}</strong> — {drinkTitle}</p>
                    <p>Specialties: {favoriteDrinks.join(", ")}</p>
                    <p>Tolerance: {tolerance}%</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Success (email confirmation) */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4 py-6"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: 2 }}
                  className="text-6xl"
                >
                  🥂
                </motion.div>
                <h2 className="text-2xl font-bold">Welcome to the Bar!</h2>
                <p className="text-sm text-muted-foreground">
                  Check your email to verify your account, then you&apos;re in.
                </p>
                <Link href="/auth/login">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="px-6 py-2.5 rounded-xl bg-bourbon/10 text-bourbon font-medium text-sm border border-bourbon/20"
                  >
                    Go to Login
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          {step <= TOTAL_STEPS && (
            <div className="flex items-center gap-3 pt-2">
              {step > 1 && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep((s) => s - 1)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/8 text-sm font-medium flex items-center gap-2 hover:bg-white/8 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </motion.button>
              )}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={nextStep}
                disabled={!canProceed() || loading}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-bourbon to-bourbon-dark text-white font-semibold flex items-center justify-center gap-2 glow-bourbon disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : step === TOTAL_STEPS ? (
                  <>
                    Create Account
                    <Sparkles className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          )}

          {step <= TOTAL_STEPS && (
            <p className="text-center text-sm text-muted-foreground">
              Already a member?{" "}
              <Link href="/auth/login" className="text-bourbon hover:text-bourbon-light transition-colors font-medium">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
