import Link from "next/link";
import { BookOpen } from "lucide-react";

const programId = "9pxVnueG82fUQHBtvV8co5HDKQEjVrEEq2NABEs5ny1G";
const deployTx = "43hSCzCmK37anaM6wFLE1ZMTWdfCGKN3sHKJg8msdh1vcjjJLeEDBvDPAGJdG4qJkR2xzcHVYr5mkXgPs7wLNLRo";

export default function JudgePage() {
  return (
    <main className="min-h-screen bg-[#fbf4ff] px-5 py-8 text-[#1d1423]">
      <section className="mx-auto max-w-5xl rounded-xl bg-white p-6 shadow-xl">
        <Link href="/" className="text-sm text-purple-950/60 hover:text-purple-950">Back to canon room</Link>
        <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-purple-900"><BookOpen className="h-4 w-4" /> Judge mode</p>
        <h1 className="mt-5 text-4xl font-semibold">Coop Tales ER Proof Board</h1>
        <p className="mt-4 max-w-3xl leading-7 text-purple-950/70">An independent MagicBlock/Solana collaborative storytelling room. Branch submissions and canon votes are routed through ER; final canon hashes settle on devnet.</p>
        <div className="mt-8 grid gap-3">
          {[
            ["Eligibility", "MagicBlock ER is used for real-time branch and vote proof transactions against a deployed custom Solana program."],
            ["Creativity", "Shared story canon turns collaboration into a verifiable social object."],
            ["Technical depth", "Contribution hashes, canon hashes, and custom program instruction logs separate content privacy from settlement proof."],
            ["Showcase", "The live room creates clickable explorer signatures from wallet actions."],
          ].map(([label, detail]) => <div key={label} className="grid gap-2 rounded-lg border border-purple-950/10 bg-purple-50 p-4 sm:grid-cols-[180px_1fr]"><p className="font-semibold text-purple-900">{label}</p><p className="text-purple-950/70">{detail}</p></div>)}
        </div>
        <div className="mt-8 rounded-lg border border-purple-950/10 bg-purple-50 p-4">
          <p className="font-semibold text-purple-900">Onchain deployment</p>
          <a className="mt-3 block break-all text-sm text-purple-900" href={`https://explorer.solana.com/address/${programId}?cluster=devnet`} target="_blank" rel="noreferrer">Program ID: {programId}</a>
          <a className="mt-2 block break-all text-sm text-purple-900" href={`https://explorer.solana.com/tx/${deployTx}?cluster=devnet`} target="_blank" rel="noreferrer">Deploy tx: {deployTx}</a>
        </div>
      </section>
    </main>
  );
}
