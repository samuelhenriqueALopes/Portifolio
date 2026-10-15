import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import About from './pages/About'
import Projects from './pages/Projects'
import Experiences from './pages/Experiences'
import Contact from './pages/Contact'
import { scrollToSection, sectionFromHash } from './utils/sections'
import { PACMAN_EVENT } from './utils/pacman'

// O jogo só é baixado quando alguém abre
const PacmanModal = lazy(() => import('./components/PacmanModal'))

export default function App() {
  const [gameOpen, setGameOpen] = useState(false)
  const closeGame = useCallback(() => setGameOpen(false), [])

  // Abre direto na seção do link (ex.: .../#projetos)
  useEffect(() => {
    const id = sectionFromHash()
    if (id && id !== 'sobre') requestAnimationFrame(() => scrollToSection(id, { smooth: false }))
  }, [])

  useEffect(() => {
    const open = () => setGameOpen(true)
    window.addEventListener(PACMAN_EVENT, open)
    return () => window.removeEventListener(PACMAN_EVENT, open)
  }, [])

  return (
    <div className="layout">
      <Header />
      <main className="content">
        <section id="sobre" className="page-section"><About /></section>
        <section id="projetos" className="page-section"><Projects /></section>
        <section id="experiencias" className="page-section"><Experiences /></section>
        <section id="contato" className="page-section"><Contact /></section>
      </main>
      <Footer />
      {gameOpen && (
        <Suspense fallback={null}>
          <PacmanModal onClose={closeGame} />
        </Suspense>
      )}
    </div>
  )
}
