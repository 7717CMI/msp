import { Activity, PieChart as PieChartIcon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

interface StatBoxProps {
  title: string
  subtitle: string
  icon?: React.ReactNode
  progress?: string | number | null
  increase?: string
  onCircleClick?: () => void
}

export function StatBox({ title, subtitle, icon, progress, increase, onCircleClick }: StatBoxProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="w-full">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="mb-2 text-electric-blue dark:text-cyan-accent">
            {icon || <Activity size={26} />}
          </div>
          <h3 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark mb-1">
            {title}
          </h3>
        </div>
        {progress !== undefined && progress !== null && onCircleClick && (
          <div 
            onClick={onCircleClick} 
            className="cursor-pointer w-[60px] h-[60px] rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              backgroundColor: isDark ? 'rgba(79, 209, 197, 0.1)' : 'rgba(79, 209, 197, 0.15)'
            }}
          >
            <PieChartIcon 
              size={28} 
              className="text-electric-blue dark:text-cyan-accent"
            />
          </div>
        )}
      </div>
      <div className="flex justify-between items-center mt-2">
        <p className="text-sm font-medium text-electric-blue dark:text-cyan-accent">
          {subtitle}
        </p>
        {increase && (
          <p className="text-sm font-medium text-success italic">
            {increase}
          </p>
        )}
      </div>
    </div>
  )
}

