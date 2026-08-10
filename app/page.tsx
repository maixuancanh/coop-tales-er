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
    setBusy("connect"); setError("");
    try { setWallet(await connectWallet()); }
    catch (err) { setError(err instanceof Error ? err.message : "Wallet connection failed"); }
    finally { setBusy(""); }
  }

  async function proof(label: string, route: Proof["route"], memo: string) {
    setBusy(label); setError("");
    try {
      const signature = await sendMemoProof(route, memo);
      setProofs((items) => [{ label, route, signature }, ...items]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Proof transaction failed");
    } finally { setBusy(""); }
  }

  return (
    <main className="tales-desk min-h-dvh overflow-hidden text-[#2b1711]">
      <Image src="/hero-bg.png" alt="" fill priority className="object-cover" />
      <div className="lamp-glaze" />
      <nav className="tales-nav">
        <div className="flex items-center gap-3">
          <Image src="/brand-logo.png" alt="Coop Tales ER logo" width={52} height={52} className="size-[52px] rounded-md object-cover shadow-lg" />
          <div><h1>Coop Tales ER</h1><p>canon room</p></div>
        </div>
        <button onClick={onConnect}>{busy === "connect" ? <Loader2 className="size-4 animate-spin" /> : <Wallet className="size-4" />}{wallet ? shortKey(wallet) : "Connect"}</button>
      </nav>

      <section className="manuscript">
        <label className="chapter-title">
          <span>World</span>
          <input value={world} onChange={(e) => setWorld(e.target.value)} />
        </label>
        <label className="page-left">
          <span><PenLine className="size-4" /> Narrator prompt</span>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        </label>
        <label className="page-right">
          <span>Branch draft</span>
          <textarea value={contribution} onChange={(e) => setContribution(e.target.value)} />
        </label>
      </section>

      <aside className="canon-ribbon">
        <a href="/judge">Judge</a>
        <span>{votes} canon votes</span>
        <input type="range" min="1" max="9" value={votes} onChange={(e) => setVotes(Number(e.target.value))} />
        <code>{contributionHash}</code>
      </aside>

      <section className="tales-actions">
        <button disabled={!wallet || Boolean(busy)} onClick={() => proof("Submit branch", "MagicBlock ER", `COOP_TALES_BRANCH:${contributionHash}`)}>Submit ER</button>
        <button disabled={!wallet || Boolean(busy)} onClick={() => proof("Vote canon", "MagicBlock ER", `COOP_TALES_VOTE:${contributionHash}:votes=${votes}`)}>Vote Canon</button>
        <button disabled={!wallet || Boolean(busy)} onClick={() => proof("Finalize chapter", "Solana Devnet", `COOP_TALES_CANON:${canonHash}`)}>Settle L1</button>
      </section>
      {error ? <p className="tales-error">{error}</p> : null}

      <aside className="chapter-proof">
        <div className="flex items-center justify-between"><b>Chapter Proof</b><Sparkles className="size-4" /></div>
        {proofs.length === 0 ? <p>No proof yet.</p> : proofs.map((p) => (
          <a key={p.signature} href={explorerTx(p.signature)} target="_blank" rel="noreferrer">{p.label}<ExternalLink className="size-3" /></a>
        ))}
      </aside>
    </main>
  );
}
