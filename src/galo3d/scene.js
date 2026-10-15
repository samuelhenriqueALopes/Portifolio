// Cena 3D do Modo Galo: um galo low-poly num pedestal listrado e uma bola de futebol.
// Interações: o galo segue o cursor com a cabeça, arrastar gira a cena,
// clicar no galo faz ele cantar (pulo + asas + confete) e clicar na bola dá um chute.
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const BLACK = 0x111111
const WHITE = 0xf2f2f2
const RED = 0xd62828
const YELLOW = 0xf5b301

const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.7, ...extra })

function stripesTexture() {
  const c = document.createElement('canvas')
  c.width = 256; c.height = 16
  const ctx = c.getContext('2d')
  for (let i = 0; i < 16; i++) { ctx.fillStyle = i % 2 ? '#f2f2f2' : '#111111'; ctx.fillRect(i * 16, 0, 16, 16) }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.RepeatWrapping
  tex.repeat.set(2, 1)
  return tex
}

function buildRooster() {
  const rooster = new THREE.Group()
  const black = mat(BLACK)
  const white = mat(WHITE)
  const red = mat(RED)
  const yellow = mat(YELLOW)

  const add = (geo, material, pos, scale, rot, parent = rooster) => {
    const m = new THREE.Mesh(geo, material)
    m.position.set(...pos)
    if (scale) m.scale.set(...scale)
    if (rot) m.rotation.set(...rot)
    parent.add(m)
    return m
  }

  // Corpo preto com peito branco
  add(new THREE.SphereGeometry(0.75, 10, 8), black, [0, 1.15, -0.05], [1, 0.95, 1.15])
  add(new THREE.SphereGeometry(0.5, 10, 8), white, [0, 1.1, 0.45], [1, 1.1, 0.8])
  add(new THREE.CylinderGeometry(0.26, 0.36, 0.7, 8), white, [0, 1.7, 0.38], null, [0.35, 0, 0])

  // Cabeça (grupo, para olhar na direção do cursor)
  const head = new THREE.Group()
  head.position.set(0, 2.08, 0.5)
  rooster.add(head)
  add(new THREE.SphereGeometry(0.33, 10, 8), white, [0, 0, 0], null, null, head)
  add(new THREE.ConeGeometry(0.1, 0.32, 5), yellow, [0, -0.03, 0.38], null, [Math.PI / 2, 0, 0], head)
  add(new THREE.SphereGeometry(0.09, 6, 6), red, [0, -0.22, 0.22], [1, 1.6, 0.8], null, head)
  // Crista
  ;[[0.3, -0.17, 0.09], [0.36, -0.04, 0.12], [0.37, 0.09, 0.13], [0.31, 0.2, 0.1]].forEach(([y, z, r]) =>
    add(new THREE.SphereGeometry(r, 6, 6), red, [0, y, z], [0.7, 1, 1], null, head))
  for (const side of [-1, 1]) {
    add(new THREE.SphereGeometry(0.065, 8, 8), mat(0x000000, { roughness: 0.2 }), [side * 0.18, 0.08, 0.24], null, null, head)
    add(new THREE.SphereGeometry(0.022, 6, 6), mat(0xffffff, { emissive: 0xffffff, emissiveIntensity: 0.6 }), [side * 0.2, 0.11, 0.3], null, null, head)
  }

  // Asas (com pivô no ombro para bater)
  const wings = []
  for (const side of [-1, 1]) {
    const pivot = new THREE.Group()
    pivot.position.set(side * 0.68, 1.45, -0.05)
    rooster.add(pivot)
    add(new THREE.SphereGeometry(0.5, 8, 6), black, [side * 0.08, -0.32, 0], [0.28, 0.75, 1.0], null, pivot)
    add(new THREE.SphereGeometry(0.3, 8, 6), white, [side * 0.13, -0.5, -0.18], [0.2, 0.55, 0.9], null, pivot)
    pivot.userData.side = side
    wings.push(pivot)
  }

  // Cauda em leque, alternando preto e branco
  const tail = new THREE.Group()
  tail.position.set(0, 1.35, -0.8)
  rooster.add(tail)
  for (let i = 0; i < 7; i++) {
    const a = (i - 3) * 0.24
    const feather = add(new THREE.ConeGeometry(0.16, 1.25, 5), i % 2 ? white : black, [0, 0, 0], [1, 1, 0.5], null, tail)
    feather.geometry.translate(0, 0.6, 0)
    feather.rotation.set(-0.55, 0, a)
  }

  // Pernas e pés
  for (const side of [-1, 1]) {
    add(new THREE.CylinderGeometry(0.06, 0.06, 0.62, 6), yellow, [side * 0.26, 0.31, 0.05])
    for (const a of [-0.5, 0, 0.5]) {
      const toe = add(new THREE.BoxGeometry(0.06, 0.05, 0.3), yellow, [side * 0.26 + Math.sin(a) * 0.12, 0.03, 0.15 + Math.cos(a) * 0.08])
      toe.rotation.y = a
    }
  }

  rooster.traverse((o) => { if (o.isMesh) o.userData.rooster = true })
  return { rooster, head, wings, tail }
}

