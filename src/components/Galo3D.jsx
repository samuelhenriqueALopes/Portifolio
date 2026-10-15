import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'

export default function Galo3D() {
  const { t } = useLang()
  const g = t.galo3d
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const reduced = useReducedMotion()
  const [status, setStatus] = useState('loading')
  const [crows, setCrows] = useState(0)
  const [bubble, setBubble] = useState(null)

  useEffect(() => {
    let alive = true
    let bubbleTimer
    // three.js só é baixado quando o Modo Galo é ligado
    import('../galo3d/scene')
      .then(({ createGaloScene }) => {
        if (!alive || !mountRef.current) return
        sceneRef.current = createGaloScene(mountRef.current, {
          reducedMotion: !!reduced,
          onCrow: (n) => {
            setCrows(n)
            setBubble(g.crows[(n - 1) % g.crows.length])
            clearTimeout(bubbleTimer)
            bubbleTimer = setTimeout(() => setBubble(null), 1800)
          },
        })
        setStatus('ok')
      })
      .catch(() => alive && setStatus('error'))
    return () => {
      alive = false
      clearTimeout(bubbleTimer)
      sceneRef.current?.dispose()
      sceneRef.current = null
    }
    // A cena é criada uma vez; os textos do balão vêm de g no momento do canto
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.section
      className="g3d"
      aria-label={g.title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35 }}
    >
      <div className="g3d-stage" ref={mountRef}>
        {status === 'loading' && <p className="g3d-msg">{g.loading}</p>}
        {status === 'error' && <p className="g3d-msg">{g.error}</p>}

        <div className="g3d-top">
          <h3>{g.title}</h3>
          {crows > 0 && <span className="g3d-count">{g.counter(crows)}</span>}
        </div>

        <AnimatePresence>
          {bubble && (
            <motion.div
              key={crows}
              className="g3d-bubble"
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              {bubble}
            </motion.div>
          )}
        </AnimatePresence>

        {status === 'ok' && (
          <div className="g3d-actions">
            <button onClick={() => sceneRef.current?.crow()}>🐓 {g.crowBtn}</button>
            <button onClick={() => sceneRef.current?.kick()}>⚽ {g.kickBtn}</button>
          </div>
        )}
      </div>
      <p className="g3d-hint">{g.hint}</p>
    </motion.section>
  )
}
