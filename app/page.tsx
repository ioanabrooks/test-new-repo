"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";

const Icon = ({
  children,
  className = "h-4 w-4",
}: {
  children: React.ReactNode;
  className: string;
}) => (
  <span
    className={`inline-flex items-center justify-center ${className}`}
    aria-hidden="true">
    {children}
  </span>
);

const Rocket = ({ className }: { className: string }) => (
  <Icon className={className}>🚀</Icon>
);
const Sparkles = ({ className }: { className: string }) => (
  <Icon className={className}>✨</Icon>
);
const Trash2 = ({ className }: { className: string }) => (
  <Icon className={className}>×</Icon>
);
const Plus = ({ className }: { className: string }) => (
  <Icon className={className}>+</Icon>
);
const RotateCcw = ({ className }: { className: string }) => (
  <Icon className={className}>↺</Icon>
);
const Trophy = ({ className }: { className: string }) => (
  <Icon className={className}>🏆</Icon>
);
const Shuffle = ({ className }: { className: string }) => (
  <Icon className={className}>⇄</Icon>
);

const STORAGE_KEY = "standup-picker-members-v1";

const DEFAULT_MEMBERS = [
  "Akhil",
  "Likhita",
  "Yixin",
  "Michael",
  "Minghui",
  "Sasha",
];

const FUNNY_PROMPTS = [
  "Scanning the deploy queue...",
  "Checking who has the cleanest diff...",
  "Routing standup traffic...",
  "Running the totally scientific selector...",
  "Looking for one brave update owner...",
  "Asking the build logs for guidance...",
  "Clearing someone for standup...",
];

const BADGES = [
  "Bug Whisperer",
  "Merge Captain",
  "Ticket Tamer",
  "Sprint Goblin",
  "PR Paladin",
  "Deploy Mage",
  "Standup Hero",
];

function getInitialMembers() {
  if (typeof window === "undefined") {
    return DEFAULT_MEMBERS;
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : null;
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_MEMBERS;
  } catch {
    return DEFAULT_MEMBERS;
  }
}

function pickRandomIndex(length: number, avoidIndex = -1) {
  if (length <= 1) return 0;
  let next = Math.floor(Math.random() * length);
  while (next === avoidIndex) {
    next = Math.floor(Math.random() * length);
  }
  return next;
}

