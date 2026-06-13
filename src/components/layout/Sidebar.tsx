import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  FileText, 
  CheckSquare, 
  Calendar,
  Compass,
  Brain,
  Lightbulb,
  TrendingUp
} from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: '仪表盘' },
  { path: '/clients', icon: Users, label: '来访者档案' },
  { path: '/assessments', icon: Brain, label: '测评中心' },
  { path: '/interviews', icon: ClipboardList, label: '访谈记录' },
  { path: '/reports', icon: FileText, label: '诊断报告' },
  { path: '/tracking', icon: CheckSquare, label: '方案跟踪' },
  { path: '/appointments', icon: Calendar, label: '预约管理' },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-[#1e3a5f] text-white flex flex-col h-screen fixed left-0 top-0 shadow-xl">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f5a623] to-[#ff6b35] flex items-center justify-center shadow-lg">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">职业诊断</h1>
            <p className="text-xs text-white/60">咨询师工作台</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                'hover:bg-white/10',
                isActive && 'bg-white/15 shadow-md'
              )
            }
          >
            <item.icon className="w-5 h-5 text-white/70" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-[#f5a623]" />
            <span className="text-sm font-medium">使用提示</span>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            定期查看看板视图，确保每位来访者都得到及时跟进
          </p>
        </div>
      </div>
    </aside>
  );
}
