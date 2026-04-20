import { motion } from 'framer-motion'
import { capabilities } from '../../data/marketing-content'

export function CapabilitiesSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-200">What the site can do</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Enterprise-grade capabilities with luxury-grade UX.</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {capabilities.map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.04 }}
            className="glass rounded-2xl p-5"
          >
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
