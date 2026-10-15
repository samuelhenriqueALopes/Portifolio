import { useLang } from '../context/LanguageContext'
import { profile } from '../data/portfolio'
import SocialLinks from './SocialLinks'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>© {new Date().getFullYear()} {profile.name}. {t.footer}</p>
        <SocialLinks />
      </div>
    </footer>
  )
}
