export const platformStats = [
  { label: 'Auctions Closed', value: '148K+' },
  { label: 'Bid Throughput', value: '2.6K/min' },
  { label: 'Avg Latency', value: '48ms' },
  { label: 'Fraud Blocks', value: '99.97%' }
]

export const capabilities = [
  {
    title: 'Live Competitive Floor',
    description:
      'Realtime bid streams, anti-race transactional writes, and instant leaderboard shifts with socket-synchronized updates.'
  },
  {
    title: 'Secure Payment Finalization',
    description:
      'Webhooks with signature verification, idempotency guards, and strict status transitions for payout integrity.'
  },
  {
    title: 'Seller Intelligence',
    description:
      'Smart listing controls, demand heat visuals, and conversion-centric auction structure to maximize closing price.'
  },
  {
    title: 'Buyer Precision Tools',
    description:
      'Fast bid placement, countdown awareness, and data-rich lot cards engineered for split-second decisions.'
  }
]

export const timeline = [
  { step: '01', title: 'List', description: 'Sellers publish high-quality lots with controlled start/end windows.' },
  { step: '02', title: 'Compete', description: 'Buyers bid live under ACID transaction guarantees and OCC conflict protection.' },
  { step: '03', title: 'Win', description: 'Highest valid bid closes at timer end with deterministic finalization.' },
  { step: '04', title: 'Settle', description: 'Webhook-confirmed payment transitions finalize the auction lifecycle securely.' }
]
