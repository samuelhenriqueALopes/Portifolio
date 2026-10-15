import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import GaloMatches from '../components/GaloMatches'
import Galo3D from '../components/Galo3D'
import { GiRooster } from 'react-icons/gi'
import { useLang } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { profile } from '../data/portfolio'
import SocialLinks from '../components/SocialLinks'
import Terminal from '../components/Terminal'
import Reveal from '../components/Reveal'
import { scrollToSection } from '../utils/sections'
import { openPacman } from '../utils/pacman'

const list = { hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.3 } } }
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }

export default function About() {
  const { t, lang } = useLang()
  const { galo, toggleGalo } = useTheme()
  const [photoOk, setPhotoOk] = useState(true)

  return (
    <div className="container">
      <section className="about">
        <motion.div
          className="about-photo"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {photoOk
            ? <img src={profile.photo} alt={profile.name} onError={() => setPhotoOk(false)} />
            : <div className="photo-placeholder">{profile.name.replace(/\[.*?\]/g, '').trim()[0] || '?'}</div>}
        </motion.div>

        <Reveal className="about-text" x={24} y={0}>
          <p className="eyebrow">{t.about.title}</p>
          <h1>{profile.name}</h1>
          <h2 className="role">{profile.role[lang]}</h2>
          {profile.about[lang].map((p, i) => <p key={i}>{p}</p>)}

          <h3>{t.about.skills}</h3>
          <motion.ul className="tags" variants={list} initial="hidden" animate="show">
            {profile.skills.map((s) => <motion.li key={s} variants={item}>{s}</motion.li>)}
          </motion.ul>

          <div className="galo-ask">
            <p className="galo-question">{t.about.galoQuestion}</p>
            <button className="galo-btn" onClick={toggleGalo} aria-pressed={galo} title={t.about.galoHint}>
              <GiRooster /> {galo ? t.about.galoCheer : t.about.galo}
            </button>
          </div>

          <div className="about-actions">
            <a href="#projetos" className="btn" onClick={(e) => { e.preventDefault(); scrollToSection('projetos') }}>{t.about.cta}</a>
            {profile.cv && <a href={profile.cv} className="btn btn-outline" download>{t.about.cv}</a>}
            <button type="button" className="btn pac-btn" onClick={openPacman}>
              <span className="pac-icon" aria-hidden="true" />
              <span className="pac-dots" aria-hidden="true"><i /><i /><i /></span>
              {t.pacman.open}
            </button>
          </div>
          <SocialLinks />
        </Reveal>
      </section>

      {/* Modo Galo: cena 3D interativa + jogos do Atlético */}
      <AnimatePresence initial={false}>
        {galo && (
          <motion.div
            className="galo-zone"
            key="galo-zone"
            id="galo-zone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onAnimationStart={(def) => {
              if (def?.opacity === 1) document.getElementById('galo-zone')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          >
            <Galo3D />
            <GaloMatches />
          </motion.div>
        )}
      </AnimatePresence>

      <Reveal>
        <Terminal />
      </Reveal>
    </div>
  )
}
