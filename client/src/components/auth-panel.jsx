import { useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const initialLogin = { email: '', password: '' }
const initialRegister = { email: '', password: '', fullName: '', role: 'buyer' }

export function AuthPanel ({
  onLogin,
  onRegister,
  error,
  title = 'Access Onyx',
  subtitle = 'Use one account flow for buyer and seller access.',
  className
}) {
  const [mode, setMode] = useState('login')
  const [loginValues, setLoginValues] = useState(initialLogin)
  const [registerValues, setRegisterValues] = useState(initialRegister)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')

  async function submitLogin (e) {
    e.preventDefault()
    setNotice('')
    setBusy(true)
    try {
      await onLogin(loginValues)
      setLoginValues(initialLogin)
    } catch {
      // error is surfaced by auth hook state
    } finally {
      setBusy(false)
    }
  }

  async function submitRegister (e) {
    e.preventDefault()
    setNotice('')
    setBusy(true)
    try {
      await onRegister(registerValues)
      setRegisterValues(initialRegister)
      setNotice('Account created and signed in.')
    } catch {
      // error is surfaced by auth hook state
    } finally {
      setBusy(false)
    }
  }

  const isLogin = mode === 'login'

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx('glass mx-auto w-full max-w-md rounded-3xl p-6', className)}
    >
      <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Authentication</p>
      <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
      <div className="mb-4 flex rounded-full bg-white/5 p-1">
        <button
          onClick={() => setMode('login')}
          className={`flex-1 rounded-full px-3 py-2 text-sm ${isLogin ? 'bg-cyan-400/20 text-cyan-100' : 'text-slate-300'}`}
        >
          Login
        </button>
        <button
          onClick={() => setMode('register')}
          className={`flex-1 rounded-full px-3 py-2 text-sm ${!isLogin ? 'bg-cyan-400/20 text-cyan-100' : 'text-slate-300'}`}
        >
          Register
        </button>
      </div>

      {isLogin ? (
        <form onSubmit={submitLogin} className="space-y-3">
          <input
            type="email"
            value={loginValues.email}
            onChange={(e) => setLoginValues((v) => ({ ...v, email: e.target.value }))}
            className="w-full rounded-xl border border-white/20 bg-black/25 px-3 py-2 text-sm text-white outline-none"
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={loginValues.password}
            onChange={(e) => setLoginValues((v) => ({ ...v, password: e.target.value }))}
            className="w-full rounded-xl border border-white/20 bg-black/25 px-3 py-2 text-sm text-white outline-none"
            placeholder="Password (min 12)"
            minLength={12}
            required
          />
          <button
            disabled={busy}
            className="w-full rounded-xl bg-cyan-500 px-3 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60"
          >
            {busy ? 'Authenticating...' : 'Enter Live Floor'}
          </button>
        </form>
      ) : (
        <form onSubmit={submitRegister} className="space-y-3">
          <input
            value={registerValues.fullName}
            onChange={(e) => setRegisterValues((v) => ({ ...v, fullName: e.target.value }))}
            className="w-full rounded-xl border border-white/20 bg-black/25 px-3 py-2 text-sm text-white outline-none"
            placeholder="Full Name"
            required
          />
          <input
            type="email"
            value={registerValues.email}
            onChange={(e) => setRegisterValues((v) => ({ ...v, email: e.target.value }))}
            className="w-full rounded-xl border border-white/20 bg-black/25 px-3 py-2 text-sm text-white outline-none"
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={registerValues.password}
            onChange={(e) => setRegisterValues((v) => ({ ...v, password: e.target.value }))}
            className="w-full rounded-xl border border-white/20 bg-black/25 px-3 py-2 text-sm text-white outline-none"
            placeholder="Password (min 12)"
            minLength={12}
            required
          />
          <select
            value={registerValues.role}
            onChange={(e) => setRegisterValues((v) => ({ ...v, role: e.target.value }))}
            className="w-full rounded-xl border border-white/20 bg-black/25 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
          <button
            disabled={busy}
            className="w-full rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60"
          >
            {busy ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
      )}

      {notice ? <p className="mt-3 text-xs text-emerald-300">{notice}</p> : null}
      {!isLogin ? <p className="mt-2 text-[11px] text-slate-400">Password must be at least 12 characters.</p> : null}
      {error ? <p className="mt-3 text-xs text-rose-300">{error}</p> : null}
    </motion.div>
  )
}
