// Motor do Pac-Man: só lógica, sem desenho. Posições em "tiles" do labirinto.
// '#' parede · '.' pastilha · 'o' pastilha de poder · '-' porta da casa dos fantasmas · ' ' corredor vazio
export const MAZE = [
  '###################',
  '#........#........#',
  '#o##.###.#.###.##o#',
  '#.................#',
  '#.##.#.#####.#.##.#',
  '#....#...#...#....#',
  '####.### # ###.####',
  '   #.#       #.#   ',
  '####.# ##-## #.####',
  '    .  #   #  .    ',
  '####.# ##### #.####',
  '   #.#       #.#   ',
  '####.# ##### #.####',
  '#........#........#',
  '#.##.###.#.###.##.#',
  '#o.#...........#.o#',
  '##.#.#.#####.#.#.##',
  '#....#...#...#....#',
  '#.######.#.######.#',
  '#.................#',
  '###################',
]
export const COLS = MAZE[0].length
export const ROWS = MAZE.length

export const DIRS = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } }
const OPP = { up: 'down', down: 'up', left: 'right', right: 'left' }
const ORDER = ['up', 'left', 'down', 'right'] // desempate clássico

const DOOR = { x: 9, y: 7 } // tile logo acima da porta
const PAC_START = { x: 9, y: 15 }

const GHOSTS = [
  { name: 'blinky', color: '#ff4b4b', start: [9, 7], release: 0, corner: [COLS - 2, -3] },
  { name: 'pinky', color: '#ffb3e6', start: [9, 9], release: 1.5, corner: [1, -3] },
  { name: 'inky', color: '#4fe3ff', start: [8, 9], release: 5, corner: [COLS - 1, ROWS + 1] },
  { name: 'clyde', color: '#ffb347', start: [10, 9], release: 9, corner: [0, ROWS + 1] },
]

// Alterna perseguição e dispersão, como no original
const MODES = [['scatter', 7], ['chase', 20], ['scatter', 7], ['chase', 20], ['scatter', 5], ['chase', Infinity]]

const wrapX = (x) => (x + COLS) % COLS
const tileAt = (g, x, y) => (y < 0 || y >= ROWS ? '#' : g.grid[y][wrapX(x)])
const pacCanEnter = (g, x, y) => { const c = tileAt(g, x, y); return c !== '#' && c !== '-' }
const ghostCanEnter = (g, x, y, door) => { const c = tileAt(g, x, y); return c !== '#' && (door || c !== '-') }

const pacSpeed = (g) => Math.min(7.5 + (g.level - 1) * 0.4, 10)
const ghostSpeed = (g) => Math.min(6.8 + (g.level - 1) * 0.4, 9.5)
const frightTime = (g) => Math.max(6 - (g.level - 1), 2)

export function position(e) {
  const d = DIRS[e.dir]
  return { x: e.x + d.x * e.prog, y: e.y + d.y * e.prog }
}

export function createGame(rand = Math.random) {
  const g = { score: 0, lives: 3, level: 1, extraLife: false, rand }
  startLevel(g)
  return g
}

function startLevel(g) {
  g.grid = MAZE.map((row) => row.split(''))
  g.pellets = g.grid.flat().filter((c) => c === '.' || c === 'o').length
  resetRound(g)
}

function resetRound(g) {
  g.pac = { x: PAC_START.x, y: PAC_START.y, dir: 'left', next: null, prog: 0, moving: false }
  g.ghosts = GHOSTS.map((d) => ({
    ...d,
    x: d.start[0],
    y: d.start[1],
    dir: d.name === 'blinky' ? 'left' : 'up',
    prog: 0,
    state: d.name === 'blinky' ? 'active' : 'house',
    wait: d.release,
    frightened: false,
  }))
  g.modeIndex = 0
  g.modeTime = MODES[0][1]
  g.fright = 0
  g.combo = 0
  g.popups = []
  g.state = 'ready'
  g.timer = 2
  g.time = 0
}

export function setDirection(g, dir) {
  if (DIRS[dir]) g.pac.next = dir
}

export function togglePause(g) {
  if (g.state === 'playing') g.state = 'paused'
  else if (g.state === 'paused') g.state = 'playing'
}

function reverse(e) {
  if (e.prog > 0) {
    const d = DIRS[e.dir]
    e.x = wrapX(e.x + d.x)
    e.y += d.y
    e.prog = 1 - e.prog
  }
  e.dir = OPP[e.dir]
}

// Avança o jogo dt segundos (em sub-passos, para colisões não "atravessarem")
export function step(g, dt) {
  const n = Math.ceil(dt / (1 / 120))
  for (let i = 0; i < n; i++) tick(g, dt / n)
}

function tick(g, dt) {
  g.time += dt
  g.popups = g.popups.filter((p) => (p.t -= dt) > 0)

  switch (g.state) {
    case 'ready':
      if ((g.timer -= dt) <= 0) g.state = 'playing'
      return
    case 'dying':
      if ((g.timer -= dt) <= 0) {
        g.lives--
        if (g.lives <= 0) g.state = 'gameover'
        else resetRound(g)
      }
      return
    case 'levelup':
      if ((g.timer -= dt) <= 0) { g.level++; startLevel(g) }
      return
    case 'playing':
      break
    default:
      return
  }

  if (g.fright > 0) {
    g.fright -= dt
    if (g.fright <= 0) { g.fright = 0; g.ghosts.forEach((gh) => { gh.frightened = false }) }
  } else {
    g.modeTime -= dt
    if (g.modeTime <= 0 && g.modeIndex < MODES.length - 1) {
      g.modeIndex++
      g.modeTime = MODES[g.modeIndex][1]
      g.ghosts.forEach((gh) => { if (gh.state === 'active') reverse(gh) })
    }
  }

  movePac(g, dt)
  for (const gh of g.ghosts) moveGhost(g, gh, dt)
  collide(g)

  if (!g.extraLife && g.score >= 10000) { g.extraLife = true; g.lives++ }
  if (g.state === 'playing' && g.pellets === 0) { g.state = 'levelup'; g.timer = 2 }
}

