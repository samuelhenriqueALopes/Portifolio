import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiCalendar, FiMapPin, FiExternalLink } from 'react-icons/fi'
import { useLang } from '../context/LanguageContext'
import { loadGaloMatches, galoResult } from '../services/galo'

function Team({ team, side }) {
  return (
    <span className={`gm-team ${side} ${team.isGalo ? 'galo' : ''}`}>
      {team.logo && <img src={team.logo} alt="" width="22" height="22" loading="lazy" />}
      <span className="gm-abbr" title={team.name}>{team.abbr}</span>
    </span>
  )
}

function Match({ m, lang, labels }) {
  const locale = lang === 'pt' ? 'pt-BR' : 'en-US'
  const date = new Date(m.date)
  const day = date.toLocaleDateString(locale, { weekday: 'short', day: '2-digit', month: 'short', timeZone: 'America/Sao_Paulo' })
  const time = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })
  const played = m.state !== 'pre'
  const result = m.state === 'post' ? galoResult(m) : null
  const score = (t) => `${t.score ?? ''}${t.shootout != null ? ` (${t.shootout})` : ''}`

  return (
    <li className="gm-match">
      <div className="gm-meta">
        <span>{m.competition}</span>
        <span>
          {m.state === 'in' ? <strong className="gm-live">{labels.live}</strong> : <><FiCalendar /> {day} · {time}</>}
        </span>
      </div>
      <div className="gm-line">
        <Team team={m.home} side="home" />
        <span className="gm-score">
          {played ? <>{score(m.home)} <i>×</i> {score(m.away)}</> : <i>×</i>}
        </span>
        <Team team={m.away} side="away" />
        {result && <span className={`gm-result ${result}`} title={labels.results[result]}>{labels.letters[result]}</span>}
      </div>
      {m.venue && <div className="gm-venue"><FiMapPin /> {m.venue}</div>}
    </li>
  )
}

export default function GaloMatches() {
  const { t, lang } = useLang()
  const g = t.galo
  const [state, setState] = useState({ status: 'loading' })

  useEffect(() => {
    let alive = true
    loadGaloMatches()
      .then((data) => alive && setState({ status: 'ok', data }))
      .catch(() => alive && setState({ status: 'error' }))
    return () => { alive = false }
  }, [])

  return (
    <motion.section
      className="card gm"
      aria-label={g.title}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="gm-inner">
        <h3 className="gm-title">{g.title}</h3>

        {state.status === 'loading' && <p className="gm-msg">{g.loading}</p>}
        {state.status === 'error' && <p className="gm-msg">{g.error}</p>}

        {state.status === 'ok' && (
          <div className="gm-cols">
            <div>
              <p className="gm-label">{g.next}</p>
              {state.data.upcoming.length
                ? <ul className="gm-list">{state.data.upcoming.map((m) => <Match key={m.id} m={m} lang={lang} labels={g} />)}</ul>
                : <p className="gm-msg">{g.none}</p>}
            </div>
            <div>
              <p className="gm-label">{g.last}</p>
              {state.data.past.length
                ? <ul className="gm-list">{state.data.past.map((m) => <Match key={m.id} m={m} lang={lang} labels={g} />)}</ul>
                : <p className="gm-msg">{g.none}</p>}
            </div>
          </div>
        )}

        <p className="gm-source">
          {g.source} · <a href="https://ge.globo.com/futebol/times/atletico-mg/" target="_blank" rel="noopener noreferrer">{g.more} <FiExternalLink /></a>
        </p>
      </div>
    </motion.section>
  )
}
