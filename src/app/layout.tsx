import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { AuthProvider } from "@/components/providers/AuthProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DrunkedIn — Professional Networking for Liquor Enthusiasts",
  description:
    "The premium professional networking platform for bartenders, brewers, mixologists, and corporate drinkers. Network. Sip. Repeat.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} dark h-full antialiased`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col bg-[#0a0a0f] text-[#f0f0f5]">
        {/* Ambient background orbs */}
        <div className="ambient-bg" aria-hidden>
          <div className="ambient-orb" style={{ width: 600, height: 600, top: "-10%", left: "-5%", background: "radial-gradient(circle, #C8823A, transparent)" }} />
          <div className="ambient-orb" style={{ width: 500, height: 500, bottom: "10%", right: "-5%", background: "radial-gradient(circle, #A855F7, transparent)" }} />
          <div className="ambient-orb" style={{ width: 400, height: 400, top: "40%", left: "30%", background: "radial-gradient(circle, #8B2252, transparent)", opacity: 0.08 }} />
        </div>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
