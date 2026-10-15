import { useEffect, useState } from 'react'
import { FiGithub, FiBox, FiUsers, FiCalendar } from 'react-icons/fi'
import { useLang } from '../context/LanguageContext'
import { contacts } from '../data/portfolio'

const USER = contacts.github.replace(/\/+$/, '').split('/').pop()
const CACHE_KEY = `gh-stats-${USER}`
const CACHE_MS = 60 * 60 * 1000

async function loadStats() {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY))
    if (cached && Date.now() - cached.at < CACHE_MS) return cached.data
  } catch { /* cache indisponível */ }

  const [user, repos] = await Promise.all([
    fetch(`https://api.github.com/users/${USER}`).then((r) => { if (!r.ok) throw new Error(r.status); return r.json() }),
    fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`).then((r) => { if (!r.ok) throw new Error(r.status); return r.json() }),
  ])

  const own = repos.filter((r) => !r.fork)
  const counts = {}
  own.forEach((r) => { if (r.language) counts[r.language] = (counts[r.language] || 0) + 1 })
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1
  const languages = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, n]) => ({ name, pct: Math.round((n / total) * 100) }))

  const data = {
    repos: user.public_repos,
    followers: user.followers,
    since: user.created_at,
    languages,
    recent: own.slice(0, 4).map((r) => ({ name: r.name, url: r.html_url, language: r.language, updated: r.pushed_at })),
  }
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data })) } catch { /* ignore */ }
  return data
}

const LANG_COLORS = { Java: '#b07219', JavaScript: '#f1e05a', HTML: '#e34c26', CSS: '#663399', Python: '#3572A5', 'C++': '#f34b7d', C: '#555555', TypeScript: '#3178c6' }

export default function GitHubStats() {
  const { t, lang } = useLang()
  const g = t.github
  const [state, setState] = useState({ status: 'loading' })

  useEffect(() => {
    let alive = true
    loadStats()
      .then((data) => alive && setState({ status: 'ok', data }))
      .catch(() => alive && setState({ status: 'error' }))
    return () => { alive = false }
  }, [])

  const locale = lang === 'pt' ? 'pt-BR' : 'en-US'
  const fmt = (iso, opts) => new Date(iso).toLocaleDateString(locale, opts)

  return (
    <section className="card gh">
      <div className="gh-head">
        <h3><FiGithub /> {g.title}</h3>
        <a href={contacts.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">@{USER}</a>
      </div>

      {state.status === 'loading' && <p className="gh-msg">{g.loading}</p>}
      {state.status === 'error' && <p className="gh-msg">{g.error}</p>}

      {state.status === 'ok' && (
        <>
          <div className="gh-stats">
            <div><FiBox /><strong>{state.data.repos}</strong><span>{g.repos}</span></div>
            <div><FiUsers /><strong>{state.data.followers}</strong><span>{g.followers}</span></div>
            <div><FiCalendar /><strong>{fmt(state.data.since, { month: 'short', year: 'numeric' })}</strong><span>{g.since}</span></div>
          </div>

          <div className="gh-cols">
            <div>
              <p className="gh-label">{g.languages}</p>
              <div className="gh-bar">
                {state.data.languages.map((l) => (
                  <span key={l.name} style={{ width: `${l.pct}%`, background: LANG_COLORS[l.name] || 'var(--accent)' }} title={`${l.name} ${l.pct}%`} />
                ))}
              </div>
              <ul className="gh-legend">
                {state.data.languages.map((l) => (
                  <li key={l.name}><i style={{ background: LANG_COLORS[l.name] || 'var(--accent)' }} />{l.name} <span>{l.pct}%</span></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="gh-label">{g.recent}</p>
              <ul className="gh-recent">
                {state.data.recent.map((r) => (
                  <li key={r.name}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer">{r.name}</a>
                    <span>{r.language || '—'} · {fmt(r.updated, { day: '2-digit', month: 'short' })}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
