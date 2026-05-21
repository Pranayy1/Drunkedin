"use client";

import { motion } from "framer-motion";
import { Users, Music, Clock, Radio, LogOut } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { useState, useEffect } from "react";
import { getRooms, joinRoom, leaveRoom, getUserRoomIds } from "@/lib/services/rooms";
import type { RoomWithParticipants } from "@/types/database";
import CreateRoomModal from "@/components/rooms/CreateRoomModal";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<RoomWithParticipants[]>([]);
  const [joinedRoomIds, setJoinedRoomIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const loadRooms = async () => {
    setLoading(true);
    const [roomsData, joinedIds] = await Promise.all([
      getRooms(),
      getUserRoomIds(),
    ]);
    setRooms(roomsData);
    setJoinedRoomIds(joinedIds);
    setLoading(false);
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleJoin = async (roomId: string) => {
    await joinRoom(roomId);
    setJoinedRoomIds((prev) => new Set(prev).add(roomId));
    loadRooms();
  };

  const handleLeave = async (roomId: string) => {
    await leaveRoom(roomId);
    setJoinedRoomIds((prev) => {
      const next = new Set(prev);
      next.delete(roomId);
      return next;
    });
    loadRooms();
  };

  const liveRooms = rooms.filter((r) => r.is_live);
  const scheduled = rooms.filter((r) => !r.is_live);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto p-4 lg:p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Drink Together</h1>
            <p className="text-sm text-muted-foreground">Join a room or create your own virtual bar</p>
          </div>
          <CreateRoomModal onRoomCreated={loadRooms} />
        </div>

        {/* Live Rooms */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-lg font-semibold">Live Now</h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 rounded-full border-2 border-bourbon border-t-transparent animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveRooms.map((room, i) => {
                const isJoined = joinedRoomIds.has(room.id);
                return (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -3 }}
                    className="glass-card p-5 space-y-4 glass-hover transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{room.name}</h3>
                        <p className="text-xs text-bourbon">{room.theme}</p>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-medium">
                        <Radio className="w-3 h-3 animate-pulse" /> LIVE
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{room.description}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" /> {room.participants.length}/{room.max_participants}
                      </span>
                      {room.music && (
                        <span className="flex items-center gap-1">
                          <Music className="w-3.5 h-3.5" /> {room.music}
                        </span>
                      )}
                    </div>
                    {/* Participant avatars */}
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {room.participants.slice(0, 4).map((p: any, j: number) => (
                          <div key={p.id} className="w-7 h-7 rounded-full bg-gradient-to-br from-bourbon to-neon-purple flex items-center justify-center text-[10px] font-bold text-white border-2 border-[#12121f]">
                            {p.name?.charAt(0) ?? "?"}
                          </div>
                        ))}
                        {room.participants.length > 4 && (
                          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-muted-foreground border-2 border-[#12121f]">
                            +{room.participants.length - 4}
                          </div>
                        )}
                      </div>
                      {isJoined ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleLeave(room.id)}
                          className="px-4 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center gap-1.5"
                        >
                          <LogOut className="w-3 h-3" /> Leave
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleJoin(room.id)}
                          className="px-4 py-1.5 rounded-lg bg-bourbon/10 text-bourbon text-xs font-medium border border-bourbon/20 group-hover:bg-bourbon group-hover:text-white transition-all"
                        >
                          Join Room
                        </motion.button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {room.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-muted-foreground">{tag}</span>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* Scheduled */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Upcoming</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduled.map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="glass-card p-4 space-y-3 glass-hover transition-all duration-300"
              >
                <h3 className="font-semibold">{room.name}</h3>
                <p className="text-xs text-bourbon">{room.theme}</p>
                <p className="text-xs text-muted-foreground">{room.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {room.scheduled_time ? new Date(room.scheduled_time).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric" }) : "TBD"}
                  </span>
                  <button className="px-3 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/10 transition-colors">
                    Remind Me
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
