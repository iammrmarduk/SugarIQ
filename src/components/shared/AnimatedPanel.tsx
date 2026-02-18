import { motion } from 'motion/react'
import type { ReactNode } from 'react'

interface AnimatedPanelProps {
  children: ReactNode
  className?: string
}

export function AnimatedPanel({ children, className }: AnimatedPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerChildProps {
  children: ReactNode
  index: number
  className?: string
}

export function StaggerChild({ children, index, className }: StaggerChildProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
