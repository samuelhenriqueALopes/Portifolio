import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

function initialTheme() {
  try {
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') return saved
  } catch { /* localStorage indisponível */ }
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function initialGalo() {
  try { return localStorage.getItem('galo') === 'on' } catch { return false }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(initialTheme)
  const [galo, setGalo] = useState(initialGalo)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('theme', theme) } catch { /* ignore */ }
  }, [theme])

  // Modo Galo: deixa o site preto e branco
  useEffect(() => {
    document.documentElement.dataset.galo = galo ? 'on' : 'off'
    try { localStorage.setItem('galo', galo ? 'on' : 'off') } catch { /* ignore */ }
  }, [galo])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  const toggleGalo = () => setGalo((g) => !g)

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, galo, toggleGalo }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
