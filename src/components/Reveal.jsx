import { motion } from 'framer-motion'

// Faz o conteúdo surgir suavemente quando entra na tela.
export default function Reveal({ as = 'div', delay = 0, x = 0, y = 24, children, ...props }) {
  const Tag = motion[as]
  return (
    <Tag
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
      {...props}
    >
      {children}
    </Tag>
  )
}
