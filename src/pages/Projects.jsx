import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiGithub, FiYoutube, FiStar } from 'react-icons/fi'
import { useLang } from '../context/LanguageContext'
import { projects } from '../data/portfolio'
import GitHubStats from '../components/GitHubStats'
import Reveal from '../components/Reveal'

function formatDate(ym, lang) {
  const [y, m] = ym.split('-').map(Number)
  return new Date(y, (m || 1) - 1).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', { month: 'short', year: 'numeric' })
}

export default function Projects() {
  const { t, lang } = useLang()
  const [filter, setFilter] = useState(null)

  const sorted = useMemo(() => [...projects].sort((a, b) => a.date.localeCompare(b.date)), [])
  const techs = useMemo(() => [...new Set(projects.flatMap((p) => p.technologies))].sort(), [])
  const visible = filter ? sorted.filter((p) => p.technologies.includes(filter)) : sorted

  return (
    <div className="container">
      <h2 className="page-title">{t.projects.title}</h2>
      <p className="page-subtitle">{t.projects.subtitle}</p>

      <div className="filters">
        <button className={!filter ? 'on' : ''} onClick={() => setFilter(null)}>{t.projects.all}</button>
        {techs.map((tech) => (
          <button key={tech} className={filter === tech ? 'on' : ''} onClick={() => setFilter(tech)}>{tech}</button>
        ))}
      </div>

      <ol className="timeline">
        <AnimatePresence initial={false}>
          {visible.map((p) => (
            <motion.li
              key={p.name}
              className="timeline-item"
              layout
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              <span className="timeline-dot" />
              <time className="timeline-date">{formatDate(p.date, lang)}</time>
              <article className="card project">
                <div className="project-media">
                  <img src={p.image} alt={p.name} loading="lazy" style={{ objectPosition: p.imagePosition }} onError={(e) => { e.currentTarget.style.display = 'none' }} />
                </div>
                <div className="project-body">
                  {p.featured && <span className="badge"><FiStar /> {t.projects.featured}</span>}
                  <h2>{p.name}</h2>
                  <p>{p.description[lang]}</p>
                  <ul className="tags">{p.technologies.map((tech) => <li key={tech}>{tech}</li>)}</ul>
                  <div className="project-links">
                    {p.repo && (
                      <a href={p.repo} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                        <FiGithub /> {t.projects.repo}
                      </a>
                    )}
                    {p.video && (
                      <a href={p.video} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                        <FiYoutube /> {t.projects.video}
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>

      <Reveal>
        <GitHubStats />
      </Reveal>
    </div>
  )
}
