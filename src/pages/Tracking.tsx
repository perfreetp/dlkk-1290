import { useState } from 'react';
import { Plus, CheckCircle, Circle, Clock, Trash2, Edit, Calendar } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';
import { useClientStore } from '../store/useClientStore';
import { Task, TaskStatus } from '../types';
import { Card, CardContent, CardHeader } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Avatar } from '../components/common/Avatar';
import { Modal } from '../components/common/Modal';
import { Input, Textarea, Select } from '../components/common/Input';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const statusConfig = {
  todo: { label: '待开始', icon: Circle, color: '#94a3b8', bgColor: 'bg-gray-100' },
  in_progress: { label: '进行中', icon: Clock, color: '#f59e0b', bgColor: 'bg-amber-50' },
  completed: { label: '已完成', icon: CheckCircle, color: '#10b981', bgColor: 'bg-green-50' },
};

export default function Tracking() {
  const tasks = useTaskStore((state) => state.tasks);
  const { clients } = useClientStore();
  const { addTask, updateTaskStatus, deleteTask } = useTaskStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    clientId: '',
    title: '',
    description: '',
    dueDate: '',
  });

  const getClient = (clientId: string) => {
    return clients.find((c) => c.id === clientId);
  };

  const handleAddTask = () => {
    if (formData.clientId && formData.title) {
      setLoading(true);
      setTimeout(() => {
        addTask({
          ...formData,
          status: 'todo',
        });
        setShowAddModal(false);
        setFormData({
          clientId: '',
          title: '',
          description: '',
          dueDate: '',
        });
        setLoading(false);
      }, 500);
    }
  };

  const handleToggleStatus = (task: Task) => {
    const nextStatus: Record<TaskStatus, TaskStatus> = {
      todo: 'in_progress',
      in_progress: 'completed',
      completed: 'todo',
    };
    updateTaskStatus(task.id, nextStatus[task.status]);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((t) => t.status === status);
  };

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const todoCount = tasks.filter((t) => t.status === 'todo').length;

  const pieData = [
    { name: '已完成', value: completedCount, color: '#10b981' },
    { name: '进行中', value: inProgressCount, color: '#f59e0b' },
    { name: '待开始', value: todoCount, color: '#94a3b8' },
  ];

  const renderTaskCard = (task: Task) => {
    const client = getClient(task.clientId);
    const StatusIcon = statusConfig[task.status].icon;

    return (
      <div
        key={task.id}
        className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
      >
        <div className="flex items-start gap-3">
          <button
            onClick={() => handleToggleStatus(task)}
            className="mt-0.5"
          >
            <StatusIcon className="w-5 h-5" style={{ color: statusConfig[task.status].color }} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-800 text-sm">{task.title}</h4>
            </div>
            {task.description && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
            )}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <Avatar name={client?.name || ''} src={client?.avatar} size="sm" />
                <span className="text-xs text-gray-500">{client?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {task.dueDate}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">方案跟踪</h1>
          <p className="text-gray-500 mt-1">跟踪探索任务完成情况</p>
        </div>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" />
          添加任务
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent>
            <h3 className="font-semibold text-gray-800 mb-4">任务概览</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">完成率</span>
                <span className="font-semibold text-[#10b981]">
                  {tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#10b981] rounded-full transition-all"
                  style={{
                    width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['todo', 'in_progress', 'completed'] as TaskStatus[]).map((status) => (
            <div key={status}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: statusConfig[status].color }}
                  />
                  <h3 className="font-medium text-gray-700">
                    {statusConfig[status].label}
                  </h3>
                  <Badge size="sm">{getTasksByStatus(status).length}</Badge>
                </div>
              </div>
              <div className="space-y-3 min-h-[300px]">
                {getTasksByStatus(status).length === 0 ? (
                  <div className="text-center py-8 text-sm text-gray-400">
                    暂无任务
                  </div>
                ) : (
                  getTasksByStatus(status).map(renderTaskCard)
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="添加新任务"
        size="md"
      >
        <div className="p-6 space-y-4">
          <Select
            label="选择来访者"
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            options={[
              { value: '', label: '请选择来访者' },
              ...clients.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
          <Input
            label="任务标题"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="输入任务标题..."
          />
          <Textarea
            label="任务描述"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="输入任务详细描述..."
            rows={3}
          />
          <Input
            label="截止日期"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>
              取消
            </Button>
            <Button
              variant="primary"
              onClick={handleAddTask}
              loading={loading}
              disabled={!formData.clientId || !formData.title}
            >
              添加任务
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
