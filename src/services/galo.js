// Jogos do Atlético-MG pela API pública da ESPN (sem chave, com CORS liberado).
const TEAM_ID = '7632'
const BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer'
const COMPETITIONS = [
  ['bra.1', 'Brasileirão'],
  ['conmebol.libertadores', 'Libertadores'],
  ['conmebol.sudamericana', 'Sul-Americana'],
  ['bra.copa_do_brazil', 'Copa do Brasil'],
  ['bra.camp.mineiro', 'Campeonato Mineiro'],
]
const CACHE_KEY = 'galo-matches'
const CACHE_MS = 30 * 60 * 1000

const scoreOf = (s) => (s == null ? null : typeof s === 'object' ? s.displayValue ?? s.value : s)

function parseTeam(c) {
  return {
    name: c.team.shortDisplayName || c.team.displayName,
    abbr: c.team.abbreviation,
    logo: c.team.logos?.[0]?.href || c.team.logo,
    score: scoreOf(c.score),
    shootout: c.shootoutScore ?? null,
    isGalo: String(c.team.id) === TEAM_ID,
  }
}

function parseEvent(e, competition) {
  const c = e.competitions?.[0]
  if (!c) return null
  const home = c.competitors.find((x) => x.homeAway === 'home')
  const away = c.competitors.find((x) => x.homeAway === 'away')
  if (!home || !away) return null
  return {
    id: e.id,
    date: e.date,
    competition,
    venue: c.venue?.fullName || '',
    state: c.status?.type?.state, // pre | in | post
    completed: !!c.status?.type?.completed,
    detail: c.status?.type?.shortDetail || '',
    home: parseTeam(home),
    away: parseTeam(away),
  }
}

// V (vitória), E (empate) ou D (derrota) do ponto de vista do Galo
export function galoResult(m) {
  const galo = m.home.isGalo ? m.home : m.away
  const rival = m.home.isGalo ? m.away : m.home
  const a = Number(galo.score)
  const b = Number(rival.score)
  if (Number.isNaN(a) || Number.isNaN(b)) return null
  if (a !== b) return a > b ? 'W' : 'L'
  if (galo.shootout != null && rival.shootout != null) return Number(galo.shootout) > Number(rival.shootout) ? 'W' : 'L'
  return 'D'
}

export async function loadGaloMatches({ limit = 5 } = {}) {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY))
    if (cached && Date.now() - cached.at < CACHE_MS) return cached.data
  } catch { /* cache indisponível */ }

  const requests = COMPETITIONS.flatMap(([slug, name]) =>
    ['', '?fixture=true'].map((q) =>
      fetch(`${BASE}/${slug}/teams/${TEAM_ID}/schedule${q}`)
        .then((r) => { if (!r.ok) throw new Error(r.status); return r.json() })
        .then((json) => (json.events || []).map((e) => parseEvent(e, name)).filter(Boolean)),
    ),
  )
  const settled = await Promise.allSettled(requests)
  if (settled.every((s) => s.status === 'rejected')) throw new Error('Sem dados de jogos')

  const byId = new Map()
  settled.forEach((s) => { if (s.status === 'fulfilled') s.value.forEach((m) => byId.set(m.id, m)) })
  const all = [...byId.values()]

  const now = Date.now()
  const upcoming = all
    .filter((m) => m.state === 'in' || (m.state === 'pre' && new Date(m.date).getTime() > now - 3 * 3600e3))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, limit)
  const past = all
    .filter((m) => m.state === 'post' && m.completed)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit)

  const data = { upcoming, past }
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data })) } catch { /* ignore */ }
  return data
}
