/**
 * Bid modal sketch — mirrors the live BidModal on aukt.click/market.
 * Walks the user through current-price + max-price + holder-tier gate.
 */

import { useState, useEffect } from "react";

interface Auction {
  address: string;
  assetSymbol: string;
  startPrice: string;
  endPrice: string;
  startTs: number;
  endTs: number;
  holderOnly?: boolean;
  minHolderScoreRaw?: string;
}

interface HolderScore {
  score: string;
  tier: string;
  headStartSeconds: number;
}

interface BidModalProps {
  auction: Auction;
  myScore: HolderScore | null;
  onSubmit: (maxLamports: string) => Promise<void>;
  onClose: () => void;
}

function solToLamports(sol: string): string {
  if (!sol) return "";
  const [whole, frac = ""] = sol.replace(/[^0-9.]/g, "").split(".");
  const padded = (frac + "000000000").slice(0, 9);
  try {
    return (BigInt(whole || "0") * 1_000_000_000n + BigInt(padded)).toString();
  } catch {
    return "";
  }
}

function lamportsToSolDisplay(lamports: string): string {
  const n = BigInt(lamports || "0");
  const whole = n / 1_000_000_000n;
  const frac = n % 1_000_000_000n;
  return `${whole}.${frac.toString().padStart(9, "0").slice(0, 3)}`;
}

export default function BidModalProto({
  auction,
  myScore,
  onSubmit,
  onClose,
}: BidModalProps) {
  const [solInput, setSolInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));

  useEffect(() => {
    const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  // off-chain price replica for display only
  const price = computePrice(auction, now);

  const holderGate =
    auction.holderOnly &&
    auction.minHolderScoreRaw &&
    BigInt(auction.minHolderScoreRaw) > 0n &&
    (!myScore || BigInt(myScore.score) < BigInt(auction.minHolderScoreRaw));

  const submit = async () => {
    if (holderGate) return;
    setSubmitting(true);
    try {
      await onSubmit(solInput ? solToLamports(solInput) : price.toString());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bid-modal" role="dialog">
      <button onClick={onClose}>X</button>
      <h2>{auction.assetSymbol}</h2>
      <p>Current price: {lamportsToSolDisplay(price.toString())} SOL</p>
      {holderGate && (
        <p style={{ color: "#E63946" }}>
          HOLDERS ONLY — min score {auction.minHolderScoreRaw} required.
        </p>
      )}
      <input
        value={solInput}
        placeholder={`default: ${lamportsToSolDisplay(price.toString())} SOL`}
        onChange={(e) => setSolInput(e.target.value.replace(/[^0-9.]/g, ""))}
      />
      <button onClick={submit} disabled={submitting || holderGate}>
        {submitting ? "RINGING..." : "RING THE BELL"}
      </button>
    </div>
  );
}

function computePrice(a: Auction, nowTs: number): bigint {
  const start = BigInt(a.startPrice);
  const end = BigInt(a.endPrice);
  if (nowTs <= a.startTs) return start;
  if (nowTs >= a.endTs) return end;
  const total = BigInt(a.endTs - a.startTs);
  const elapsed = BigInt(nowTs - a.startTs);
  return start - ((start - end) * elapsed) / total;
}
