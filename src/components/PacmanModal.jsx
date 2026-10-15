import { useCallback, useEffect, useRef, useState } from 'react'
import { FiX, FiRotateCcw, FiPause, FiPlay, FiChevronUp, FiChevronDown, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useLang } from '../context/LanguageContext'
import { createGame, step, setDirection, togglePause } from '../game/pacman'
import { render, WIDTH, HEIGHT } from '../game/render'

const KEYS = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
  w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right',
}

function loadBest() {
  try { return Number(localStorage.getItem('pacman-best')) || 0 } catch { return 0 }
}

export default function PacmanModal({ onClose }) {
  const { t } = useLang()
  const pm = t.pacman
  const canvasRef = useRef(null)
  const dialogRef = useRef(null)
  const gameRef = useRef(createGame())
  const labelsRef = useRef(pm)
  const swipeRef = useRef(null)
  const [hud, setHud] = useState({ score: 0, lives: 3, level: 1, state: 'ready' })
  const [savedBest] = useState(loadBest)
  const best = Math.max(savedBest, hud.score)

  useEffect(() => { labelsRef.current = pm }, [pm])

  const restart = useCallback(() => { gameRef.current = createGame() }, [])
  const pause = useCallback(() => togglePause(gameRef.current), [])
  const move = (dir) => setDirection(gameRef.current, dir)

  // Laço do jogo
  useEffect(() => {
    const canvas = canvasRef.current
    const dpr = window.devicePixelRatio || 1
    canvas.width = WIDTH * dpr
    canvas.height = HEIGHT * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    let last = performance.now()
    let frame
    let prevHud = ''
    const loop = (now) => {
      const g = gameRef.current
      step(g, Math.min((now - last) / 1000, 0.05))
      last = now
      render(ctx, g, labelsRef.current)

      const key = `${g.score}|${g.lives}|${g.level}|${g.state}`
      if (key !== prevHud) {
        prevHud = key
        setHud({ score: g.score, lives: g.lives, level: g.level, state: g.state })
      }
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [])

  // Recorde salvo no navegador
  useEffect(() => {
    if (best > savedBest) {
      try { localStorage.setItem('pacman-best', String(best)) } catch { /* ignore */ }
    }
  }, [best, savedBest])

  // Teclado, rolagem da página e foco
  useEffect(() => {
    const previousFocus = document.activeElement
    dialogRef.current?.focus()
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e) => {
      const g = gameRef.current
      if (KEYS[e.key]) { e.preventDefault(); setDirection(g, KEYS[e.key]) }
      else if (e.key === 'Escape') { e.preventDefault(); onClose() }
      else if (e.key === 'p' || e.key === 'P' || e.key === ' ') { e.preventDefault(); togglePause(g) }
      else if (e.key === 'Enter' && g.state === 'gameover') { e.preventDefault(); restart() }
    }
    const onHide = () => { if (document.hidden && gameRef.current.state === 'playing') togglePause(gameRef.current) }

    window.addEventListener('keydown', onKey)
    document.addEventListener('visibilitychange', onHide)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('visibilitychange', onHide)
      document.body.style.overflow = prevOverflow
      previousFocus?.focus?.()
    }
  }, [onClose, restart])

  // Deslizar o dedo no jogo muda a direção
  const onPointerDown = (e) => { swipeRef.current = { x: e.clientX, y: e.clientY } }
  const onPointerMove = (e) => {
    const s = swipeRef.current
    if (!s) return
    const dx = e.clientX - s.x
    const dy = e.clientY - s.y
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return
    move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'))
    swipeRef.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerUp = () => { swipeRef.current = null }

  const paused = hud.state === 'paused'

  return (
    <div className="pm-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="pm-dialog" role="dialog" aria-modal="true" aria-labelledby="pm-title" tabIndex={-1} ref={dialogRef}>
        <div className="pm-head">
          <h2 id="pm-title">{pm.title}</h2>
          <button className="pm-icon" onClick={onClose} aria-label={pm.close}><FiX /></button>
        </div>

        <div className="pm-hud" aria-live="polite">
          <span>{pm.score} <strong>{hud.score}</strong></span>
          <span>{pm.best} <strong>{best}</strong></span>
          <span>{pm.level} <strong>{hud.level}</strong></span>
          <span className="pm-lives" aria-label={`${pm.lives}: ${hud.lives}`}>
            {Array.from({ length: Math.max(hud.lives, 0) }, (_, i) => <i key={i} />)}
          </span>
        </div>

        <canvas
          ref={canvasRef}
          className="pm-canvas"
          style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          aria-label={pm.help}
        />

        <div className="pm-pad">
          <button onPointerDown={() => move('up')} aria-label={pm.up} className="up"><FiChevronUp /></button>
          <button onPointerDown={() => move('left')} aria-label={pm.left} className="left"><FiChevronLeft /></button>
          <button onPointerDown={() => move('right')} aria-label={pm.right} className="right"><FiChevronRight /></button>
          <button onPointerDown={() => move('down')} aria-label={pm.down} className="down"><FiChevronDown /></button>
        </div>

        <div className="pm-actions">
          <button className="btn btn-outline btn-sm" onClick={restart}><FiRotateCcw /> {pm.restart}</button>
          <button className="btn btn-outline btn-sm" onClick={pause} disabled={!['playing', 'paused'].includes(hud.state)}>
            {paused ? <><FiPlay /> {pm.resume}</> : <><FiPause /> {pm.pause}</>}
          </button>
        </div>
        <p className="pm-help">{pm.help}</p>
      </div>
    </div>
  )
}
