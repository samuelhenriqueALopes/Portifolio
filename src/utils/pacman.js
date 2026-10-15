// Qualquer parte do site pode abrir o jogo disparando este evento.
export const PACMAN_EVENT = 'pacman:open'

export const openPacman = () => window.dispatchEvent(new Event(PACMAN_EVENT))
