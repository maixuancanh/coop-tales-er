"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { CheckCircle2, ExternalLink, Loader2, PenLine, Sparkles, Wallet } from "lucide-react";
import { connectWallet, explorerTx, hashPayload, sendMemoProof, shortKey } from "@/lib/solana";

type Proof = { label: string; route: "MagicBlock ER" | "Solana Devnet"; signature: string };

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [world, setWorld] = useState("The Glass Orchard");
  const [prompt, setPrompt] = useState("The team discovers a rollup clock hidden under the orchard roots.");
  const [contribution, setContribution] = useState("A second builder tunes the clock so every branch remembers a different future, but only the voted canon survives.");
  const [votes, setVotes] = useState(3);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [proofs, setProofs] = useState<Proof[]>([]);

  const contributionHash = useMemo(() => hashPayload(`${world}:${prompt}:${contribution}`), [world, prompt, contribution]);
  const canonHash = useMemo(() => hashPayload(`${contributionHash}:${votes}`), [contributionHash, votes]);

  async function onConnect() {
    setBusy("connect");
    setError("");
    try { setWallet(await connectWallet()); }
    catch (err) { setError(err instanceof Error ? err.message : "Wallet connection failed"); }
    finally { setBusy(""); }
  }

  async function proof(label: string, route: Proof["route"], memo: string) {
    setBusy(label);
    setError("");
    try {
      const signature = await sendMemoProof(route, memo);
      setProofs((items) => [{ label, route, signature }, ...items]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Proof transaction failed");
    } finally {
      setBusy("");
    }
  }

  return (
    <main className="storybook-bg relative min-h-screen overflow-hidden bg-[#fbf4ff] text-[#1d1423]">
      <div className="path-glow pointer-events-none absolute left-1/2 top-1/2 h-1 w-[72vw] -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-pink-300 to-transparent blur-sm" />
      <div className="pointer-events-none absolute right-10 top-10 h-64 w-64 rounded-full bg-yellow-200/30 blur-3xl" />
      <section className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-6 px-5 py-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="canon-card flex flex-col justify-between rounded-xl bg-gradient-to-br from-[#24142f] via-[#3a1d4c] to-[#24142f] p-6 text-white shadow-2xl shadow-purple-950/30">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/brand-logo.png" alt="Coop Tales ER logo" width={48} height={48} className="page-float h-12 w-12 rounded-lg object-cover ring-1 ring-pink-200/50" priority />
              <div><p className="text-sm font-semibold uppercase tracking-[0.22em] text-pink-200">Coop Tales ER</p><p className="text-xs text-purple-200/70">Real-time canon room</p></div>
            </div>
            <a href="/judge" className="text-sm text-purple-100 hover:text-white">Judge</a>
          </nav>
          <div className="max-w-xl py-16">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-200/30 bg-pink-200/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-pink-100"><PenLine className="h-4 w-4" /> Collaborative lore</p>
            <h1 className="text-5xl font-semibold leading-[1.02]">Turn shared imagination into verifiable canon.</h1>
            <p className="mt-5 text-lg leading-8 text-purple-100/80">A fresh Solana/MagicBlock project where multiple wallets co-create story branches, vote in a fast ER room, and settle a final chapter hash on devnet.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            {["Story room", "Canon vote", "Final hash"].map((item) => <div key={item} className="rounded-lg border border-white/10 bg-white/[0.06] p-4"><CheckCircle2 className="mb-3 h-5 w-5 text-pink-200" /><p>{item}</p></div>)}
          </div>
        </div>
        <div className="rounded-xl border border-purple-950/10 bg-white/95 p-5 shadow-xl backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-purple-950/10 pb-4">
            <div><h2 className="text-2xl font-semibold">Canon Room</h2><p className="text-sm text-purple-950/60">Submit a branch, vote it into canon, and publish proof.</p></div>
            <button onClick={onConnect} className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#24142f] px-4 text-sm font-semibold text-white hover:bg-[#4a2360]">{busy === "connect" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}{wallet ? shortKey(wallet) : "Connect Wallet"}</button>
          </div>
          <div className="grid gap-5 py-5">
            <label className="grid gap-2"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-950/50">World</span><input value={world} onChange={(e) => setWorld(e.target.value)} className="h-12 rounded-lg border border-purple-950/10 bg-purple-50/60 px-4 outline-none focus:border-pink-400" /></label>
            <label className="grid gap-2"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-950/50">Narrator prompt</span><textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="min-h-24 rounded-lg border border-purple-950/10 bg-purple-50/60 p-4 outline-none focus:border-pink-400" /></label>
            <label className="grid gap-2"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-950/50">Your branch</span><textarea value={contribution} onChange={(e) => setContribution(e.target.value)} className="min-h-28 rounded-lg border border-purple-950/10 bg-purple-50/60 p-4 outline-none focus:border-pink-400" /></label>
            <div className="rounded-lg border border-purple-950/10 bg-gradient-to-br from-purple-50 to-pink-50 p-4 shadow-inner"><p className="text-xs uppercase tracking-[0.18em] text-purple-950/50">Contribution hash</p><p className="mt-2 break-all font-mono text-xs text-purple-800">{contributionHash}</p></div>
            <label className="grid gap-2"><span className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-950/50">Canon votes: {votes}</span><input type="range" min="1" max="9" value={votes} onChange={(e) => setVotes(Number(e.target.value))} /></label>
            <div className="grid gap-3 sm:grid-cols-3">
              <button disabled={!wallet || Boolean(busy)} onClick={() => proof("Submit branch", "MagicBlock ER", `COOP_TALES_BRANCH:${contributionHash}`)} className="h-12 rounded-lg bg-pink-200 font-semibold text-[#24142f] disabled:opacity-40">Submit via ER</button>
              <button disabled={!wallet || Boolean(busy)} onClick={() => proof("Vote canon", "MagicBlock ER", `COOP_TALES_VOTE:${contributionHash}:votes=${votes}`)} className="h-12 rounded-lg border border-purple-950/10 font-semibold disabled:opacity-40">Vote Canon</button>
              <button disabled={!wallet || Boolean(busy)} onClick={() => proof("Finalize chapter", "Solana Devnet", `COOP_TALES_CANON:${canonHash}`)} className="h-12 rounded-lg bg-[#24142f] font-semibold text-white disabled:opacity-40">Settle L1</button>
            </div>
            <div className="rounded-lg border border-purple-950/10"><div className="flex items-center justify-between border-b border-purple-950/10 px-4 py-3"><p className="font-semibold">Proof timeline</p><Sparkles className="h-4 w-4 text-pink-500" /></div><div className="grid gap-2 p-3">{proofs.length === 0 ? <p className="py-6 text-center text-sm text-purple-950/50">No proof yet.</p> : proofs.map((p) => <a key={p.signature} href={explorerTx(p.signature)} target="_blank" rel="noreferrer" className="rounded-lg bg-purple-50 p-3 transition hover:-translate-y-0.5 hover:bg-pink-50 hover:shadow-lg hover:shadow-pink-200/40"><span className="flex items-center justify-between text-sm font-semibold">{p.label}<ExternalLink className="h-4 w-4" /></span><span className="mt-1 block text-xs text-purple-950/50">{p.route}</span><span className="mt-2 block break-all font-mono text-xs text-purple-800">{p.signature}</span></a>)}</div></div>
            {error ? <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
          </div>
        </div>
      </section>
    </main>
  );
}
