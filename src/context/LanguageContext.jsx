import { createContext, useContext, useEffect, useState } from 'react'
import { ui } from '../data/i18n'

const LanguageContext = createContext(null)

function initialLang() {
  try {
    const saved = localStorage.getItem('lang')
    if (saved === 'pt' || saved === 'en') return saved
  } catch { /* localStorage indisponível */ }
  return 'pt'
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
    try { localStorage.setItem('lang', lang) } catch { /* ignore */ }
  }, [lang])

  const toggle = () => setLang((l) => (l === 'pt' ? 'en' : 'pt'))

  return (
    <LanguageContext.Provider value={{ lang, toggle, t: ui[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
