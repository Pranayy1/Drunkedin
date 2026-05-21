"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  Users,
  Compass,
  Bot,
  Trophy,
  MessageCircle,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/components/providers/AuthProvider";

const sidebarLinks = [
  { href: "/feed", label: "Feed", icon: Home },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/rooms", label: "Rooms", icon: Users },
  { href: "/bartender", label: "BarGPT", icon: Bot },
  { href: "/network", label: "Network", icon: MessageCircle },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { profile } = useAuth();

  if (!profile) return null;

  const xpForNextLevel = (profile.level + 1) * 600;
  const xpProgress = (profile.xp / xpForNextLevel) * 100;

  return (
    <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-16 bottom-0 glass border-r border-white/5 p-4 gap-4 overflow-y-auto">
      {/* Mini profile card */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-bourbon to-bourbon-dark flex items-center justify-center text-sm font-bold text-white">
            {profile.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{profile.name}</p>
            <p className="text-xs text-muted-foreground truncate">{profile.title}</p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber" /> Level {profile.level}
            </span>
            <span className="text-bourbon font-medium">{profile.xp} XP</span>
          </div>
          <Progress value={xpProgress} className="h-1.5 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-bourbon [&>div]:to-amber" />
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 flex flex-col gap-0.5">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-bourbon bg-bourbon/10 border border-bourbon/15 glow-bourbon"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
                style={isActive ? { boxShadow: "0 0 10px rgba(200,130,58,0.1)" } : {}}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Online buddies */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <TrendingUp className="w-3 h-3" />
          ONLINE BUDDIES
        </div>
        {[
          { name: "Maya Hops", status: "Brewing" },
          { name: "Viktor Stoli", status: "In a Room" },
          { name: "Sakura Sake", status: "Idle" },
        ].map((buddy) => (
          <div key={buddy.name} className="flex items-center gap-2">
            <div className="relative">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center text-[9px] font-bold text-white">
                {buddy.name.charAt(0)}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-neon-green rounded-full border border-background" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{buddy.name}</p>
              <p className="text-[10px] text-muted-foreground">{buddy.status}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
