import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LoadingScreen } from '../components/loading-screen'
import { apiRequest } from '../api/client'
import { useAuth } from '../hooks/use-auth'
import { formatCurrency, formatTimeLeft } from '../lib/format'
import { useSecondTick } from '../hooks/use-second-tick'

const defaultUserFilters = {
  search: '',
  role: '',
  isActive: ''
}

const defaultAuctionFilters = {
  search: '',
  status: '',
  sellerId: ''
}

export function AdminPage () {
  const auth = useAuth()
  const nowMs = useSecondTick(true)
  const bootstrappedRef = useRef(false)
  const [dashboard, setDashboard] = useState(null)
  const [users, setUsers] = useState([])
  const [usersMeta, setUsersMeta] = useState(null)
  const [auctions, setAuctions] = useState([])
  const [auctionsMeta, setAuctionsMeta] = useState(null)
  const [userFilters, setUserFilters] = useState(defaultUserFilters)
  const [auctionFilters, setAuctionFilters] = useState(defaultAuctionFilters)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [systemConnected, setSystemConnected] = useState(null)
  const [savingUserId, setSavingUserId] = useState('')
  const [cancellingAuctionId, setCancellingAuctionId] = useState('')
  const [notice, setNotice] = useState('')
  const [userDrafts, setUserDrafts] = useState({})
  const filtersPrimedRef = useRef(false)

  const loadDashboard = useCallback(async () => {
    const payload = await apiRequest('/admin/dashboard')
    setDashboard(payload.data)
    setSystemConnected(Boolean(payload.data.system?.databaseConnected))
  }, [])

  const loadUsers = useCallback(async () => {
    const params = new URLSearchParams()
    params.set('page', '1')
    params.set('limit', '12')
    params.set('sortBy', 'createdAt')
    params.set('sortOrder', 'desc')
    if (userFilters.search.trim()) params.set('search', userFilters.search.trim())
    if (userFilters.role) params.set('role', userFilters.role)
    if (userFilters.isActive !== '') params.set('isActive', userFilters.isActive)

    const payload = await apiRequest(`/admin/users?${params.toString()}`)
    setUsers(payload.data)
    setUsersMeta(payload.meta)
  }, [userFilters])

  const loadAuctions = useCallback(async () => {
    const params = new URLSearchParams()
    params.set('page', '1')
    params.set('limit', '12')
    params.set('sortBy', 'createdAt')
    params.set('sortOrder', 'desc')
    if (auctionFilters.search.trim()) params.set('search', auctionFilters.search.trim())
    if (auctionFilters.status) params.set('status', auctionFilters.status)
    if (auctionFilters.sellerId.trim()) params.set('sellerId', auctionFilters.sellerId.trim())

    const payload = await apiRequest(`/admin/auctions?${params.toString()}`)
    setAuctions(payload.data)
    setAuctionsMeta(payload.meta)
  }, [auctionFilters])

  const loadAll = useCallback(async () => {
    try {
      setError('')
      setLoading(true)
      await Promise.all([loadDashboard(), loadUsers(), loadAuctions()])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [loadAuctions, loadDashboard, loadUsers])

  useEffect(() => {
    if (!auth.user || auth.user.role !== 'admin') return
    if (bootstrappedRef.current) return
    bootstrappedRef.current = true
    void loadAll()
  }, [auth.user, loadAll])

  useEffect(() => {
    if (!auth.user || auth.user.role !== 'admin') return
    setUserDrafts((prev) => {
      const next = {}
      for (const user of users) {
        next[user.id] = prev[user.id] || {
          fullName: user.fullName || '',
          role: user.role || 'buyer',
          isActive: Boolean(user.isActive),
          onyxCredits: String(user.onyxCredits ?? 0),
          avatarUrl: user.profile?.avatarUrl || '',
          phone: user.profile?.phone || ''
        }
      }
      return next
    })
  }, [users, auth.user])

  useEffect(() => {
    if (!auth.user || auth.user.role !== 'admin' || !bootstrappedRef.current) return
    if (!filtersPrimedRef.current) {
      filtersPrimedRef.current = true
      return
    }
    const refreshLists = async () => {
      try {
        setError('')
        await Promise.all([loadUsers(), loadAuctions()])
      } catch (err) {
        setError(err.message)
      }
    }

    void refreshLists()
  }, [loadUsers, loadAuctions, auth.user, userFilters, auctionFilters])

  if (auth.loading) {
    return (
      <div className="aurora-bg min-h-screen">
        <LoadingScreen loading />
      </div>
    )
  }

  if (!auth.user) {
    return <Navigate to="/auth?next=/admin" replace />
  }

  if (auth.user.role !== 'admin') {
    return <Navigate to="/profile" replace />
  }

  async function saveUser (userId) {
    setSavingUserId(userId)
    setError('')
    setNotice('')
    try {
      const row = users.find((item) => item.id === userId)
      const draft = userDrafts[userId] || (row ? {
        fullName: row.fullName || '',
        role: row.role || 'buyer',
        isActive: Boolean(row.isActive),
        onyxCredits: String(row.onyxCredits ?? 0),
        avatarUrl: row.profile?.avatarUrl || '',
        phone: row.profile?.phone || ''
      } : null)
      if (!draft) {
        throw new Error('User draft is not ready')
      }
      const payload = await apiRequest(`/admin/users/${userId}`, {
        method: 'PATCH',
        body: {
          fullName: draft.fullName.trim(),
          role: draft.role,
          isActive: draft.isActive,
          onyxCredits: Number(draft.onyxCredits),
          profile: {
            avatarUrl: draft.avatarUrl.trim() || null,
            phone: draft.phone.trim() || null
          }
        }
      })
      setUserDrafts((prev) => ({
        ...prev,
        [userId]: {
          fullName: payload.data.user.fullName || '',
          role: payload.data.user.role || 'buyer',
          isActive: Boolean(payload.data.user.isActive),
          onyxCredits: String(payload.data.user.onyxCredits ?? 0),
          avatarUrl: payload.data.user.profile?.avatarUrl || '',
          phone: payload.data.user.profile?.phone || ''
        }
      }))
      setNotice('User updated.')
      await Promise.all([loadDashboard(), loadUsers()])
      await auth.refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingUserId('')
    }
  }

  async function cancelAuction (auctionId) {
    setCancellingAuctionId(auctionId)
    setError('')
    setNotice('')
    try {
      await apiRequest(`/admin/auctions/${auctionId}/cancel`, { method: 'PATCH' })
      setNotice('Auction cancelled.')
      await Promise.all([loadDashboard(), loadAuctions(), auth.refresh()])
    } catch (err) {
      setError(err.message)
    } finally {
      setCancellingAuctionId('')
    }
  }

  const summaryCards = [
    { label: 'Users', value: dashboard?.summary?.totalUsers || 0 },
    { label: 'Active auctions', value: dashboard?.summary?.activeAuctions || 0 },
    { label: 'Total bids', value: dashboard?.summary?.totalBids || 0 },
    { label: 'Admins', value: dashboard?.summary?.admins || 0 }
  ]

  return (
    <div className="aurora-bg min-h-screen">
      <section className="mx-auto w-full max-w-7xl px-4 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Admin console</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">Control room</h1>
            <p className="mt-3 max-w-3xl text-slate-300">
              Manage users, moderate auctions, and keep the marketplace stable from one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/marketplace" className="rounded-xl border border-cyan-300/30 px-3 py-2 text-xs text-cyan-200 hover:bg-cyan-400/10">
              Marketplace
            </Link>
            <Link to="/live" className="rounded-xl border border-white/20 px-3 py-2 text-xs text-slate-200 hover:bg-white/10">
              Live floor
            </Link>
            <Link to="/finished" className="rounded-xl border border-white/20 px-3 py-2 text-xs text-slate-200 hover:bg-white/10">
              Finished reports
            </Link>
          </div>
        </div>

        {loading ? <div className="mt-6 loader-spin" /> : null}
        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
        {notice ? <p className="mt-4 text-sm text-emerald-300">{notice}</p> : null}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-4"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{card.label}</p>
              <p className="mt-1 text-3xl font-semibold text-white">{card.value}</p>
            </motion.div>
          ))}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Database</p>
            <p className={`mt-1 text-sm font-semibold ${systemConnected ? 'text-emerald-200' : 'text-rose-200'}`}>
              {systemConnected ? 'Connected' : 'Unavailable'}
            </p>
          </motion.div>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[1fr,1fr]">
          <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">Recent users</h2>
                <p className="text-sm text-slate-400">Edit access, status, and credits.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  value={userFilters.search}
                  onChange={(e) => setUserFilters((prev) => ({ ...prev, search: e.target.value }))}
                  className="rounded-xl border border-white/15 bg-black/25 px-3 py-2 text-xs text-white outline-none"
                  placeholder="Search"
                />
                <select
                  value={userFilters.role}
                  onChange={(e) => setUserFilters((prev) => ({ ...prev, role: e.target.value }))}
                  className="rounded-xl border border-white/15 bg-black/25 px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="">All roles</option>
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </select>
                <select
                  value={userFilters.isActive}
                  onChange={(e) => setUserFilters((prev) => ({ ...prev, isActive: e.target.value }))}
                  className="rounded-xl border border-white/15 bg-black/25 px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="">Any status</option>
                  <option value="true">Active</option>
                  <option value="false">Disabled</option>
                </select>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {users.map((user) => {
                const draft = userDrafts[user.id] || {
                  fullName: user.fullName || '',
                  role: user.role || 'buyer',
                  isActive: Boolean(user.isActive),
                  onyxCredits: String(user.onyxCredits ?? 0),
                  avatarUrl: user.profile?.avatarUrl || '',
                  phone: user.profile?.phone || ''
                }
                const isSelf = String(user.id) === String(auth.user.id)
                return (
                  <div key={user.id} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <div className="grid gap-3 md:grid-cols-[1.2fr,repeat(4,minmax(0,1fr))]">
                      <div>
                        <p className="text-sm font-semibold text-white">{user.fullName}</p>
                        <p className="mt-1 text-xs text-slate-400">{user.email}</p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">{user.id}</p>
                        {isSelf ? (
                          <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-cyan-200">Current admin</p>
                        ) : null}
                      </div>
                      <label className="space-y-1">
                        <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Role</span>
                        <select
                          value={draft.role}
                          disabled={isSelf}
                          onChange={(e) => {
                            setUserDrafts((prev) => ({
                              ...prev,
                              [user.id]: { ...(prev[user.id] || draft), role: e.target.value }
                            }))
                          }}
                          className="w-full rounded-xl border border-white/15 bg-black/25 px-3 py-2 text-sm text-white outline-none"
                        >
                          <option value="buyer">Buyer</option>
                          <option value="seller">Seller</option>
                          <option value="admin">Admin</option>
                        </select>
                      </label>
                      <label className="space-y-1">
                        <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Status</span>
                        <select
                          value={String(draft.isActive)}
                          disabled={isSelf}
                          onChange={(e) => {
                            setUserDrafts((prev) => ({
                              ...prev,
                              [user.id]: { ...(prev[user.id] || draft), isActive: e.target.value === 'true' }
                            }))
                          }}
                          className="w-full rounded-xl border border-white/15 bg-black/25 px-3 py-2 text-sm text-white outline-none"
                        >
                          <option value="true">Active</option>
                          <option value="false">Disabled</option>
                        </select>
                      </label>
                      <label className="space-y-1">
                        <span className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Credits</span>
                        <input
                          type="number"
                          min={0}
                          step="1"
                          value={draft.onyxCredits}
                          onChange={(e) => {
                            setUserDrafts((prev) => ({
                              ...prev,
                              [user.id]: { ...(prev[user.id] || draft), onyxCredits: e.target.value }
                            }))
                          }}
                          className="w-full rounded-xl border border-white/15 bg-black/25 px-3 py-2 text-sm text-white outline-none"
                        />
                      </label>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                      <span>{formatCurrency(user.onyxCredits, 'ONX')}</span>
                      <span>{user.isActive ? 'Active' : 'Disabled'}</span>
                      <span>{user.role}</span>
                      <span>{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never logged in'}</span>
                      <button
                        onClick={() => saveUser(user.id)}
                        disabled={savingUserId === user.id}
                        className="rounded-xl bg-cyan-400 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-950 disabled:opacity-60"
                      >
                        {savingUserId === user.id ? 'Saving...' : 'Save user'}
                      </button>
                    </div>
                  </div>
                )
              })}
              {!users.length ? <p className="text-sm text-slate-400">No users found.</p> : null}
              {usersMeta ? (
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Page {usersMeta.page} of {usersMeta.totalPages} · {usersMeta.total} total
                </p>
              ) : null}
            </div>
          </motion.section>

          <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">Auction moderation</h2>
                <p className="text-sm text-slate-400">Cancel risky lots or inspect live inventory.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  value={auctionFilters.search}
                  onChange={(e) => setAuctionFilters((prev) => ({ ...prev, search: e.target.value }))}
                  className="rounded-xl border border-white/15 bg-black/25 px-3 py-2 text-xs text-white outline-none"
                  placeholder="Search title"
                />
                <select
                  value={auctionFilters.status}
                  onChange={(e) => setAuctionFilters((prev) => ({ ...prev, status: e.target.value }))}
                  className="rounded-xl border border-white/15 bg-black/25 px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="">All statuses</option>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="ended">Ended</option>
                  <option value="settled">Settled</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {auctions.map((auction) => (
                <div key={auction.id} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="line-clamp-1 text-sm font-semibold text-white">{auction.title}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {auction.seller?.fullName || 'Unknown seller'} · {auction.category || 'Cyber Gear'}
                      </p>
                    </div>
                    <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-[10px] uppercase tracking-wider text-cyan-100">
                      {auction.status}
                    </span>
                  </div>
                  <div className="mt-3 grid gap-2 text-xs text-slate-300 sm:grid-cols-3">
                    <span>{formatCurrency(auction.currentBid, auction.currency)}</span>
                    <span>{new Date(auction.endTime).toLocaleString()}</span>
                    <span>{formatTimeLeft(auction.endTime, nowMs)}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      to={`/auctions/${auction.id}`}
                      className="rounded-xl border border-white/20 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-slate-200 hover:bg-white/10"
                    >
                      View report
                    </Link>
                    {(auction.status === 'active' || auction.status === 'draft') ? (
                      <button
                        onClick={() => cancelAuction(auction.id)}
                        disabled={cancellingAuctionId === auction.id}
                        className="rounded-xl border border-rose-400/30 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-rose-200 hover:bg-rose-400/10 disabled:opacity-60"
                      >
                        {cancellingAuctionId === auction.id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
              {!auctions.length ? <p className="text-sm text-slate-400">No auctions found.</p> : null}
              {auctionsMeta ? (
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Page {auctionsMeta.page} of {auctionsMeta.totalPages} · {auctionsMeta.total} total
                </p>
              ) : null}
            </div>
          </motion.section>
        </div>

        <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mt-5 glass rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-white">Recent activity</h2>
          <div className="mt-4 grid gap-4 xl:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Recent users</p>
              <div className="mt-3 space-y-2">
                {(dashboard?.recentUsers || []).map((user) => (
                  <div key={user.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <p className="text-sm text-white">{user.fullName}</p>
                    <p className="text-xs text-slate-400">{user.email} · {user.role}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Recent auctions</p>
              <div className="mt-3 space-y-2">
                {(dashboard?.recentAuctions || []).map((auction) => (
                  <div key={auction.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <p className="text-sm text-white">{auction.title}</p>
                    <p className="text-xs text-slate-400">{auction.seller?.fullName || 'Unknown seller'} · {auction.status}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Recent bids</p>
              <div className="mt-3 space-y-2">
                {(dashboard?.recentBids || []).map((bid) => (
                  <div key={bid.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
                    <p className="text-sm text-white">{bid.bidderName}</p>
                    <p className="text-xs text-slate-400">
                      {bid.auctionTitle} · {formatCurrency(bid.bidAmount, bid.currency)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      </section>
    </div>
  )
}
