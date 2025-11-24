import { Bell, Settings, User } from 'lucide-react'
import { motion } from 'framer-motion'

interface HeaderProps {
  currentPage?: string
}

export function Header({ currentPage = 'Home' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-navy-card border-b border-gray-200 dark:border-navy-light px-4 lg:px-8 py-5">
      <div className="flex items-center justify-between gap-4">
        {/* Dashboard Name */}
        <div className="flex items-center text-lg font-bold text-text-primary-light dark:text-text-primary-dark">
          GLOBAL AIRLINE INDUSTRY
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2 lg:gap-4 ml-auto">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-electric-blue transition-all"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-dark text-text-secondary-light dark:text-text-secondary-dark hover:text-electric-blue transition-all"
            aria-label="Settings"
          >
            <Settings size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-dark transition-all"
            aria-label="User profile"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-8 h-8 bg-gradient-to-br from-electric-blue to-cyan-accent rounded-full flex items-center justify-center"
            >
              <User className="text-white" size={16} />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </header>
  )
}

