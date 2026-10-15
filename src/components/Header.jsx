import { useEffect, useState } from 'react'
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi'
import { useLang } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { profile } from '../data/portfolio'
import { SECTIONS, scrollToSection } from '../utils/sections'
import { openPacman } from '../utils/pacman'
import { IoGameControllerOutline } from 'react-icons/io5'

export default function Header() {
  const { t, lang, toggle } = useLang()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('sobre')

  // Destaca no menu a seção visível enquanto a página rola
  useEffect(() => {
    const update = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      if (atBottom) return setActive(SECTIONS[SECTIONS.length - 1])
      const line = window.innerHeight * 0.4
      let current = SECTIONS[0]
      for (const id of SECTIONS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      setActive(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const labels = { sobre: t.nav.about, projetos: t.nav.projects, experiencias: t.nav.experiences, contato: t.nav.contact }

  const go = (e, id) => {
    e.preventDefault()
    setOpen(false)
    scrollToSection(id)
  }

  const initials = profile.name.replace(/\[.*?\]/g, '').trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join('')

  return (
    <header className="header">
      <div className="container header-inner">
        <a href="#sobre" className="brand" onClick={(e) => go(e, 'sobre')}>{initials || 'Dev'}<span>.</span></a>

        <nav className={`nav ${open ? 'open' : ''}`} aria-label="Menu principal">
          {SECTIONS.map((id) => (
            <a key={id} href={`#${id}`} className={active === id ? 'active' : ''} aria-current={active === id ? 'true' : undefined} onClick={(e) => go(e, id)}>
              {labels[id]}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button className="theme-btn" onClick={openPacman} aria-label={t.pacman.open} title={t.pacman.open}>
            <IoGameControllerOutline />
          </button>
          <button className="theme-btn" onClick={toggleTheme} aria-label={theme === 'dark' ? t.theme.toLight : t.theme.toDark} title={theme === 'dark' ? t.theme.toLight : t.theme.toDark}>
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
          <button className="lang-btn" onClick={toggle} aria-label="Mudar idioma / Change language">
            <span className={lang === 'pt' ? 'on' : ''}>PT</span>/<span className={lang === 'en' ? 'on' : ''}>EN</span>
          </button>
          <button className="menu-btn" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  )
}