export default function StandupPicker() {
  const [members, setMembers] = useState(getInitialMembers);
  const [newMember, setNewMember] = useState("");
  const [winnerIndex, setWinnerIndex] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPicking, setIsPicking] = useState(false);
  const [prompt, setPrompt] = useState(FUNNY_PROMPTS[0]);
  const [history, setHistory] = useState([]);
  const tickerRef = useRef<number>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    }
  }, [members]);

  useEffect(() => {
    return () => {
      if (tickerRef.current) {
        window.clearInterval(tickerRef.current);
      }
    };
  }, []);

  const winner = winnerIndex === null ? null : members[winnerIndex];

  const launchQueue = useMemo(() => {
    return members.map((name, index) => ({
      name,
      index,
      badge: BADGES[index % BADGES.length],
    }));
  }, [members]);

  const addMember = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const trimmed = newMember.trim();
    if (!trimmed) return;

    const alreadyExists = members.some(
      (member) => member.toLowerCase() === trimmed.toLowerCase(),
    );
    if (alreadyExists) {
      setNewMember("");
      return;
    }

    setMembers((current) => [...current, trimmed]);
    setNewMember("");
  };

  const removeMember = (memberToRemove: unknown) => {
    setMembers((current) =>
      current.filter((member) => member !== memberToRemove),
    );
    setHistory((current) =>
      current.filter((member) => member !== memberToRemove),
    );
    setWinnerIndex(0);
    setActiveIndex(0);
  };

  const resetMembers = () => {
    setMembers(DEFAULT_MEMBERS);
    setWinnerIndex(0);
    setHistory([]);
    setActiveIndex(0);
  };

  const pickMember = () => {
    if (members.length === 0 || isPicking) return;

    setIsPicking(true);
    setWinnerIndex(0);
    setPrompt(FUNNY_PROMPTS[Math.floor(Math.random() * FUNNY_PROMPTS.length)]);

    const nextWinnerIndex = pickRandomIndex(members.length, winnerIndex ?? -1);
    let ticks = 0;
    const maxTicks = 28 + Math.floor(Math.random() * 16);

    if (tickerRef.current) {
      window.clearInterval(tickerRef.current);
    }
    tickerRef.current = window.setInterval(() => {
      ticks += 1;
      setActiveIndex((current) => (current + 1) % members.length);

      if (ticks >= maxTicks) {
        if (tickerRef.current) {
          window.clearInterval(tickerRef.current);
        }
        setActiveIndex(nextWinnerIndex);
        setWinnerIndex(nextWinnerIndex);
        // setHistory((current) =>
        //   [
        //     members[nextWinnerIndex],
        //     ...current.filter((item) => item !== members[nextWinnerIndex]),
        //   ].slice(0, 6),
        // );
        setIsPicking(false);
      }
    }, 90);
  };

  const randomizeOrder = () => {
    setMembers((current) => [...current].sort(() => Math.random() - 0.5));
    setWinnerIndex(0);
    setActiveIndex(0);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.28),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(168,85,247,0.28),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(34,197,94,0.18),transparent_35%)]" />
      <div className="relative mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 md:grid-cols-[360px_1fr] md:px-8 lg:px-10">
        <Card className="h-fit border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl">
          <CardContent className="space-y-5 p-5">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-cyan-200">
                <Rocket className="h-4 w-4" />
                Scrum master cockpit
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Standup Launch Picker
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                A mission-control style picker for deciding who gives the first
                update, without making standup feel like a casino game.
              </p>
            </div>

            <form className="flex gap-2" onSubmit={addMember}>
              <Input
                value={newMember}
                onChange={(event) => setNewMember(event.target.value)}
                placeholder="Add teammate"
                className="border-white/10 bg-white/10 text-white placeholder:text-slate-400"
              />
              <Button
                type="submit"
                className="gap-2 bg-cyan-400 text-slate-950 hover:bg-cyan-300">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </form>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Team queue</span>
                {/* <Badge
                  variant="secondary"
                  className="bg-white/10 text-slate-200 hover:bg-white/10">
                  {members.length} members
                </Badge> */}
              </div>

              <div className="max-h-[340px] space-y-2 overflow-auto pr-1">
                <AnimatePresence initial={false}>
                  {members.map((member, index) => (
                    <motion.div
                      key={member}
                      layout
                      initial={{ opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 18 }}
                      className={`flex items-center justify-between rounded-2xl border px-3 py-2 transition ${
                        index === activeIndex
                          ? "border-cyan-300/60 bg-cyan-300/15 shadow-lg shadow-cyan-950/40"
                          : "border-white/10 bg-white/5"
                      }`}>
                      <div>
                        <div className="font-medium text-white">{member}</div>
                        <div className="text-xs text-slate-400">
                          {BADGES[index % BADGES.length]}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMember(member)}
                        className="text-slate-400 hover:bg-red-500/15 hover:text-red-200"
                        aria-label={`Remove ${member}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={randomizeOrder}
                className="gap-2 bg-white/10 text-white hover:bg-white/15">
                <Shuffle className="h-4 w-4" />
                Shuffle
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={resetMembers}
                className="gap-2 bg-white/10 text-white hover:bg-white/15">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <main className="grid content-center gap-6">
          <section className="relative rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-fuchsia-200">
                  <Sparkles className="h-4 w-4" />
                  {isPicking ? prompt : "Ready for launch Rev2"}
                </div>
                <h2 className="mt-2 text-2xl font-bold text-white sm:text-4xl">
                  Who goes first?
                </h2>
              </div>
              <Button
                type="button"
                onClick={pickMember}
                disabled={members.length === 0 || isPicking}
                className="h-12 rounded-2xl bg-fuchsia-400 px-6 text-base font-bold text-slate-950 shadow-lg shadow-fuchsia-950/40 hover:bg-fuchsia-300 disabled:opacity-50">
                {isPicking ? "Scanning..." : "Pick first speaker"}
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {winner ? (
                <motion.section
                  key={winner}
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -18, scale: 0.98 }}
                  className="rounded-[2rem] border border-amber-200/30 bg-amber-200 p-5 text-slate-950 shadow-2xl shadow-amber-950/30 sm:p-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-amber-200">
                      <Trophy className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold uppercase tracking-[0.2em] opacity-70">
                        First update goes to
                      </div>
                      <div className="text-3xl font-black sm:text-5xl">
                        {winner}
                      </div>
                    </div>
                  </div>
                </motion.section>
              ) : (
                <motion.section
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-[2rem] border border-white/10 bg-white/5 p-5 text-slate-300">
                  Add your team, then pick the first speaker. No one has to
                  pretend they volunteered.
                </motion.section>
              )}
            </AnimatePresence>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 p-4 shadow-inner shadow-black/50 sm:p-6 py-4">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(56,189,248,0.08)_35%,transparent_55%),radial-gradient(circle_at_80%_20%,rgba(217,70,239,0.16),transparent_28%)]" />

              <div className="relative mb-5 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-6">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                    Mission control
                  </div>
                  <div className="mt-1 text-lg font-black text-white">
                    Standup speaker queue
                  </div>
                </div>
                <motion.div
                  className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-sm font-bold text-cyan-100"
                  animate={{ opacity: isPicking ? [0.45, 1, 0.45] : 1 }}
                  transition={{
                    duration: 0.8,
                    repeat: isPicking ? Infinity : 0,
                  }}>
                  {isPicking ? "SCANNING" : winner ? "CLEARED" : "IDLE"}
                </motion.div>
              </div>

              <div className="relative grid gap-3">
                <AnimatePresence initial={false}>
                  {launchQueue.map(({ name, index, badge }) => {
                    const isActive = index === activeIndex;
                    const isWinner = index === winnerIndex;

                    return (
                      <motion.div
                        key={name}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{
                          opacity: isPicking && !isActive ? 0.55 : 1,
                          y: 0,
                          scale: isActive || isWinner ? 1.015 : 1,
                        }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{
                          type: "spring",
                          stiffness: 280,
                          damping: 24,
                        }}
                        className={`relative overflow-hidden rounded-2xl border p-4 shadow-lg transition ${
                          isWinner
                            ? "border-cyan-200 bg-cyan-300 text-slate-950 shadow-cyan-950/40"
                            : isActive
                              ? "border-cyan-200 bg-cyan-300 text-slate-950 shadow-cyan-950/40"
                              : "border-white/10 bg-white/10 text-white"
                        }`}>
                        {isActive && !isWinner && (
                          <motion.div
                            className="absolute inset-y-0 left-0 w-24 bg-white/25 blur-xl"
                            initial={{ x: "-140%" }}
                            animate={{ x: "680%" }}
                            transition={{
                              duration: 0.7,
                              repeat: isPicking ? Infinity : 0,
                              ease: "easeInOut",
                            }}
                          />
                        )}
                        <div className="relative flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-black ${
                                isWinner || isActive
                                  ? "bg-slate-950 text-white"
                                  : "bg-white/10 text-cyan-100"
                              }`}>
                              {String(index + 1).padStart(2, "0")}
                            </div>
                            <div>
                              <div className="text-xl font-black tracking-tight">
                                {name}
                              </div>
                              <div
                                className={`text-xs ${isWinner || isActive ? "opacity-70" : "text-slate-400"}`}>
                                {badge}
                              </div>
                            </div>
                          </div>
                          <div
                            className={`hidden rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] sm:block ${
                              isWinner
                                ? "bg-slate-950 text-amber-100"
                                : isActive
                                  ? "bg-slate-950 text-cyan-100"
                                  : "bg-white/10 text-slate-300"
                            }`}>
                            {isWinner
                              ? "Selected"
                              : isActive
                                ? "Target"
                                : "Queued"}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </section>

          {history.length > 0 && (
            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
              <div className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Recent picks
              </div>
              <div className="flex flex-wrap gap-2">
                {history.map((item, index) => (
                  <Badge
                    key={`${item}-${index}`}
                    className="rounded-full bg-white/10 px-3 py-1 text-white hover:bg-white/10">
                    {item}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
