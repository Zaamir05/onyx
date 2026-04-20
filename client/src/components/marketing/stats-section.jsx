import { motion } from 'framer-motion'
import { platformStats } from '../../data/marketing-content'

export function StatsSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {platformStats.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="glass rounded-2xl p-4"
          >
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
