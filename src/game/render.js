import { COLS, ROWS, DIRS, position } from './pacman'

export const TILE = 20
export const WIDTH = COLS * TILE
export const HEIGHT = ROWS * TILE

const ANGLE = { right: 0, down: Math.PI / 2, left: Math.PI, up: -Math.PI / 2 }

export function render(ctx, g, labels) {
  const T = TILE
  ctx.fillStyle = '#05060c'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  drawMaze(ctx, g)

  // Pastilhas
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const c = g.grid[y][x]
      if (c === '.') {
        ctx.fillStyle = '#ffd9b3'
        ctx.beginPath(); ctx.arc(x * T + T / 2, y * T + T / 2, 2, 0, Math.PI * 2); ctx.fill()
      } else if (c === 'o' && (g.state !== 'playing' || Math.floor(g.time * 4) % 2 === 0)) {
        ctx.fillStyle = '#ffd9b3'
        ctx.beginPath(); ctx.arc(x * T + T / 2, y * T + T / 2, 5.5, 0, Math.PI * 2); ctx.fill()
      }
    }
  }

  if (g.state !== 'levelup') g.ghosts.forEach((gh) => drawGhost(ctx, g, gh))
  if (g.state !== 'gameover') drawPac(ctx, g)

  // Pontos ao comer fantasmas
  ctx.font = 'bold 11px Consolas, monospace'
  ctx.textAlign = 'center'
  for (const p of g.popups) {
    ctx.fillStyle = '#4fe3ff'
    ctx.fillText(p.text, p.x * T + T / 2, p.y * T + T / 2 + 4)
  }

  // Mensagens no centro do labirinto
  const msg = { ready: labels.ready, paused: labels.paused, gameover: labels.gameover, levelup: labels.levelup }[g.state]
  if (msg) {
    ctx.font = 'bold 15px Consolas, monospace'
    ctx.fillStyle = g.state === 'gameover' ? '#ff4b4b' : '#ffe14d'
    ctx.fillText(msg, WIDTH / 2, 11 * T + T / 2 + 5)
  }
}

function drawMaze(ctx, g) {
  const T = TILE
  const flash = g.state === 'levelup' && Math.floor(g.timer * 6) % 2 === 0
  const isWall = (x, y) => y < 0 || y >= ROWS || x < 0 || x >= COLS || g.grid[y][x] === '#'

  ctx.fillStyle = '#0b1440'
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) if (g.grid[y][x] === '#') ctx.fillRect(x * T, y * T, T, T)

  ctx.strokeStyle = flash ? '#ffffff' : '#4f7cff'
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (g.grid[y][x] !== '#') continue
      const px = x * T, py = y * T
      if (!isWall(x, y - 1) && y > 0) { ctx.moveTo(px, py + 1); ctx.lineTo(px + T, py + 1) }
      if (!isWall(x, y + 1) && y < ROWS - 1) { ctx.moveTo(px, py + T - 1); ctx.lineTo(px + T, py + T - 1) }
      if (!isWall(x - 1, y) && x > 0) { ctx.moveTo(px + 1, py); ctx.lineTo(px + 1, py + T) }
      if (!isWall(x + 1, y) && x < COLS - 1) { ctx.moveTo(px + T - 1, py); ctx.lineTo(px + T - 1, py + T) }
    }
  }
  ctx.stroke()

  // Porta da casa dos fantasmas
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (g.grid[y][x] === '-') { ctx.fillStyle = '#ffb3e6'; ctx.fillRect(x * T, y * T + T / 2 - 2, T, 4) }
    }
  }
}

function drawPac(ctx, g) {
  const T = TILE
  const { x, y } = position(g.pac)
  const cx = x * T + T / 2
  const cy = y * T + T / 2
  const r = T * 0.46

  let mouth
  if (g.state === 'dying') mouth = Math.min(1, 1 - g.timer / 1.6) * Math.PI // abre até sumir
  else if (g.pac.moving && g.state === 'playing') mouth = Math.abs(Math.sin(g.time * 14)) * 0.38 * Math.PI + 0.04
  else mouth = 0.25 * Math.PI

  const rot = ANGLE[g.pac.dir]
  ctx.fillStyle = '#ffe14d'
  for (const ox of [0, -COLS * T, COLS * T]) { // repete no outro lado do túnel
    ctx.beginPath()
    ctx.moveTo(cx + ox, cy)
    ctx.arc(cx + ox, cy, r, rot + mouth / 2, rot + Math.PI * 2 - mouth / 2)
    ctx.closePath()
    ctx.fill()
  }
}

function drawGhost(ctx, g, gh) {
  const T = TILE
  let { x, y } = position(gh)
  if (gh.state === 'house') y += Math.sin(g.time * 6 + x) * 0.15 // balança dentro da casa
  const cx = x * T + T / 2
  const cy = y * T + T / 2
  const r = T * 0.46

  if (gh.state !== 'eaten') {
    const flashing = gh.frightened && g.fright < 2 && Math.floor(g.time * 5) % 2 === 0
    ctx.fillStyle = gh.frightened ? (flashing ? '#f2f2ff' : '#2b4bff') : gh.color
    ctx.beginPath()
    ctx.arc(cx, cy - r * 0.15, r, Math.PI, 0)
    ctx.lineTo(cx + r, cy + r)
    const waves = 3
    const w = (2 * r) / waves
    const depth = Math.floor(g.time * 8) % 2 ? 4 : 2 // a "saia" ondula
    for (let i = 0; i < waves; i++) {
      const sx = cx + r - i * w
      ctx.lineTo(sx - w / 2, cy + r - depth)
      ctx.lineTo(sx - w, cy + r)
    }
    ctx.closePath()
    ctx.fill()

    if (gh.frightened) {
      ctx.fillStyle = flashing ? '#ff4b4b' : '#ffd9b3'
      ctx.fillRect(cx - r * 0.4, cy - r * 0.3, 3, 3)
      ctx.fillRect(cx + r * 0.4 - 3, cy - r * 0.3, 3, 3)
      ctx.strokeStyle = ctx.fillStyle
      ctx.lineWidth = 1.5
      ctx.beginPath()
      for (let i = 0; i <= 4; i++) ctx.lineTo(cx - r * 0.5 + i * r * 0.25, cy + r * 0.3 + (i % 2 ? -2 : 2))
      ctx.stroke()
      return
    }
  }

  // Olhos (também é tudo o que sobra de um fantasma comido)
  const d = DIRS[gh.dir]
  for (const side of [-1, 1]) {
    const ex = cx + side * r * 0.38
    const ey = cy - r * 0.25
    ctx.fillStyle = '#ffffff'
    ctx.beginPath(); ctx.ellipse(ex, ey, r * 0.27, r * 0.32, 0, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#1d2bff'
    ctx.beginPath(); ctx.arc(ex + d.x * r * 0.12, ey + d.y * r * 0.14, r * 0.14, 0, Math.PI * 2); ctx.fill()
  }
}