function movePac(g, dt) {
  const p = g.pac
  const canGo = (d) => pacCanEnter(g, p.x + DIRS[d].x, p.y + DIRS[d].y)
  if (p.next && p.moving && p.next === OPP[p.dir]) reverse(p)

  let dist = pacSpeed(g) * dt
  while (dist > 1e-9) {
    if (p.prog === 0) {
      if (p.next && canGo(p.next)) p.dir = p.next
      if (!canGo(p.dir)) { p.moving = false; return }
      p.moving = true
    }
    const s = Math.min(dist, 1 - p.prog)
    p.prog += s
    dist -= s
    if (p.prog >= 1 - 1e-9) {
      p.x = wrapX(p.x + DIRS[p.dir].x)
      p.y += DIRS[p.dir].y
      p.prog = 0
      eat(g, p.x, p.y)
    }
  }
}

function eat(g, x, y) {
  const c = g.grid[y][x]
  if (c === '.') { g.score += 10; g.pellets--; g.grid[y][x] = ' ' }
  else if (c === 'o') { g.score += 50; g.pellets--; g.grid[y][x] = ' '; frighten(g) }
}

function frighten(g) {
  g.fright = frightTime(g)
  g.combo = 0
  for (const gh of g.ghosts) {
    if (gh.state === 'eaten') continue
    if (!gh.frightened && gh.state === 'active') reverse(gh)
    gh.frightened = true
  }
}

function moveGhost(g, gh, dt) {
  if (gh.state === 'house') {
    gh.wait -= dt
    if (gh.wait <= 0) gh.state = 'leaving'
    return
  }

  const inTunnel = gh.y === 9 && (gh.x <= 4 || gh.x >= COLS - 5)
  const speed =
    gh.state === 'eaten' ? 15
      : gh.state === 'leaving' || gh.state === 'entering' ? 4
        : gh.frightened ? 4.5
          : inTunnel ? 4
            : ghostSpeed(g)

  let dist = speed * dt
  while (dist > 1e-9) {
    if (gh.prog === 0) {
      const d = chooseGhostDir(g, gh)
      if (!d) return
      gh.dir = d
    }
    const s = Math.min(dist, 1 - gh.prog)
    gh.prog += s
    dist -= s
    if (gh.prog >= 1 - 1e-9) {
      gh.x = wrapX(gh.x + DIRS[gh.dir].x)
      gh.y += DIRS[gh.dir].y
      gh.prog = 0
      if (gh.state === 'eaten' && gh.x === DOOR.x && gh.y === DOOR.y) gh.state = 'entering'
      else if (gh.state === 'entering' && gh.y === 9) { gh.state = 'leaving'; gh.frightened = false }
      else if (gh.state === 'leaving' && gh.x === DOOR.x && gh.y === DOOR.y) { gh.state = 'active'; gh.dir = 'left' }
    }
  }
}

function chooseGhostDir(g, gh) {
  if (gh.state === 'leaving') return gh.x !== DOOR.x ? (gh.x < DOOR.x ? 'right' : 'left') : 'up'
  if (gh.state === 'entering') return 'down'

  const door = gh.state === 'eaten'
  let options = ORDER.filter((d) => d !== OPP[gh.dir] && ghostCanEnter(g, gh.x + DIRS[d].x, gh.y + DIRS[d].y, door))
  if (!options.length) options = [OPP[gh.dir]]
  if (gh.frightened && gh.state === 'active') return options[Math.floor(g.rand() * options.length)]

  const [tx, ty] = ghostTarget(g, gh)
  let best = options[0]
  let bestDist = Infinity
  for (const d of options) {
    const nx = gh.x + DIRS[d].x
    const ny = gh.y + DIRS[d].y
    const dd = (nx - tx) ** 2 + (ny - ty) ** 2
    if (dd < bestDist) { bestDist = dd; best = d }
  }
  return best
}

function ghostTarget(g, gh) {
  if (gh.state === 'eaten') return [DOOR.x, DOOR.y]
  if (MODES[g.modeIndex][0] === 'scatter') return gh.corner
  const p = g.pac
  const pd = DIRS[p.dir]
  switch (gh.name) {
    case 'pinky':
      return [p.x + 4 * pd.x, p.y + 4 * pd.y]
    case 'inky': {
      const b = g.ghosts[0]
      return [2 * (p.x + 2 * pd.x) - b.x, 2 * (p.y + 2 * pd.y) - b.y]
    }
    case 'clyde':
      return (gh.x - p.x) ** 2 + (gh.y - p.y) ** 2 > 64 ? [p.x, p.y] : gh.corner
    default:
      return [p.x, p.y]
  }
}

function collide(g) {
  const pp = position(g.pac)
  for (const gh of g.ghosts) {
    if (gh.state !== 'active') continue
    const q = position(gh)
    let dx = Math.abs(pp.x - q.x)
    dx = Math.min(dx, COLS - dx)
    if (dx < 0.6 && Math.abs(pp.y - q.y) < 0.6) {
      if (gh.frightened) {
        gh.frightened = false
        gh.state = 'eaten'
        const pts = 200 * 2 ** g.combo
        g.combo = Math.min(g.combo + 1, 3)
        g.score += pts
        g.popups.push({ x: q.x, y: q.y, text: String(pts), t: 1 })
      } else {
        g.state = 'dying'
        g.timer = 1.6
        return
      }
    }
  }
}
