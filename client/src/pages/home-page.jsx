import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const proofPoints = [
  { label: 'Live signal', value: 'Sub-second' },
  { label: 'Closeout sweep', value: 'Every 10s' },
  { label: 'Bid integrity', value: 'OCC + txns' }
]

const trustMarks = ['Seller tools', 'Live floor', 'Finished reports', 'Admin console', 'Profile', 'Settlement']

const brandMarks = [
  'NovaGrid',
  'Aether Labs',
  'SignalForge',
  'Helix Capital',
  'Blackline',
  'Orchid Ops',
  'Terminal West',
  'Ghostframe'
]

const pillars = [
  {
    title: 'Fast to list',
    copy: 'Drop a lot, set a timer, and go live in one clean flow.'
  },
  {
    title: 'Easy to bid',
    copy: 'Buyers get a focused marketplace with live pricing and instant feedback.'
  },
  {
    title: 'Clear to trust',
    copy: 'Transactions, reporting, and settlement stay visible after the hammer falls.'
  }
]

const steps = [
  { step: '01', title: 'List', copy: 'Publish a lot with price, image, and duration.' },
  { step: '02', title: 'Compete', copy: 'Watch bids move live across the floor.' },
  { step: '03', title: 'Settle', copy: 'See the outcome in reports, profile, and admin views.' }
]

const reviews = [
  { name: 'S. Kade', role: 'Marketplace Ops', quote: 'Clean, fast, and easy to explain to stakeholders.' },
  { name: 'M. Voss', role: 'Seller Lead', quote: 'The listing flow stays out of the way and gets the job done.' },
  { name: 'J. Riven', role: 'Security', quote: 'The transaction story is the real selling point.' },
  { name: 'I. Sol', role: 'Growth', quote: 'Feels like a product teams would actually ship.' }
]

export function HomePage () {
  return (
    <div className="onyx-landing min-h-screen pb-16">
      <section className="mx-auto w-full max-w-6xl px-4 py-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="space-y-6 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="inline-flex rounded-full border border-emerald-300/30 bg-black/45 px-3 py-1 text-xs uppercase tracking-[0.22em] text-emerald-200"
          >
            Onyx auction platform
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="mx-auto max-w-3xl text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl"
          >
            Live auctions that feel sharp, modern, and easy to trust.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl text-base text-slate-300 sm:text-lg"
          >
            One place for buyers, sellers, and operators to list, bid, settle, and review outcomes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <Link to="/auth" className="rounded-xl bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950">
              Get started
            </Link>
            <Link to="/marketplace" className="rounded-xl border border-white/20 px-5 py-2.5 text-sm text-slate-200 hover:bg-white/10">
              Browse marketplace
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="flex flex-wrap justify-center gap-2 text-[11px] uppercase tracking-[0.2em] text-slate-500"
          >
            {trustMarks.map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-black/40 px-3 py-1">
                {item}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="onyx-panel rounded-3xl p-6 text-left"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Launch snapshot</p>
              <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-emerald-200">
                Live
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {proofPoints.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-black/55 p-4">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-emerald-200">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/45 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Core surfaces</p>
                <p className="mt-2 text-sm text-slate-200">Marketplace, live floor, profile, finished reports, seller studio, admin panel.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/45 p-4">
                <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Built for</p>
                <p className="mt-2 text-sm text-slate-200">Buyers, sellers, operators, and demo flows that need to feel credible.</p>
              </div>
            </div>

            <div className="onyx-divider mt-5" />

            <div className="mt-5 space-y-3">
              <MiniFlow label="Live floor" copy="Active lots move instantly when bids land." />
              <MiniFlow label="Profile" copy="Placed bids, wins, and seller activity all stay visible." />
              <MiniFlow label="Reports" copy="Finished auctions open into clean post-auction detail." />
            </div>
          </motion.div>
        </motion.div>

        <div className="mt-8 grid gap-3 rounded-3xl border border-white/10 bg-black/45 p-4 sm:grid-cols-2 lg:grid-cols-4">
          {brandMarks.map((brand) => (
            <div key={brand} className="flex items-center justify-center rounded-2xl border border-white/10 bg-black/35 px-3 py-4 text-xs uppercase tracking-[0.2em] text-slate-400">
              {brand}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-6">
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="onyx-panel rounded-2xl p-5"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-200">Why teams use Onyx</p>
              <h2 className="mt-2 text-lg font-semibold text-white">{pillar.title}</h2>
              <p className="mt-2 text-sm text-slate-300">{pillar.copy}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Simple flow</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">List, bid, settle.</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="glass rounded-2xl p-5"
            >
              <p className="font-code text-xs uppercase tracking-[0.18em] text-cyan-200">{item.step}</p>
              <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-300">{item.copy}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8">
        <div className="onyx-panel rounded-3xl p-6">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Operator feedback</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Short quotes, real signal.</h2>
          </div>
          <div className="marquee">
            <div className="marquee-track">
              {[...reviews, ...reviews].map((review, idx) => (
                <div key={`${review.name}-top-${idx}`} className="marquee-item">
                  <p className="text-sm text-slate-200">“{review.quote}”</p>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-emerald-200">{review.name}</p>
                  <p className="text-xs text-slate-400">{review.role}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="marquee mt-4">
            <div className="marquee-track reverse">
              {[...reviews, ...reviews].reverse().map((review, idx) => (
                <div key={`${review.name}-bottom-${idx}`} className="marquee-item">
                  <p className="text-sm text-slate-200">“{review.quote}”</p>
                  <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-emerald-200">{review.name}</p>
                  <p className="text-xs text-slate-400">{review.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="onyx-panel rounded-3xl p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Ready to go</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Start with a seller account or jump straight into bidding.</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/auth" className="rounded-xl bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-slate-950">
                Create account
              </Link>
              <Link to="/live" className="rounded-xl border border-white/20 px-5 py-2.5 text-sm text-slate-200 hover:bg-white/10">
                Open live floor
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

function MiniFlow ({ label, copy }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 p-4">
      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.9)]" />
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
        <p className="mt-1 text-sm text-slate-200">{copy}</p>
      </div>
    </div>
  )
}
