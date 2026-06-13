import { Link } from 'react-router-dom';
import { Users, ClipboardList, CheckSquare, Calendar, Plus, Brain, FileText } from 'lucide-react';
import { useClientStore } from '../store/useClientStore';
import { useInterviewStore } from '../store/useInterviewStore';
import { useTaskStore } from '../store/useTaskStore';
import { useAppointmentStore } from '../store/useAppointmentStore';
import { StatsCard } from '../components/dashboard/StatsCard';
import { KanbanBoard } from '../components/dashboard/KanbanBoard';
import { TodayAppointments } from '../components/dashboard/TodayAppointments';
import { Button } from '../components/common/Button';

export default function Dashboard() {
  const clients = useClientStore((state) => state.clients);
  const interviews = useInterviewStore((state) => state.interviews);
  const tasks = useTaskStore((state) => state.tasks);
  const appointments = useAppointmentStore((state) => state.appointments);

  const pendingFollowups = clients.filter((c) => c.currentStage === 'follow_up').length;
  const activeTasks = tasks.filter((t) => t.status !== 'completed').length;
  const scheduledAppointments = appointments.filter((a) => a.status === 'scheduled').length;
  const recentInterviews = interviews.slice(-7).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">欢迎回来</h1>
          <p className="text-gray-500 mt-1">以下是您的工作概览</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/clients/new">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4" />
              新建档案
            </Button>
          </Link>
          <Link to="/assessments">
            <Button variant="secondary" size="sm">
              <Brain className="w-4 h-4" />
              发放测评
            </Button>
          </Link>
          <Link to="/interviews/new">
            <Button variant="primary" size="sm">
              <ClipboardList className="w-4 h-4" />
              记录访谈
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="总来访者"
          value={clients.length}
          icon={<Users className="w-6 h-6" />}
          trend={{ value: 12, isPositive: true }}
          color="primary"
        />
        <StatsCard
          title="本周访谈"
          value={recentInterviews}
          icon={<ClipboardList className="w-6 h-6" />}
          trend={{ value: 8, isPositive: true }}
          color="secondary"
        />
        <StatsCard
          title="进行中任务"
          value={activeTasks}
          icon={<CheckSquare className="w-6 h-6" />}
          trend={{ value: 5, isPositive: false }}
          color="warning"
        />
        <StatsCard
          title="已预约咨询"
          value={scheduledAppointments}
          icon={<Calendar className="w-6 h-6" />}
          color="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <KanbanBoard />
        </div>
        <div>
          <TodayAppointments />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">待跟进提醒</h2>
        </div>
        {pendingFollowups > 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <span className="text-xl">⚠️</span>
              </div>
              <div>
                <p className="font-medium text-amber-800">
                  有 {pendingFollowups} 位来访者需要跟进
                </p>
                <p className="text-sm text-amber-600 mt-1">
                  他们正处于跟进阶段，请定期查看任务完成情况
                </p>
                <Link
                  to="/clients"
                  className="inline-flex items-center gap-1 mt-2 text-sm text-amber-700 hover:underline"
                >
                  查看待跟进名单
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-xl">✓</span>
              </div>
              <div>
                <p className="font-medium text-green-800">所有来访者都在正常流程中</p>
                <p className="text-sm text-green-600 mt-1">
                  目前没有需要紧急跟进的来访者
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
