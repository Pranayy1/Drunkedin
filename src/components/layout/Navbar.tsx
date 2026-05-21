"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Wine,
  Home,
  User,
  Users,
  Compass,
  MessageCircle,
  Trophy,
  Bot,
  Bell,
  Menu,
  X,
  LogOut,
  LogIn,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

const navLinks = [
  { href: "/feed", label: "Feed", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/rooms", label: "Rooms", icon: Users },
  { href: "/bartender", label: "BarGPT", icon: Bot },
  { href: "/network", label: "Network", icon: MessageCircle },
  { href: "/leaderboard", label: "Ranks", icon: Trophy },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? "??";

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div whileHover={{ rotate: 15 }} className="text-bourbon">
              <Wine className="w-7 h-7" />
            </motion.div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-bourbon">Drunk</span>
              <span className="text-foreground">edIn</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
                const Icon = link.icon;
                return (
                  <Link key={link.href} href={link.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "text-bourbon"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute inset-0 rounded-lg bg-bourbon/10 border border-bourbon/20"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-bourbon rounded-full animate-pulse-glow" />
                </motion.button>

                {/* Profile dropdown */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-bourbon to-bourbon-dark flex items-center justify-center text-xs font-bold text-white"
                  >
                    {initials}
                  </motion.button>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="absolute right-0 top-12 w-52 glass-card border border-white/10 p-2 space-y-1 z-50"
                    >
                      <div className="px-3 py-2 border-b border-white/5 mb-1">
                        <p className="text-sm font-semibold truncate">
                          {user.user_metadata?.full_name || "Connoisseur"}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                      >
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Sign In
                  </motion.button>
                </Link>
                <Link href="/auth/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-bourbon to-bourbon-dark text-white text-sm font-medium"
                  >
                    Join the Bar
                  </motion.button>
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            {user && (
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-muted-foreground"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Mobile nav overlay */}
      {mobileOpen && user && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-40 pt-16 bg-background/95 backdrop-blur-xl md:hidden"
        >
          <nav className="flex flex-col p-6 gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium transition-colors ${
                      isActive
                        ? "text-bourbon bg-bourbon/10 border border-bourbon/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </div>
                </Link>
              );
            })}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium text-red-400 hover:bg-red-500/10 transition-colors mt-4"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </nav>
        </motion.div>
      )}

      {/* Mobile bottom nav */}
      {user && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-white/5">
          <nav className="flex items-center justify-around h-16">
            {navLinks.slice(0, 5).map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href} className="flex flex-col items-center gap-1">
                  <Icon className={`w-5 h-5 ${isActive ? "text-bourbon" : "text-muted-foreground"}`} />
                  <span className={`text-[10px] ${isActive ? "text-bourbon" : "text-muted-foreground"}`}>
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
