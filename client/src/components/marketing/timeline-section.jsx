import { motion } from 'framer-motion'
import { timeline } from '../../data/marketing-content'

export function TimelineSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">Auction lifecycle</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">From listing to secure settlement in four deterministic stages.</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {timeline.map((item, index) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="glass rounded-2xl p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">{item.step}</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
