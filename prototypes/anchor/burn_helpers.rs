//! SPL burn helpers — used by the listing flow.
//!
//! Listing a stall burns 100K $AUKT (decimals 6 -> 100_000_000_000 raw units).
//! The live program uses Token-2022 interface accounts so both the classic
//! SPL Token program and Token-2022 mints are accepted.

use anchor_lang::prelude::*;
use anchor_spl::token_interface::{self, Burn, TokenAccount, TokenInterface, Mint};

pub const LISTING_BURN_AMOUNT: u64 = 100_000_000_000; // 100K with 6 decimals

#[derive(Accounts)]
pub struct BurnListingFee<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(mut, token::mint = mint, token::authority = payer)]
    pub payer_ata: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>,
}

pub fn burn_listing_fee(ctx: Context<BurnListingFee>) -> Result<()> {
    let decimals = ctx.accounts.mint.decimals;
    let cpi = Burn {
        mint: ctx.accounts.mint.to_account_info(),
        from: ctx.accounts.payer_ata.to_account_info(),
        authority: ctx.accounts.payer.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        cpi,
    );
    // burn_checked pins the decimals so stale clients can't underflow the amount
    token_interface::burn_checked(cpi_ctx, LISTING_BURN_AMOUNT, decimals)?;
    Ok(())
}

/// Pure helper — scales a whole-token amount into raw units given decimals.
pub fn whole_to_raw(whole: u64, decimals: u8) -> u64 {
    whole.saturating_mul(10u64.pow(decimals as u32))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn scales_correctly() {
        assert_eq!(whole_to_raw(100_000, 6), 100_000_000_000);
        assert_eq!(whole_to_raw(1, 9), 1_000_000_000);
    }
}
