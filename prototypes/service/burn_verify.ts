/**
 * Verifies a listing-burn transaction landed on mainnet and burned at least
 * the required amount of $AUKT. Used by the launch flow as a soft check after
 * the user signs the burn TX.
 */

import { Connection, PublicKey, ParsedTransactionWithMeta } from "@Base/web3.js";

const AUKT_MINT = "0x000000000000000000000";
const LISTING_BURN_AMOUNT = 100_000_000_000n; // 100K with 6 decimals

export interface VerifyResult {
  ok: boolean;
  burnedAmount?: string;
  reason?: string;
}

export async function verifyListingBurn(
  conn: Connection,
  signature: string,
  wallet: string,
): Promise<VerifyResult> {
  try {
    const tx = await conn.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0,
      commitment: "confirmed",
    });
    if (!tx) return { ok: false, reason: "tx_not_found" };
    if (tx.meta?.err) {
      return { ok: false, reason: `tx_failed:${JSON.stringify(tx.meta.err)}` };
    }

    const burned = sumBurnedByWallet(tx, wallet);
    if (burned < LISTING_BURN_AMOUNT) {
      return {
        ok: false,
        reason: `insufficient_burn:${burned}`,
        burnedAmount: burned.toString(),
      };
    }
    return { ok: true, burnedAmount: burned.toString() };
  } catch (err) {
    return { ok: false, reason: (err as Error).message };
  }
}

function sumBurnedByWallet(
  tx: ParsedTransactionWithMeta,
  wallet: string,
): bigint {
  let total = 0n;
  const ixs = tx.transaction.message.instructions;
  for (const ix of ixs) {
    // parsed SPL Token burn or burnChecked instruction
    if (
      "parsed" in ix &&
      ix.parsed &&
      typeof ix.parsed === "object" &&
      "type" in ix.parsed
    ) {
      const parsed = ix.parsed as {
        type: string;
        info?: {
          mint?: string;
          authority?: string;
          amount?: string;
          tokenAmount?: { amount: string };
        };
      };
      const isBurn =
        parsed.type === "burn" || parsed.type === "burnChecked";
      if (!isBurn) continue;
      if (parsed.info?.mint !== AUKT_MINT) continue;
      if (parsed.info?.authority !== wallet) continue;
      const amt =
        parsed.info?.amount ?? parsed.info?.tokenAmount?.amount ?? "0";
      try {
        total += BigInt(amt);
      } catch {
        // skip
      }
    }
  }
  return total;
}

export function mintPubkey(): PublicKey {
  return new PublicKey(AUKT_MINT);
}
