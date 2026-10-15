import { FiMail, FiLinkedin, FiGithub, FiInstagram } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { contacts } from '../data/portfolio'

export default function SocialLinks({ large = false }) {
  const items = [
    { href: `mailto:${contacts.email}`, icon: <FiMail />, label: 'E-mail' },
    contacts.whatsapp && { href: `https://wa.me/${contacts.whatsapp}`, icon: <FaWhatsapp />, label: 'WhatsApp' },
    contacts.linkedin && { href: contacts.linkedin, icon: <FiLinkedin />, label: 'LinkedIn' },
    contacts.github && { href: contacts.github, icon: <FiGithub />, label: 'GitHub' },
    contacts.instagram && { href: contacts.instagram, icon: <FiInstagram />, label: 'Instagram' },
  ].filter(Boolean)

  return (
    <ul className={`social ${large ? 'large' : ''}`}>
      {items.map((i) => (
        <li key={i.label}>
          <a href={i.href} target="_blank" rel="noopener noreferrer" aria-label={i.label} title={i.label}>
            {i.icon}
            {large && <span>{i.label}</span>}
          </a>
        </li>
      ))}
    </ul>
  )
}