function buildBall() {
  const geo = new THREE.IcosahedronGeometry(0.34, 1).toNonIndexed()
  const base = new THREE.IcosahedronGeometry(1, 0).toNonIndexed().getAttribute('position')
  const corners = []
  for (let i = 0; i < base.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(base, i).normalize()
    if (!corners.some((c) => c.distanceTo(v) < 1e-3)) corners.push(v)
  }
  const pos = geo.getAttribute('position')
  const colors = []
  const black = new THREE.Color(BLACK)
  const white = new THREE.Color(WHITE)
  for (let f = 0; f < pos.count; f += 3) {
    const center = new THREE.Vector3()
    for (let k = 0; k < 3; k++) center.add(new THREE.Vector3().fromBufferAttribute(pos, f + k))
    center.normalize()
    const c = corners.some((v) => v.dot(center) > 0.93) ? black : white
    for (let k = 0; k < 3; k++) colors.push(c.r, c.g, c.b)
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  const ball = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.5 }))
  ball.userData.ball = true
  return ball
}

export function createGaloScene(container, { onCrow, reducedMotion = false } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
  camera.position.set(4.2, 3.2, 6.2)

  scene.add(new THREE.HemisphereLight(0xffffff, 0x333333, 1.6))
  const sun = new THREE.DirectionalLight(0xffffff, 2.2)
  sun.position.set(4, 8, 6)
  scene.add(sun)
  const rim = new THREE.DirectionalLight(0x9db4ff, 0.8)
  rim.position.set(-5, 3, -4)
  scene.add(rim)

  // Gramado escuro com faixas e pedestal listrado
  const floor = new THREE.Mesh(new THREE.CircleGeometry(4, 48), mat(0x1c3d24, { roughness: 1 }))
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -0.36
  scene.add(floor)
  for (let i = -3; i <= 3; i += 2) {
    const band = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 7.6), mat(0x22492b, { roughness: 1 }))
    band.rotation.x = -Math.PI / 2
    band.position.set(i * 0.9, -0.355, 0)
    band.scale.y = Math.cos((i * 0.9) / 4) // acompanha a borda do círculo
    scene.add(band)
  }
  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(1.25, 1.35, 0.36, 40),
    [new THREE.MeshStandardMaterial({ map: stripesTexture(), roughness: 0.6 }), mat(BLACK), mat(BLACK)],
  )
  pedestal.position.y = -0.18
  scene.add(pedestal)

  const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.75, 32), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 }))
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = 0.005
  scene.add(shadow)

  const { rooster, head, wings, tail } = buildRooster()
  rooster.rotation.y = 0.35
  scene.add(rooster)

  const ball = buildBall()
  const ballHome = new THREE.Vector3(1.9, -0.36 + 0.34, 1.3)
  ball.position.copy(ballHome)
  scene.add(ball)
  const ballVel = new THREE.Vector3()

  // Confete preto e branco
  const confettiGeo = new THREE.PlaneGeometry(0.08, 0.12)
  const confettiMats = [new THREE.MeshBasicMaterial({ color: BLACK, side: THREE.DoubleSide }), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })]
  const confetti = []

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 1.1, 0)
  controls.enablePan = false
  controls.enableZoom = false
  controls.enableDamping = true
  controls.minPolarAngle = 0.5
  controls.maxPolarAngle = 1.45
  controls.autoRotate = !reducedMotion
  controls.autoRotateSpeed = 0.6
  // No celular, um dedo rola a página; dois dedos giram a cena
  controls.touches = { ONE: null, TWO: THREE.TOUCH.DOLLY_ROTATE }
  controls.update()
  renderer.domElement.style.touchAction = 'pan-y'

  // Cursor → cabeça do galo
  const pointer = new THREE.Vector2(0, 0)
  const raycaster = new THREE.Raycaster()
  let pointerInside = false
  let downAt = null
  let idleTimer = 0

  const toNdc = (e) => {
    const r = renderer.domElement.getBoundingClientRect()
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
  }
  const pick = () => {
    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObjects([rooster, ball], true)[0]
    if (!hit) return null
    return hit.object.userData.ball ? 'ball' : hit.object.userData.rooster ? 'rooster' : null
  }

  const onMove = (e) => {
    toNdc(e)
    pointerInside = true
    renderer.domElement.style.cursor = pick() ? 'pointer' : 'grab'
  }
  const onLeave = () => { pointerInside = false }
  const onDown = (e) => { toNdc(e); downAt = { x: e.clientX, y: e.clientY, t: performance.now() }; controls.autoRotate = false; idleTimer = 0 }
  const onUp = (e) => {
    if (!downAt) return
    const moved = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y)
    downAt = null
    if (moved > 6) return // foi um arraste, não um clique
    toNdc(e)
    const target = pick()
    if (target === 'rooster') crow()
    else if (target === 'ball') kick()
  }
  const el = renderer.domElement
  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerleave', onLeave)
  el.addEventListener('pointerdown', onDown)
  el.addEventListener('pointerup', onUp)

  let crowT = -1
  let crows = 0
  function crow() {
    crowT = 0
    crows++
    onCrow?.(crows)
    if (reducedMotion) return
    for (let i = 0; i < 70; i++) {
      const m = new THREE.Mesh(confettiGeo, confettiMats[i % 2])
      m.position.set((Math.random() - 0.5) * 0.6, 2.6, (Math.random() - 0.5) * 0.6)
      m.userData.v = new THREE.Vector3((Math.random() - 0.5) * 4, 3 + Math.random() * 3, (Math.random() - 0.5) * 4)
      m.userData.spin = new THREE.Vector3(Math.random() * 8, Math.random() * 8, Math.random() * 8)
      m.userData.life = 2.5 + Math.random()
      scene.add(m)
      confetti.push(m)
    }
  }
  function kick() {
    const dir = new THREE.Vector3().subVectors(ball.position, camera.position).setY(0).normalize()
    dir.x += (Math.random() - 0.5) * 0.6
    ballVel.set(dir.x * 5, 3.2 + Math.random(), dir.z * 5)
  }

  // Tamanho
  const resize = () => {
    const w = container.clientWidth
    const h = container.clientHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.position.setLength(w < 500 ? 9 : 7.8)
    camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(container)
  resize()

  // Só renderiza quando a cena está visível
  let visible = true
  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
  io.observe(container)

  const clock = new THREE.Clock()
  let frame = 0
  let peckT = 0
  const lookTarget = new THREE.Vector2()

  const animate = () => {
    frame = requestAnimationFrame(animate)
    if (!visible || document.hidden) { clock.getDelta(); return }
    const dt = Math.min(clock.getDelta(), 0.05)
    const t = clock.elapsedTime

    idleTimer += dt
    if (!controls.autoRotate && idleTimer > 8 && !reducedMotion) controls.autoRotate = true

    // Respiração e cauda
    if (!reducedMotion) {
      rooster.scale.y = 1 + Math.sin(t * 2.2) * 0.012
      tail.rotation.z = Math.sin(t * 1.3) * 0.06
    }

    // Cabeça segue o cursor (em coordenadas da tela)
    if (pointerInside) lookTarget.set(pointer.x, pointer.y)
    else lookTarget.multiplyScalar(0.95)
    let headX = -lookTarget.y * 0.35
    let headY = lookTarget.x * 0.7 - rooster.rotation.y * 0.3

    // Bicada de vez em quando
    peckT += dt
    if (!reducedMotion && peckT > 7) {
      const p = peckT - 7
      headX += Math.sin(Math.min(p / 0.5, 1) * Math.PI) * 0.6
      if (p > 0.5) peckT = 0
    }

    // Canto: pulo, asas batendo e cabeça para cima
    let jump = 0
    let flap = 0
    if (crowT >= 0) {
      crowT += dt
      const p = crowT / 1.2
      jump = Math.sin(Math.min(p, 1) * Math.PI) * 0.45
      flap = Math.sin(crowT * 28) * 0.9 * (1 - Math.min(p, 1))
      headX -= Math.sin(Math.min(p, 1) * Math.PI) * 0.6
      if (p >= 1) crowT = -1
    }
    head.rotation.x += (headX - head.rotation.x) * 0.15
    head.rotation.y += (headY - head.rotation.y) * 0.15
    rooster.position.y = jump
    shadow.scale.setScalar(1 - jump * 0.6)
    wings.forEach((w) => { w.rotation.z = w.userData.side * (0.08 + Math.abs(flap)) })

    // Bola: gravidade, quique, atrito e volta para perto do galo
    ballVel.y -= 9.8 * dt
    ball.position.addScaledVector(ballVel, dt)
    const groundY = ballHome.y
    if (ball.position.y < groundY) {
      ball.position.y = groundY
      ballVel.y = Math.abs(ballVel.y) > 0.6 ? -ballVel.y * 0.55 : 0
      ballVel.x *= 0.985
      ballVel.z *= 0.985
    }
    const flat = new THREE.Vector2(ball.position.x, ball.position.z)
    if (flat.length() > 3.6) { // borda do gramado
      const n = new THREE.Vector3(ball.position.x, 0, ball.position.z).normalize()
      ballVel.addScaledVector(n, -2 * ballVel.dot(n) * 0.8)
      ball.position.x = n.x * 3.6
      ball.position.z = n.z * 3.6
    }
    if (flat.length() < 1.75 && ball.position.y < 0.3) { // não entra no pedestal
      const n = new THREE.Vector3(ball.position.x, 0, ball.position.z).normalize()
      ballVel.addScaledVector(n, -2 * Math.min(ballVel.dot(n), 0))
      ball.position.x = n.x * 1.75
      ball.position.z = n.z * 1.75
    }
    if (ball.position.y === groundY) {
      ballVel.x += (ballHome.x - ball.position.x) * 0.4 * dt
      ballVel.z += (ballHome.z - ball.position.z) * 0.4 * dt
    }
    ball.rotation.x += ballVel.z * dt / 0.34
    ball.rotation.z -= ballVel.x * dt / 0.34
    if (!reducedMotion && ballVel.lengthSq() < 0.01) ball.position.y = groundY + Math.abs(Math.sin(t * 2)) * 0.02

    // Confete
    for (let i = confetti.length - 1; i >= 0; i--) {
      const c = confetti[i]
      c.userData.v.y -= 6 * dt
      c.userData.v.multiplyScalar(0.985)
      c.position.addScaledVector(c.userData.v, dt)
      c.rotation.x += c.userData.spin.x * dt
      c.rotation.y += c.userData.spin.y * dt
      c.userData.life -= dt
      if (c.userData.life <= 0 || c.position.y < -0.35) { scene.remove(c); confetti.splice(i, 1) }
    }

    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  return {
    crow,
    kick,
    dispose() {
      cancelAnimationFrame(frame)
      ro.disconnect()
      io.disconnect()
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointerup', onUp)
      controls.dispose()
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose()
        const m = o.material
        if (m) (Array.isArray(m) ? m : [m]).forEach((x) => { x.map?.dispose(); x.dispose() })
      })
      confettiGeo.dispose()
      confettiMats.forEach((m) => m.dispose())
      renderer.dispose()
      el.remove()
    },
  }
}
