import { cn } from '../../lib/utils'
import {
  ShieldAlert,
  Sprout,
  Factory,
  TrendingUp,
  MessageSquare,
  Rocket,
  Map,
  FlaskConical,
  BarChart3,
  Cpu,
  BookOpen,
  LayoutDashboard,
} from 'lucide-react'

const tabs = [
  { id: 'import', label: 'Import Intel', icon: ShieldAlert, shortcut: '1' },
  { id: 'precision', label: 'Precision Ag', icon: Sprout, shortcut: '2' },
  { id: 'mills', label: 'Mill Ops', icon: Factory, shortcut: '3' },
  { id: 'diversify', label: 'Diversification', icon: TrendingUp, shortcut: '4' },
  { id: 'advisory', label: 'AI Advisory', icon: MessageSquare, shortcut: '5' },
  { id: 'roadmap', label: 'Roadmap', icon: Rocket, shortcut: '6' },
  { id: 'map', label: 'Mill Map', icon: Map, shortcut: '7' },
  { id: 'cts', label: 'CTS Lab', icon: FlaskConical, shortcut: '8' },
  { id: 'factory', label: 'Factory V1', icon: BarChart3, shortcut: 'f' },
  { id: 'factory-v2', label: 'Factory V2', icon: LayoutDashboard, shortcut: 'g' },
  { id: 'demos', label: 'AI Demos', icon: Cpu, shortcut: '0' },
  { id: 'sources', label: 'Sources', icon: BookOpen, shortcut: '9' },
]

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="border-b border-slate-800 bg-slate-900/50">
      <div className="mx-auto max-w-[1600px] px-4">
        <div className="flex gap-1 overflow-x-auto py-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'relative flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-slate-800 text-cane-400 shadow-lg shadow-cane-500/5'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200',
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
                <span
                  className={cn(
                    'ml-1 rounded px-1 py-0.5 font-mono text-[10px]',
                    isActive
                      ? 'bg-cane-500/20 text-cane-400'
                      : 'bg-slate-700/50 text-slate-500',
                  )}
                >
                  {tab.shortcut}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-cane-400" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export { tabs }
