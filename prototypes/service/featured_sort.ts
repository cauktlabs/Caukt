/**
 * Featured + holder-only sort for the /market feed.
 * Pinned-first ordering so the gold-ringed stalls always sit on top.
 */

export interface FeedAuction {
  address: string;
  holderOnly: boolean;
  featured: boolean;
  featuredSecsLeft: number;
  startTs: number;
  endTs: number;
  status: "pending" | "live" | "ended" | "settled" | "cancelled";
}

export function sortMarketFeed<T extends FeedAuction>(items: T[]): T[] {
  const copy = [...items];
  copy.sort((a, b) => {
    // 1) holders-only stalls pin to the top
    if (a.holderOnly !== b.holderOnly) {
      return a.holderOnly ? -1 : 1;
    }
    // 2) featured boost (paid promotion) next
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    if (a.featured && b.featured) {
      return b.featuredSecsLeft - a.featuredSecsLeft;
    }
    // 3) live before pending
    const aLive = a.status === "live";
    const bLive = b.status === "live";
    if (aLive !== bLive) return aLive ? -1 : 1;
    // 4) recency — most recent start first
    return b.startTs - a.startTs;
  });
  return copy;
}

export function isActive(a: FeedAuction, nowSec: number): boolean {
  return (
    (a.status === "live" || a.status === "pending") &&
    a.endTs > nowSec
  );
}
