import { useEffect, useRef, useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { profile, projects, experiences, contacts } from '../data/portfolio'
import { scrollToSection } from '../utils/sections'
import { openPacman } from '../utils/pacman'
import { loadGaloMatches, galoResult } from '../services/galo'

const ROUTES = {
  sobre: 'sobre', about: 'sobre', home: 'sobre', '~': 'sobre',
  projetos: 'projetos', projects: 'projetos',
  experiencias: 'experiencias', 'experiências': 'experiencias', experience: 'experiencias', exp: 'experiencias',
  contato: 'contato', contact: 'contato',
}

export default function Terminal() {
  const { t, lang, toggle } = useLang()
  const { theme, toggleTheme, galo, toggleGalo } = useTheme()
  const tt = t.terminal
  const [lines, setLines] = useState([{ type: 'out', text: tt.welcome }])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [hIndex, setHIndex] = useState(-1)
  const bodyRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight })
  }, [lines])

  const run = (raw) => {
    const cmd = raw.trim()
    const [name, ...args] = cmd.split(/\s+/)
    const c = name?.toLowerCase()
    const echo = { type: 'in', text: cmd }

    if (!c) return setLines((l) => [...l, echo])
    if (c === 'clear' || c === 'cls') return setLines([])

    let out = []
    switch (c) {
      case 'help': case 'ajuda':
        out = tt.help; break
      case 'whoami':
        out = [profile.name, profile.role[lang], ...profile.about[lang].slice(0, 1)]; break
      case 'skills': case 'habilidades':
        out = [profile.skills.join(' · ')]; break
      case 'projetos': case 'projects': case 'ls':
        out = [...projects].sort((a, b) => a.date.localeCompare(b.date)).map((p) => `${p.date}  ${p.name}`); break
      case 'exp': case 'experiencias': case 'experience':
        out = experiences.map((e) => `${e.period[lang].padEnd(22)} ${e.role[lang]} @ ${e.company}`); break
      case 'contato': case 'contact':
        out = [`email     ${contacts.email}`, `linkedin  ${contacts.linkedin}`, `github    ${contacts.github}`]; break
      case 'cd': {
        const target = ROUTES[(args[0] || '').toLowerCase()]
        if (target) { scrollToSection(target); out = [`→ ${target === 'sobre' ? '~' : `~/${target}`}`] } else out = [tt.cdUsage]
        break
      }
      case 'theme': case 'tema': {
        const next = theme === 'dark' ? 'light' : 'dark'
        toggleTheme(); out = [tt.themeChanged(next)]; break
      }
      case 'lang': case 'idioma':
        toggle(); out = [lang === 'pt' ? 'language: EN' : 'idioma: PT']; break
      case 'galo': case 'atletico': case 'atlético':
        toggleGalo(); out = [galo ? 'Modo Galo desligado.' : '🐓 Modo Galo ligado! Vamo, Galo! 🖤🤍']; break
      case 'jogos': case 'matches': {
        const locale = lang === 'pt' ? 'pt-BR' : 'en-US'
        const fmt = (m) => {
          const d = new Date(m.date).toLocaleString(locale, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })
          const score = m.state === 'pre' ? 'x' : `${m.home.score} x ${m.away.score}`
          const res = m.state === 'post' ? `  [${t.galo.letters[galoResult(m)] || '-'}]` : ''
          return `  ${d}  ${m.home.abbr.padEnd(4)} ${score.padEnd(5)} ${m.away.abbr.padEnd(4)} ${m.competition}${res}`
        }
        setLines((l) => [...l, echo, { type: 'out', text: t.galo.loading }])
        loadGaloMatches({ limit: 3 })
          .then(({ upcoming, past }) => setLines((l) => [...l,
            { type: 'out', text: `${t.galo.next}:` }, ...upcoming.map((m) => ({ type: 'out', text: fmt(m) })),
            { type: 'out', text: `${t.galo.last}:` }, ...past.map((m) => ({ type: 'out', text: fmt(m) })),
          ]))
          .catch(() => setLines((l) => [...l, { type: 'out', text: t.galo.error }]))
        return
      }
      case 'pacman': case 'play': case 'jogar':
        openPacman(); out = ['🟡 ᗧ···ᗣ']; break
      case 'sudo':
        out = [tt.sudo]; break
      case 'echo':
        out = [args.join(' ')]; break
      default:
        out = [tt.notFound(name)]
    }
    setLines((l) => [...l, echo, ...out.map((text) => ({ type: 'out', text }))])
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      run(input)
      if (input.trim()) setHistory((h) => [input, ...h])
      setInput(''); setHIndex(-1)
    } else if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault()
      const i = Math.min(hIndex + 1, history.length - 1)
      setHIndex(i); setInput(history[i])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const i = hIndex - 1
      setHIndex(Math.max(i, -1)); setInput(i >= 0 ? history[i] : '')
    }
  }

  const prompt = <span className="term-prompt">samuel@portfolio:~$</span>

  return (
    <section className="terminal" aria-label={tt.title} onClick={() => inputRef.current?.focus()}>
      <div className="term-bar">
        <i style={{ background: '#ff5f57' }} /><i style={{ background: '#febc2e' }} /><i style={{ background: '#28c840' }} />
        <span>{tt.title}</span>
      </div>
      <div className="term-body" ref={bodyRef} role="log" aria-live="polite">
        {lines.map((l, i) => (
          <div key={i} className={`term-line ${l.type}`}>
            {l.type === 'in' && <>{prompt} </>}{l.text}
          </div>
        ))}
        <div className="term-line in">
          {prompt}{' '}
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={tt.hint}
            aria-label={tt.hint}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
          />
        </div>
      </div>
    </section>
  )
}
