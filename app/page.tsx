"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ExternalLink, Loader2, PenLine, Sparkles, Wallet } from "lucide-react";
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
    try {
      setWallet(await connectWallet());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wallet connection failed");
    } finally {
      setBusy("");
    }
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
    <main className="storybook-shell min-h-screen overflow-hidden bg-[#f7e9d0] text-[#251914]">
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5">
        <div className="flex items-center gap-3">
          <Image src="/brand-logo.png" alt="Coop Tales ER logo" width={58} height={58} className="book-logo h-[58px] w-[58px] rounded-md object-cover" priority />
          <div>
            <p className="book-title text-3xl font-bold">Coop Tales ER</p>
            <p className="text-xs uppercase tracking-[0.24em] text-[#7a5545]">real-time canon room</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href="/judge" className="hidden rounded-full border border-[#251914]/15 px-4 py-3 text-sm font-bold hover:bg-white/35 sm:block">Judge</a>
          <button onClick={onConnect} className="inline-flex h-12 items-center gap-2 rounded-full bg-[#251914] px-5 text-sm font-bold text-[#fff6e5] hover:bg-[#7b2746]">
            {busy === "connect" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
            {wallet ? shortKey(wallet) : "Connect Wallet"}
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-7 xl:grid-cols-[minmax(0,1fr)_300px]">
        <article className="open-book min-h-[720px] rounded-[30px] border border-[#251914]/12 bg-[#fff8e9] shadow-2xl shadow-[#7b2746]/15">
          <section className="book-page left-page">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#9b2f5a]"><PenLine className="h-4 w-4" /> Collaborative lore</p>
            <h1 className="book-headline mt-5 text-5xl font-bold leading-[1.02] sm:text-6xl">
              Turn shared imagination into verifiable canon.
            </h1>
            <label className="mt-10 block">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7a5545]">World</span>
              <input value={world} onChange={(e) => setWorld(e.target.value)} className="mt-3 w-full border-b border-[#251914]/20 bg-transparent py-3 text-3xl font-bold outline-none focus:border-[#9b2f5a]" />
            </label>
            <label className="mt-8 block">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7a5545]">Narrator prompt</span>
              <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="mt-3 min-h-36 w-full resize-none rounded-md border border-[#251914]/12 bg-[#fff2d7] p-4 text-xl leading-8 outline-none focus:border-[#9b2f5a]" />
            </label>
          </section>

          <section className="book-page right-page">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b2f5a]">Chapter branch</p>
              <span className="rounded-full bg-[#9b2f5a]/10 px-3 py-1 text-xs font-bold text-[#9b2f5a]">{votes} votes</span>
            </div>
            <label className="mt-5 block">
              <textarea value={contribution} onChange={(e) => setContribution(e.target.value)} className="chapter-ink min-h-52 w-full resize-none rounded-md border border-[#251914]/12 bg-[#fffaf0] p-5 text-xl leading-9 outline-none focus:border-[#9b2f5a]" />
            </label>
            <label className="mt-6 block">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7a5545]">Canon votes: {votes}</span>
              <input type="range" min="1" max="9" value={votes} onChange={(e) => setVotes(Number(e.target.value))} className="mt-3 w-full accent-[#9b2f5a]" />
            </label>
            <div className="mt-6 rounded-md border border-[#251914]/12 bg-[#fff2d7] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7a5545]">Contribution hash</p>
              <p className="mt-2 break-all font-mono text-xs text-[#7b2746]">{contributionHash}</p>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-[#7a5545]">Canon hash</p>
              <p className="mt-2 break-all font-mono text-xs text-[#7b2746]">{canonHash}</p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <button disabled={!wallet || Boolean(busy)} onClick={() => proof("Submit branch", "MagicBlock ER", `COOP_TALES_BRANCH:${contributionHash}`)} className="book-action bg-[#f6bfce] text-[#251914] disabled:opacity-40">
                Submit ER
              </button>
              <button disabled={!wallet || Boolean(busy)} onClick={() => proof("Vote canon", "MagicBlock ER", `COOP_TALES_VOTE:${contributionHash}:votes=${votes}`)} className="book-action border border-[#251914]/15 bg-white disabled:opacity-40">
                Vote Canon
              </button>
              <button disabled={!wallet || Boolean(busy)} onClick={() => proof("Finalize chapter", "Solana Devnet", `COOP_TALES_CANON:${canonHash}`)} className="book-action bg-[#251914] text-[#fff6e5] disabled:opacity-40">
                Settle L1
              </button>
            </div>
            {error ? <p className="mt-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
          </section>
        </article>

        <aside className="bookmark-proof rounded-[26px] border border-[#251914]/12 bg-[#7b2746] p-5 text-[#fff6e5] shadow-xl shadow-[#7b2746]/20">
          <div className="flex items-center justify-between">
            <p className="book-title text-2xl font-bold">Canon Proof</p>
            <Sparkles className="h-5 w-5 text-[#f6bfce]" />
          </div>
          <div className="mt-5 grid gap-3">
            {proofs.length === 0 ? (
              <p className="rounded-xl border border-white/15 p-6 text-center text-sm text-white/55">No proof yet.</p>
            ) : proofs.map((p) => (
              <a key={p.signature} href={explorerTx(p.signature)} target="_blank" rel="noreferrer" className="rounded-xl border border-white/15 bg-white/[0.06] p-4 transition hover:bg-white/[0.1]">
                <span className="flex items-center justify-between gap-3 text-sm font-bold">{p.label}<ExternalLink className="h-4 w-4 text-[#f6bfce]" /></span>
                <span className="mt-1 block text-xs text-white/55">{p.route}</span>
                <span className="mt-3 block break-all font-mono text-xs text-[#ffd4df]">{p.signature}</span>
              </a>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
