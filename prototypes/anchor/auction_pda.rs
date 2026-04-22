//! Auction PDA derivation sketch — matches the on-chain program on mainnet.
//!
//! The live program stores one `Auction` account per stall, keyed by
//! (creator, seed). Anyone can regenerate the address off-chain.

use anchor_lang::prelude::*;

pub const AUCTION_SEED_PREFIX: &[u8] = b"auction";

/// Derive the auction PDA address for a given creator + seed.
/// The live program uses `to_le_bytes` on the u64 seed.
pub fn derive_auction_pda(
    program_id: &Pubkey,
    creator: &Pubkey,
    seed: u64,
) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[
            AUCTION_SEED_PREFIX,
            creator.as_ref(),
            &seed.to_le_bytes(),
        ],
        program_id,
    )
}

/// Dutch-auction price at a given timestamp.
/// Mirrors the on-chain `compute_current_price` for off-chain verification.
pub fn current_price(
    start_price: u64,
    end_price: u64,
    start_ts: i64,
    end_ts: i64,
    now: i64,
    decay_curve: u8,
) -> u64 {
    if now <= start_ts {
        return start_price;
    }
    if now >= end_ts {
        return end_price;
    }
    let elapsed = (now - start_ts) as u128;
    let total = (end_ts - start_ts) as u128;
    let drop = (start_price as u128).saturating_sub(end_price as u128);

    if decay_curve == 0 {
        // linear
        let delta = drop.saturating_mul(elapsed) / total.max(1);
        (start_price as u128).saturating_sub(delta) as u64
    } else {
        // two-stage exponential-ish approximation
        let mid = total / 2;
        if elapsed <= mid {
            let delta = drop.saturating_mul(elapsed) / (4 * mid.max(1));
            (start_price as u128).saturating_sub(delta) as u64
        } else {
            let delta_first = drop / 4;
            let remain = drop.saturating_sub(delta_first);
            let extra = remain.saturating_mul(elapsed - mid) / mid.max(1);
            (start_price as u128)
                .saturating_sub(delta_first + extra) as u64
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn linear_start_and_end() {
        assert_eq!(current_price(1_000, 100, 0, 1_000, 0, 0), 1_000);
        assert_eq!(current_price(1_000, 100, 0, 1_000, 1_000, 0), 100);
    }

    #[test]
    fn linear_half() {
        // Half-way through, price is half-way between start and end.
        let p = current_price(1_000, 100, 0, 1_000, 500, 0);
        assert!(p > 500 && p < 600);
    }
}
