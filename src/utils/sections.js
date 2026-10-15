// Seções da página única, na ordem em que aparecem.
export const SECTIONS = ['sobre', 'projetos', 'experiencias', 'contato']

export function scrollToSection(id, { smooth = true } = {}) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })
  history.replaceState(null, '', `#${id}`)
}

// Aceita tanto "#projetos" quanto o formato antigo "#/projetos".
export function sectionFromHash(hash = window.location.hash) {
  const id = hash.replace(/^#\/?/, '')
  return SECTIONS.includes(id) ? id : null
}
