import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const trustPillars = [
  { title: 'Transaction-safe bidding', detail: 'MongoDB transactions + OCC keep bids consistent under concurrency.' },
  { title: 'Realtime propagation', detail: 'Bid events broadcast instantly across marketplace, live floor, and profiles.' },
  { title: 'Deterministic finalization', detail: 'Background sweep finalizes winners and credit settlement every 10 seconds.' }
]

const productCards = [
  { title: 'Marketplace', description: 'Browse live lots, inspect pricing, and place bids directly from listing cards.', to: '/marketplace' },
  { title: 'Seller Studio', description: 'Create polished listings with images, categories, and immediate publication.', to: '/seller-studio' },
  { title: 'Finished Reports', description: 'Explore completed auction analytics, winner outcomes, and bid timelines.', to: '/finished' },
  { title: 'Account Center', description: 'Manage profile, role context, bids placed, and wins in one dashboard.', to: '/profile' }
]

const processFlow = [
  { step: '01', title: 'Create listing', text: 'Seller publishes a lot with pricing guardrails and timing.' },
  { step: '02', title: 'Compete live', text: 'Buyers place bids through validated, rate-limited endpoints.' },
  { step: '03', title: 'Finalize winner', text: 'Highest valid bid wins when auction window closes.' },
  { step: '04', title: 'Settle credits', text: 'Onyx credits transfer atomically and outcomes appear in user profiles.' }
]

export function HomePage () {
  return (
    <div className="aurora-bg min-h-screen pb-14">
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-12 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
        <div>
          <p className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">
            Enterprise Auction Platform
          </p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight text-white">
            Onyx powers high-trust realtime auctions for modern digital marketplaces.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-300">
            A production-focused bidding system with secure auth, transactional integrity, and fast analytical reporting for buyers and sellers.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/auth" className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950">
              Sign in / Register
            </Link>
            <Link to="/marketplace" className="rounded-xl border border-white/20 px-5 py-2.5 text-sm text-slate-200 hover:bg-white/10">
              Open Marketplace
            </Link>
          </div>
        </div>
        <div className="glass neon-ring rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">Operational snapshot</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Stat title="Auctions tracked" value="148K+" />
            <Stat title="Bid throughput" value="2.6K/min" />
            <Stat title="Avg commit latency" value="48ms" />
            <Stat title="Settlement integrity" value="99.997%" />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-4">
        <div className="grid gap-4 md:grid-cols-3">
          {trustPillars.map((pillar, index) => (
            <motion.article
              key={pillar.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-2xl p-5"
            >
              <h2 className="text-base font-semibold text-white">{pillar.title}</h2>
              <p className="mt-2 text-sm text-slate-300">{pillar.detail}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Product surfaces</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Everything needed for production-grade auction operations</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {productCards.map((card, index) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              className="glass rounded-2xl p-5"
            >
              <h3 className="text-lg font-semibold text-white">{card.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{card.description}</p>
              <Link to={card.to} className="mt-4 inline-flex text-xs uppercase tracking-[0.15em] text-cyan-200 hover:text-cyan-100">
                Open {card.title} →
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="glass rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">Execution flow</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {processFlow.map((item) => (
              <div key={item.step} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">{item.step}</p>
                <h3 className="mt-2 text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function Stat ({ title, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-cyan-100">{value}</p>
    </div>
  )
}
