import { FiBriefcase } from 'react-icons/fi'
import { useLang } from '../context/LanguageContext'
import { experiences } from '../data/portfolio'
import Reveal from '../components/Reveal'

export default function Experiences() {
  const { t, lang } = useLang()
  return (
    <div className="container">
      <h2 className="page-title">{t.experiences.title}</h2>
      <div className="exp-grid">
        {experiences.map((e, i) => (
          <Reveal as="article" key={e.company + e.role.pt} className="card exp" delay={i * 0.08}>
            <div className="exp-icon"><FiBriefcase /></div>
            <div>
              {e.current && <span className="badge">{t.experiences.current}</span>}
              <h2>{e.role[lang]}</h2>
              <p className="exp-company">{e.company}</p>
              <p className="exp-period">{e.period[lang]}</p>
              <p>{e.description[lang]}</p>
              {e.systems && (
                <>
                  <p className="exp-label">{t.experiences.systems}</p>
                  <ul className="tags">{e.systems.map((s) => <li key={s}>{s}</li>)}</ul>
                </>
              )}
              {e.image && (
                <figure className="exp-figure">
                  <img src={e.image} alt={e.caption?.[lang] || e.company} loading="lazy" />
                  {e.caption && <figcaption>{e.caption[lang]}</figcaption>}
                </figure>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
