import { Navigate, useLocation, useSearchParams } from 'react-router-dom'
import { AuthPanel } from '../components/auth-panel'
import { useAuth } from '../hooks/use-auth'
import { LoadingScreen } from '../components/loading-screen'

export function AuthPage () {
  const auth = useAuth()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const requestedNext = searchParams.get('next') || '/profile'
  const nextPath = requestedNext.startsWith('/') ? requestedNext : '/profile'

  if (auth.loading) {
    return (
      <div className="aurora-bg min-h-screen">
        <LoadingScreen loading />
      </div>
    )
  }

  if (auth.user) {
    return <Navigate to={nextPath} replace state={{ from: location.pathname }} />
  }

  return (
    <div className="aurora-bg min-h-screen">
      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[1fr,420px] lg:items-center">
        <div className="glass rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Onyx account center</p>
          <h1 className="mt-2 text-4xl font-semibold text-white">One authentication flow for buyers and sellers</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Register once, choose your role, and access marketplace bidding, seller studio publishing, and full account analytics.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Feature label="Role-based access" value="Buyer / Seller" />
            <Feature label="Session mode" value="HttpOnly JWT" />
            <Feature label="Credits ready" value="ONX funded" />
          </div>
        </div>
        <AuthPanel
          onLogin={auth.login}
          onRegister={auth.register}
          error={auth.error}
          title="Sign in or create account"
          subtitle="Register as buyer or seller in this same form."
        />
      </section>
    </div>
  )
}

function Feature ({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-3">
      <p className="text-[11px] uppercase tracking-[0.15em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-cyan-100">{value}</p>
    </div>
  )
}
