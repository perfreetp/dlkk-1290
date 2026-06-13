import { Bell, Search, User } from 'lucide-react';
import { useClientStore } from '../../store/useClientStore';
import { useAppointmentStore } from '../../store/useAppointmentStore';

export function Header() {
  const clients = useClientStore((state) => state.clients);
  const appointments = useAppointmentStore((state) => state.appointments);
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(
    (a) => a.scheduledAt.startsWith(today) && a.status === 'scheduled'
  );

  const pendingFollowups = clients.filter(
    (c) => c.currentStage === 'follow_up'
  ).length;

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索来访者、报告..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            {todayAppointments.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#ef4444] rounded-full" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">咨询师</p>
            <p className="text-xs text-gray-500">
              {todayAppointments.length} 个今日预约 · {pendingFollowups} 个待跟进
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8f] flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
