"use client";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen pt-16">
        <Sidebar />
        <main className="flex-1 lg:ml-64 pb-20 md:pb-8">
          {children}
        </main>
      </div>
    </>
  );
}
